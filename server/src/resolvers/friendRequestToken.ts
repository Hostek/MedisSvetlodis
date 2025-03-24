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
        return AppDataSource.transaction(async (manager) => {
            const token = await manager.findOne(FriendRequestToken, {
                where: {
                    id: tokenId,
                    userId: ctx.req.session.userId,
                    status: Not("deleted" as const),
                },
            })

            if (!token) return { message: errors.tokenNotFound }

            const newStatus = token.status === "active" ? "blocked" : "active"
            return this.updateTokenStatus(
                tokenId,
                ctx.req.session.userId,
                newStatus,
                newStatus === "blocked"
                    ? errors.couldntBlockFriendRequestToken
                    : errors.couldntUnBlockFriendRequestToken,
                manager
            )
        })
    }

    @Mutation(() => FriendRequestTokenOrError)
    @UseMiddleware(isAuth)
    async regenerateFriendRequestToken(
        @Arg("tokenId", () => Int) tokenId: number,
        @Ctx() ctx: MyContext
    ): Promise<FriendRequestTokenOrError> {
        const userId = ctx.req.session.userId

        try {
            return await AppDataSource.transaction(async (tm) => {
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
        } catch {
            return { errors: [{ message: errors.unknownError }] }
        }
    }
}
