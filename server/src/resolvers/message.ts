import { Message } from "../entities/Message.js"
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql"

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
        await Message.createQueryBuilder()
            .insert()
            .values({
                content,
                creatorId,
            })
            .execute()

        return true
    }
}
