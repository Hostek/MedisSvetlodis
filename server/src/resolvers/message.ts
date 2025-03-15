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
} from "type-graphql"

@Resolver()
export class MessageResolver {
    @Query(() => [Message])
    async getAllMessages(): Promise<Message[]> {
        const res = await Message.find()

        return res
    }

    @Mutation(() => Boolean)
    async createMessage(
        @Arg("creatorId", () => Int) creatorId: number,
        @Arg("content") content: string
    ) {
        const msg = await Message.create({
            creatorId,
            content,
        }).save()

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
    messageAdded(
        @Root() messagePayload: Message
        // @Args() args: { channel: string } // Optional arguments
    ): Message {
        // console.log({ messagePayload })
        return messagePayload
    }
}
