import { errors } from "@hostek/shared"
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql"
import { AppDataSource } from "../DataSource.js"
import { Block } from "../entities/Block.js"
import { FriendRequests } from "../entities/FriendsRequests.js"
import { User } from "../entities/User.js"
import { isAuth } from "../middleware/isAuth.js"
import { FieldError, MyContext } from "../types.js"

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
            await AppDataSource.transaction(async (tm) => {
                await tm.getRepository(Block).insert({
                    blockerId: ctx.req.session.userId,
                    blockedId: userId,
                })

                // auto-reject friend requests
                await tm
                    .getRepository(FriendRequests)
                    .createQueryBuilder()
                    .update()
                    .set({ status: "rejected" })
                    .where("status = :status", { status: "pending" })
                    .andWhere("senderId IN (:...senderIds)", {
                        senderIds: [ctx.req.session.userId, userId],
                    })
                    .andWhere(
                        "requestTokenId IN " +
                            `(SELECT id FROM friend_request_token WHERE "userId" IN (:...userIds))`,
                        { userIds: [ctx.req.session.userId, userId] }
                    )
                    .execute()
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
