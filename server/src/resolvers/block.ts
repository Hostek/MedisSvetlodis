import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql"
import { Block } from "../entities/Block.js"
import { MyContext } from "../types.js"
import { isAuth } from "../middleware/isAuth.js"

@Resolver()
export class BlockResolver {
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async blockUser(
        @Arg("userId") userId: number,
        @Ctx() ctx: MyContext
    ): Promise<boolean> {
        if (userId === ctx.req.session.userId) {
            throw new Error("Cannot block yourself")
        }

        await Block.create({
            blockerId: ctx.req.session.userId,
            blockedId: userId,
        }).save()

        return true
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async unblockUser(
        @Arg("userId") userId: number,
        @Ctx() ctx: MyContext
    ): Promise<boolean> {
        const result = await Block.delete({
            blockerId: ctx.req.session.userId,
            blockedId: userId,
        })
        return result.affected! > 0
    }
}
