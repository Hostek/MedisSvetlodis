import {
    errors,
    FRIEND_REQUEST_STATUS_OBJ,
    FRIEND_REQUEST_TOKEN_STATUS_OBJ,
} from "@hostek/shared"
import {
    Arg,
    Ctx,
    Int,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql"
import { AppDataSource } from "../DataSource.js"
import { FriendRequestToken } from "../entities/FriendRequestToken.js"
import { FriendRequests } from "../entities/FriendsRequests.js"
import { User } from "../entities/User.js"
import { isAuth } from "../middleware/isAuth.js"
import { FieldError, MyContext } from "../types.js"
import { withSerializableRetry } from "../utils/withSerializableRetry.js"

@Resolver()
export class FriendRequestsResolver {
    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async createFriendRequest(
        @Arg("friendRequestToken") friendRequestToken: string,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        try {
            return await withSerializableRetry(() =>
                AppDataSource.transaction<null>("SERIALIZABLE", async (tm) => {
                    // check if token exists or if it is not deleted
                    const foundToken = await tm
                        .getRepository(FriendRequestToken)
                        .findOne({
                            where: {
                                token: friendRequestToken,
                                status: "active",
                            },
                        })

                    if (!foundToken) {
                        throw new Error(errors.tokenNotFound)
                    }

                    // const tokenId = foundToken.id
                    const senderId = ctx.req.session.userId

                    // make sure user can't send friend request to themselves ...
                    if (senderId === foundToken.userId) {
                        throw new Error(errors.cantSendFriendRequestToYourself)
                    }

                    // create friend request (and automatically check if user already sent friend request using given token)
                    // Create friend request (let unique constraint handle duplicates)
                    try {
                        await tm.getRepository(FriendRequests).save({
                            senderId,
                            requestTokenId: foundToken.id,
                        })
                    } catch (error) {
                        // Handle unique constraint violation
                        if (error.code === "23505") {
                            // PostgreSQL unique violation code
                            throw new Error(errors.friendRequestAlreadySent)
                        }

                        throw error
                    }

                    // check if usage_count is good
                    if (foundToken.max_limit) {
                        const updatedToken = await tm
                            .getRepository(FriendRequestToken)
                            .createQueryBuilder()
                            .where("id = :id AND usage_count < :max_limit", {
                                id: foundToken.id,
                                max_limit: foundToken.max_limit,
                            })
                            .update({
                                usage_count: () => "usage_count + 1",
                            })
                            .returning("usage_count")
                            .execute()

                        if (updatedToken.affected === 0) {
                            throw new Error(errors.tokenUsageExhausted)
                        }
                    } else {
                        // update count for the token itself
                        await tm.getRepository(FriendRequestToken).update(
                            {
                                id: foundToken.id,
                            },
                            {
                                usage_count: () => "usage_count + 1",
                            }
                        )
                    }

                    // update count for the token owner
                    await tm.getRepository(User).update(
                        {
                            id: foundToken.userId,
                        },
                        {
                            numberOfFriendRequests: () =>
                                "numberOfFriendRequests + 1",
                        }
                    )

                    return null
                })
            )
        } catch (error) {
            if (error instanceof Error) {
                return { message: error.message }
            }
            return { message: errors.unknownError }
        }
    }

    @Query(() => [FriendRequests])
    @UseMiddleware(isAuth)
    async getFriendRequests(@Ctx() ctx: MyContext): Promise<FriendRequests[]> {
        const userId = ctx.req.session.userId

        const friendRequests = await FriendRequests.createQueryBuilder(
            "friendRequest"
        )
            .leftJoinAndSelect("friendRequest.requestToken", "requestToken")
            .leftJoinAndSelect("friendRequest.sender", "sender")
            .where("requestToken.userId = :userId", { userId: userId })
            .andWhere("friendRequest.status = :status", {
                status: FRIEND_REQUEST_STATUS_OBJ.pending,
            })
            .andWhere("requestToken.status = :rstatus", {
                rstatus: FRIEND_REQUEST_TOKEN_STATUS_OBJ.active,
            })
            .orderBy("friendRequest.createdAt", "DESC")
            .getMany()

        return friendRequests
    }

    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async acceptFriendRequest(
        @Arg("friendRequestId", () => Int) friendRequestId: number,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        // Validate input
        if (friendRequestId <= 0) {
            return { message: errors.invalidInput }
        }

        try {
            const userId = ctx.req.session.userId

            await AppDataSource.manager.transaction(async (tm) => {
                const subQb = tm
                    .getRepository(FriendRequests)
                    .createQueryBuilder("fr")
                    .select("fr.id")
                    .innerJoin("fr.requestToken", "rt")
                    .where("rt.userId = :userId", { userId })
                    .andWhere("fr.id = :friendRequestId", { friendRequestId })

                const [subQuery, subParams] = subQb.getQueryAndParameters()

                // update friend request's status
                const response = await tm
                    .getRepository(FriendRequests)
                    .createQueryBuilder()
                    .update()
                    .set({ status: FRIEND_REQUEST_STATUS_OBJ.accepted })
                    .where(`id IN (${subQuery})`)
                    .andWhere("status = :rstatus")
                    .setParameters({
                        ...subParams,
                        rstatus: FRIEND_REQUEST_STATUS_OBJ.pending,
                    })
                    .execute()

                if (response.affected === 0) {
                    throw new Error(errors.friendRequestNotFound)
                }

                // just get senderId
                const friendRequest = await tm
                    .getRepository(FriendRequests)
                    .findOneOrFail({
                        where: { id: friendRequestId },
                        select: ["senderId"], // Only fetch needed field
                    })

                const [userA, userB] = await Promise.all([
                    tm.getRepository(User).findOneOrFail({
                        where: { id: userId },
                    }),
                    tm.getRepository(User).findOneOrFail({
                        where: { id: friendRequest.senderId },
                    }),
                ])

                // Check existing friendship in either direction
                const existing = await tm
                    .getRepository(User)
                    .createQueryBuilder("user")
                    .innerJoin("user.friends", "friend")
                    .where("(user.id = :idA AND friend.id = :idB)")
                    .orWhere("(user.id = :idB AND friend.id = :idA)")
                    .setParameters({ idA: userA.id, idB: userB.id })
                    .getExists()

                if (existing) {
                    throw new Error(errors.friendshipAlreadyExists)
                }

                // Add bidirectional relationships
                await tm
                    .getRepository(User)
                    .createQueryBuilder()
                    .relation(User, "friends")
                    .of(userA)
                    .add(userB)

                await tm
                    .getRepository(User)
                    .createQueryBuilder()
                    .relation(User, "friends")
                    .of(userB)
                    .add(userA)

                // await tm.getRepository(User).save([userA, userB])
            })
        } catch (error) {
            if (error instanceof Error) {
                return { message: errors.unknownError }
            }
            return { message: errors.unknownError }
        }
        return null
    }
}
