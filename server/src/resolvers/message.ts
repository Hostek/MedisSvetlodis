import { errors, generateChannelId, getMessageError } from "@hostek/shared"
import {
    Arg,
    Ctx,
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
import { messageRateLimiter } from "../rateLimiters.js"

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
        // @Arg("friendId", () => Int) friendId: number,
        @Arg("friendIdentifier", () => String) friendIdentifier: string,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        try {
            await messageRateLimiter.consume(ctx.ip)
        } catch (error) {
            return { message: errors.tooManyRequests }
        }

        const creatorId = ctx.req.session.userId

        // if (creatorId === friendId) {
        //     return { message: "You cannot message yourself." }
        // }

        const msgError = getMessageError(content)
        if (msgError) {
            return { message: msgError }
        }

        const userRepo = AppDataSource.getRepository(User)
        const blockRepo = AppDataSource.getRepository(Block)
        const channelRepo = AppDataSource.getRepository(Channel)
        // const messageRepo = AppDataSource.getRepository(Message)

        // Fetch both users and validate existence + friendship + block in one go
        const [creator, friend] = await Promise.all([
            userRepo.findOne({
                where: { id: creatorId },
                relations: ["friends"],
            }),
            userRepo.findOne({
                // where: { id: friendId },
                where: { identifier: friendIdentifier },
                relations: ["friends"],
            }),
        ])

        if (!creator || !friend) {
            return { message: errors.unknownError }
        }

        if (creator.identifier === friendIdentifier) {
            return { message: errors.cannotMessageYourself }
        }

        const isFriend =
            creator.friends.some((f) => f.identifier === friendIdentifier) ||
            friend.friends.some((f) => f.id === creatorId)

        if (!isFriend) {
            return { message: errors.youCanOnlyMessageYourFriends }
        }

        // Check block in both directions
        const isBlocked = await blockRepo
            .createQueryBuilder("block")
            .where(
                "(block.blockerId = :creatorId AND block.blockedId = :friendId) OR (block.blockerId = :friendId AND block.blockedId = :creatorId)"
            )
            .setParameters({ creatorId, friendId: friend.id })
            .getExists()

        if (isBlocked) {
            return { message: errors.youCannotMessageThisUser }
        }

        // Determine channel
        const channelIdentifier = generateChannelId(
            creator.identifier,
            friend.identifier
        )

        let channel = await channelRepo.findOne({
            where: { uniqueIdentifier: channelIdentifier },
        })

        if (!channel) {
            try {
                const insertResult = await channelRepo
                    .createQueryBuilder()
                    .insert()
                    .into(Channel)
                    .values({
                        uniqueIdentifier: channelIdentifier,
                    })
                    .returning("*")
                    .execute()

                channel = insertResult.raw[0]

                if (!channel) {
                    return { message: errors.unknownError }
                }
            } catch (err: any) {
                // Check for unique constraint violation
                if (err.code === "23505") {
                    // Channel was created by the other user at the same time — fetch it again
                    channel = await channelRepo.findOne({
                        where: { uniqueIdentifier: channelIdentifier },
                    })

                    if (!channel) {
                        return { message: errors.unknownError }
                    }
                } else {
                    // Some other DB error
                    return { message: errors.unknownError }
                }
            }
        }

        // Insert and fetch message in a single transaction
        let message: Message | null = null

        await AppDataSource.transaction(async (manager) => {
            const result = await manager
                .createQueryBuilder()
                .insert()
                .into(Message)
                .values({ creatorId, content, channelId: channel.id })
                .returning("*")
                .execute()

            const insertedId = result.raw[0]?.id
            if (!insertedId) throw new Error("Message creation failed")

            message = await manager
                .getRepository(Message)
                .createQueryBuilder("m")
                .leftJoinAndSelect("m.creator", "creator")
                .where("m.id = :id", { id: insertedId })
                .getOne()
        })

        if (!message) {
            // throw new Error(errors.unknownError)
            return { message: errors.unknownError }
        }

        // console.log({ message })

        // Publish message events asynchronously
        void pubSub.publish(`MESSAGE_ADDED_${creatorId}`, message)
        void pubSub.publish(`MESSAGE_ADDED_${friend.id}`, message)

        // console.log(
        //     "publishing to topics:",
        //     `MESSAGE_ADDED_${creatorId}`,
        //     `MESSAGE_ADDED_${friend.id}`
        // )

        return null
    }

    // important: use middleware for security reasons!
    @Subscription(() => Message, {
        topics: ({ context }) => {
            // console.log({ cookie_ctx: context.req.session.userId })
            return [`MESSAGE_ADDED_${context.req.session.userId}`]
        },
    })
    @UseMiddleware(isAuth)
    usrMessageAdded(
        @Root() messagePayload: Message
        // @Ctx() ctx: MyContext
    ): Message {
        // const userId = ctx.req.session.userId
        // console.log({ l: pubSub.asyncIterator(`MESSAGE_ADDED_${userId}`) })
        // return pubSub.asyncIterator(`MESSAGE_ADDED_${userId}`)
        return messagePayload
    }
}
