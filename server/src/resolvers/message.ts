import { errors, generateChannelId, getMessageError } from "@hostek/shared"
import {
    Arg,
    Ctx,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
    Subscription,
    UseMiddleware,
} from "type-graphql"
import { Message } from "../entities/Message.js"
import { isAuth } from "../middleware/isAuth.js"
import { pubSub } from "../pubSub.js"
import {
    FieldError,
    MessagesConnection,
    MyContext,
    PaginationCursorArgs,
} from "../types.js"
import { decodeCursor, encodeCursor } from "../utils/cursor.js"
import { Block } from "../entities/Block.js"
import { User } from "../entities/User.js"
import { AppDataSource } from "../DataSource.js"
import { Channel } from "../entities/Channel.js"

@Resolver()
export class MessageResolver {
    // // @TODO –> add pagination ..
    // @Query(() => [Message])
    // @UseMiddleware(isAuth)
    // async getAllMessages(): Promise<Message[]> {
    //     const res = await Message.createQueryBuilder("m")
    //         .leftJoinAndSelect("m.creator", "creator")
    //         .getMany()

    //     return res
    // }

    @Query(() => MessagesConnection)
    @UseMiddleware(isAuth)
    async getMessages(
        @Arg("input") input: PaginationCursorArgs
    ): Promise<MessagesConnection> {
        const messageQuery = Message.createQueryBuilder("m")
            .leftJoinAndSelect("m.creator", "creator")
            .orderBy("m.id", "DESC")
            .take(input.first + 1)

        // Apply cursor (if provided)
        if (input.after) {
            const afterId = decodeCursor(input.after)
            messageQuery.andWhere("m.id < :afterId", { afterId }) // DESC => use "<"
        }

        const messages = await messageQuery.getMany()
        const hasNextPage = messages.length > input.first
        if (hasNextPage) messages.pop()

        const edges = messages.map((msg) => ({
            node: msg,
            cursor: encodeCursor(msg.id),
        }))

        const totalCount = await Message.count()

        return {
            edges,
            totalCount,
            pageInfo: {
                startCursor: edges[0]?.cursor,
                endCursor: edges[edges.length - 1]?.cursor,
                hasNextPage,
            },
        }
    }

    /**
     * @TODO
     * @deprecated please - do not use – it's left for now as archive, will be reused, but pls
     *
     * @param content
     * @param ctx
     * @returns
     */
    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async createMessage(
        @Arg("content") content: string,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        const msg_error = getMessageError(content)
        if (msg_error) {
            return { message: msg_error }
        }

        const creatorId = ctx.req.session.userId

        const insertResult = await Message.createQueryBuilder()
            .insert()
            .into(Message)
            .values({
                creatorId,
                content,
            })
            // .returning("*") // Works in PostgreSQL
            .execute()

        const msg = await Message.createQueryBuilder("m")
            .leftJoinAndSelect("m.creator", "creator")
            .where("m.id = :id", { id: insertResult.raw[0].id })
            .getOne()

        if (!msg) {
            throw new Error(errors.unknownError)
        }

        try {
            console.log("pubsub ", { msg })
            await pubSub.publish("MESSAGE_ADDED", msg)
        } catch {
            console.error("wtf")
        }

        return null
    }

    /**
     *
     * @deprecated see `createMessage` mutation for more details ..
     *
     * will delete soon this @TODO
     */
    @Subscription(() => Message, {
        topics: "MESSAGE_ADDED",
        // For dynamic topics, use: topics: ({ args }) => `MESSAGE_ADDED_${args.channel}`
        // filter: ({ payload, args }) => args.channel === payload.channelId, // Optional filtering
    })
    @UseMiddleware(isAuth)
    messageAdded(
        @Root() messagePayload: Message
        // @Args() args: { channel: string } // Optional arguments
    ): Message {
        // console.log({ messagePayload })
        return messagePayload
    }

    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async createMessageFriend(
        @Arg("content") content: string,
        @Arg("friendId", () => Int) friendId: number,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        const creatorId = ctx.req.session.userId

        if (creatorId === friendId) {
            return { message: "You cannot send a message to yourself." }
        }

        const msg_error = getMessageError(content)
        if (msg_error) {
            return { message: msg_error }
        }

        const [userA, userB] = [creatorId, friendId]

        const tm = AppDataSource.manager

        // Check if users are friends (bidirectional)
        const areFriends = await tm
            .getRepository(User)
            .createQueryBuilder("user")
            .innerJoin("user.friends", "friend")
            .where("(user.id = :idA AND friend.id = :idB)")
            .orWhere("(user.id = :idB AND friend.id = :idA)")
            .setParameters({ idA: userA, idB: userB })
            .getExists()

        if (!areFriends) {
            return { message: "You can only message your friends." }
        }

        // Check for any blocking relationship (bidirectional)
        const isBlocked = await tm
            .getRepository(Block)
            .createQueryBuilder("block")
            .where(
                "(block.blockerId = :idA AND block.blockedId = :idB) OR (block.blockerId = :idB AND block.blockedId = :idA)"
            )
            .setParameters({ idA: userA, idB: userB })
            .getExists()

        if (isBlocked) {
            return { message: "You cannot message this user." }
        }

        const CreatorUser = await User.findOne({
            where: { id: creatorId },
        })
        const FriendUser = await User.findOne({ where: { id: friendId } })

        if (!CreatorUser || !FriendUser) {
            return { message: errors.unknownError }
        }

        const channelIdentifier = generateChannelId(
            CreatorUser.identifier,
            FriendUser.identifier
        )

        const LocalChannel = await Channel.findOne({
            where: { uniqueIdentifier: channelIdentifier },
        })

        if (!LocalChannel) {
            return { message: errors.unknownError }
        }

        // Insert the message
        const insertResult = await Message.createQueryBuilder()
            .insert()
            .into(Message)
            .values({
                creatorId,
                content,
                channelId: LocalChannel.id,
            })
            .execute()

        const msg = await Message.createQueryBuilder("m")
            .leftJoinAndSelect("m.creator", "creator")
            .where("m.id = :id", { id: insertResult.raw[0].id })
            .getOne()

        if (!msg) {
            throw new Error(errors.unknownError)
        }

        // Publish to both sender and friend
        try {
            await pubSub.publish(`MESSAGE_ADDED_${creatorId}`, msg)
            await pubSub.publish(`MESSAGE_ADDED_${friendId}`, msg)
        } catch (err) {
            console.error("PubSub error: ", err)
        }

        return null
    }
}
