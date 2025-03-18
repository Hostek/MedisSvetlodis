import { pubSub } from "../pubSub.js"
import { Message } from "../entities/Message.js"
import {
    Arg,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
    Subscription,
    UseMiddleware,
} from "type-graphql"
import { errors } from "@hostek/shared"
import { isAuth } from "../middleware/isAuth.js"

@Resolver()
export class MessageResolver {
    @Query(() => [Message])
    @UseMiddleware(isAuth)
    async getAllMessages(): Promise<Message[]> {
        const res = await Message.createQueryBuilder("m")
            .leftJoinAndSelect("m.creator", "creator")
            .getMany()

        return res
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async createMessage(
        @Arg("creatorId", () => Int) creatorId: number,
        @Arg("content") content: string
    ) {
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

        return true
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
