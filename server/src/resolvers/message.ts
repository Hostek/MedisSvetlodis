import { errors, getMessageError } from "@hostek/shared"
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
import { FieldError, MyContext } from "../types.js"

@Resolver()
export class MessageResolver {
    // @TODO –> add pagination ..
    @Query(() => [Message])
    @UseMiddleware(isAuth)
    async getAllMessages(): Promise<Message[]> {
        const res = await Message.createQueryBuilder("m")
            .leftJoinAndSelect("m.creator", "creator")
            .getMany()

        return res
    }

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
            // console.log("pubsub")
            await pubSub.publish("MESSAGE_ADDED", msg)
        } catch {
            console.error("wtf")
        }

        return null
    }

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
}
