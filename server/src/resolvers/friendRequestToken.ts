import { errors } from "@hostek/shared"
import {
    Arg,
    Ctx,
    Int,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql"
import { EntityManager, Not } from "typeorm"
import { v4 as uuid } from "uuid"
import { AppDataSource } from "../DataSource.js"
import { FriendRequestToken } from "../entities/FriendRequestToken.js"
import { User } from "../entities/User.js"
import { isAuth } from "../middleware/isAuth.js"
import { FieldError, FriendRequestTokenOrError, MyContext } from "../types.js"

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

    // user has only 3 friend request tokens, so pagination not needed
    @Query(() => [FriendRequestToken])
    @UseMiddleware(isAuth)
    async friendRequestTokensOfUser(
        @Ctx() ctx: MyContext
    ): Promise<FriendRequestToken[]> {
        const userId = ctx.req.session.userId

        const tokens = await FriendRequestToken.find({
            where: {
                userId: userId,
                status: Not("deleted" as const),
            },
        })

        return tokens
    }

    private async updateTokenStatus(
        tokenId: number,
        userId: number,
        newStatus: "active" | "blocked",
        errorMessage: string,
        manager?: EntityManager
    ): Promise<FieldError | null> {
        const qb = manager
            ? manager.createQueryBuilder(FriendRequestToken, "r")
            : FriendRequestToken.createQueryBuilder()

        const res = await qb
            .update()
            .where("id = :tid", { tid: tokenId })
            .andWhere("status != :statusdeleted", {
                statusdeleted: "deleted",
            })
            .andWhere(`"userId" = :uid`, { uid: userId })
            .set({ status: newStatus })
            .execute()

        return res.affected === 0 ? { message: errorMessage } : null
    }

    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async blockFriendRequestToken(
        @Arg("tokenId", () => Int) tokenId: number,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        return this.updateTokenStatus(
            tokenId,
            ctx.req.session.userId,
            "blocked",
            errors.couldntBlockFriendRequestToken
        )
    }

    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async unblockFriendRequestToken(
        @Arg("tokenId", () => Int) tokenId: number,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        return this.updateTokenStatus(
            tokenId,
            ctx.req.session.userId,
            "active",
            errors.couldntUnBlockFriendRequestToken
        )
    }

    // Toggle using current DB state
    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async toggleBlockFriendRequestToken(
        @Arg("tokenId", () => Int) tokenId: number,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        try {
            return await AppDataSource.transaction<null>(async (manager) => {
                const token = await manager.findOne(FriendRequestToken, {
                    where: {
                        id: tokenId,
                        userId: ctx.req.session.userId,
                        status: Not("deleted" as const),
                    },
                })

                if (!token) throw new Error(errors.tokenNotFound)

                const newStatus =
                    token.status === "active" ? "blocked" : "active"
                const isError = await this.updateTokenStatus(
                    tokenId,
                    ctx.req.session.userId,
                    newStatus,
                    newStatus === "blocked"
                        ? errors.couldntBlockFriendRequestToken
                        : errors.couldntUnBlockFriendRequestToken,
                    manager
                )

                if (isError) throw new Error(isError.message)

                return null
            })
        } catch (error) {
            if (error instanceof Error) {
                return { message: error.message }
            }
            return { message: errors.unknownError }
        }
    }

    @Mutation(() => FriendRequestTokenOrError)
    @UseMiddleware(isAuth)
    async regenerateFriendRequestToken(
        @Arg("tokenId", () => Int) tokenId: number,
        @Ctx() ctx: MyContext
    ): Promise<FriendRequestTokenOrError> {
        const userId = ctx.req.session.userId

        try {
            return await AppDataSource.transaction<{
                token: FriendRequestToken
            }>(async (tm) => {
                const token = await tm
                    .getRepository(FriendRequestToken)
                    .findOne({
                        where: {
                            id: tokenId,
                            userId: userId,
                            status: Not("deleted" as const),
                        },
                    })

                if (!token) {
                    throw new Error(errors.tokenNotFound)
                }

                await tm.update(
                    FriendRequestToken,
                    {
                        id: tokenId,
                    },
                    {
                        status: "deleted",
                        deletedDate: () => "CURRENT_TIMESTAMP",
                    }
                )

                const newToken = await tm
                    .create(FriendRequestToken, {
                        userId,
                        token: uuid(),
                    })
                    .save()

                return { token: newToken }
            })
        } catch (error) {
            if (error instanceof Error)
                return { errors: [{ message: error.message }] }
            return { errors: [{ message: errors.unknownError }] }
        }
    }

    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async updateMaxLimitFriendRequestToken(
        @Arg("tokenId", () => Int) tokenId: number,
        @Arg("new_max_limit", () => Int, { nullable: true })
        new_max_limit: number | null,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        const userId = ctx.req.session.userId

        // basic validation:
        if (typeof new_max_limit === "number" && new_max_limit < 0) {
            return { message: errors.limitCannotBeNegative }
        }

        if (tokenId <= 0) {
            return { message: errors.tokenNotFound }
        }

        try {
            const result = await FriendRequestToken.update(
                {
                    userId,
                    id: tokenId,
                    status: Not("deleted" as const),
                },
                {
                    max_limit: new_max_limit,
                }
            )

            if (result.affected === 0) {
                return { message: errors.tokenNotFound }
            }
        } catch (error) {
            // if (error instanceof Error) {
            //     return { message: error.message }
            // }
            return { message: errors.unknownError }
        }

        return null
    }

    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async resetUsageCountFriendRequestToken(
        @Arg("tokenId", () => Int) tokenId: number,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        const userId = ctx.req.session.userId

        if (tokenId <= 0) {
            return { message: errors.tokenNotFound }
        }

        try {
            const result = await FriendRequestToken.update(
                {
                    userId,
                    id: tokenId,
                    status: Not("deleted" as const),
                },
                {
                    usage_count: 0,
                }
            )

            if (result.affected === 0) {
                return { message: errors.tokenNotFound }
            }
        } catch {
            return { message: errors.unknownError }
        }

        return null
    }
}
