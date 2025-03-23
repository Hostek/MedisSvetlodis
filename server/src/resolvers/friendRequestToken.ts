import { errors } from "@hostek/shared"
import { Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql"
import { v4 as uuid } from "uuid"
import { AppDataSource } from "../DataSource.js"
import { FriendRequestToken } from "../entities/FriendRequestToken.js"
import { User } from "../entities/User.js"
import { isAuth } from "../middleware/isAuth.js"
import { FieldError, MyContext } from "../types.js"

@Resolver()
export class FriendRequestTokenResolver {
    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async createDefaultTokens(
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        const userId = ctx.req.session.userId
        // const user = await User.findOne({ where: { id: userId } })

        try {
            await AppDataSource.manager.transaction(async (tm) => {
                const user = await tm.getRepository(User).findOne({
                    where: { id: userId },
                    lock: { mode: "pessimistic_write" }, // Lock the row
                })

                if (!user) {
                    // return { message: errors.userNotFound }
                    throw new Error(errors.userNotFound)
                }

                if (user.generatedDefaultFriendRequestTokens) {
                    // return { message: errors.tokensAlreadyGenerated }
                    throw new Error(errors.tokensAlreadyGenerated)
                }

                await tm
                    .getRepository(User)
                    .update(
                        { id: userId },
                        { generatedDefaultFriendRequestTokens: true }
                    )

                await tm.getRepository(FriendRequestToken).insert(
                    Array(3)
                        .fill(null)
                        .map(() => ({
                            userId,
                            token: uuid(),
                        }))
                )
            })
        } catch (err) {
            if (
                err instanceof Error &&
                (
                    [
                        errors.userNotFound,
                        errors.tokensAlreadyGenerated,
                    ] as string[]
                ).includes(err.message)
            ) {
                return { message: err.message }
            }

            return { message: errors.unknownError }
        }

        return null
    }
}
