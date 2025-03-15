import { Message } from "../entities/Message.js"
import { Query, Resolver } from "type-graphql"

@Resolver()
export class MessageResolver {
    @Query(() => [Message])
    async getAllMessages(): Promise<Message[]> {
        const res = await Message.find()

        return res
    }
}
