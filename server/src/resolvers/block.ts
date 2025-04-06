import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql"
import { Block } from "../entities/Block.js"
import { FieldError, MyContext } from "../types.js"
import { isAuth } from "../middleware/isAuth.js"
import { errors } from "@hostek/shared"
import { User } from "../entities/User.js"

@Resolver()
export class BlockResolver {
    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async blockUser(
        @Arg("userId") userId: number,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        if (userId === ctx.req.session.userId) {
            return { message: errors.cannotBlockYourself }
        }

        const userExists = await User.countBy({ id: userId })
        if (!userExists) return { message: errors.userNotFound }

        try {
            await Block.insert({
                blockerId: ctx.req.session.userId,
                blockedId: userId,
            })
        } catch (error) {
            // postgres duplicate error
            if (error.code === "23505") return null
            return { message: errors.unknownError }
        }

        return null
    }

    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async unblockUser(
        @Arg("userId") userId: number,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        try {
            const result = await Block.delete({
                blockerId: ctx.req.session.userId,
                blockedId: userId,
            })

            if (result.affected === 0) {
                return { message: errors.notBlocked }
            }
        } catch {
            return { message: errors.unknownError }
        }
        // return result.affected! > 0
        return null
    }
}
