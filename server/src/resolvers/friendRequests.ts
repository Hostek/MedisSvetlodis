import { FieldError, MyContext } from "../types.js"
import { isAuth } from "../middleware/isAuth.js"
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql"
import { AppDataSource } from "../DataSource.js"
import { FriendRequestToken } from "../entities/FriendRequestToken.js"
import { errors } from "@hostek/shared"
import { FriendRequests } from "../entities/FriendsRequests.js"
import { User } from "../entities/User.js"

@Resolver()
export class FriendRequestsResolver {
    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async createFriendRequest(
        @Arg("friendRequestToken") friendRequestToken: string,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        try {
            return await AppDataSource.transaction<FieldError | null>(
                "SERIALIZABLE",
                async (tm) => {
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
                        return {
                            message: errors.tokenNotFound,
                        }
                    }

                    const tokenId = foundToken.id
                    const senderId = ctx.req.session.userId

                    // make sure user can't send friend request to themselves ...
                    if (senderId === foundToken.userId) {
                        return {
                            message: errors.cantSendFriendRequestToYourself,
                        }
                    }

                    // check if user already sent friend request using given token
                    const existingFriendRequest = await tm
                        .getRepository(FriendRequests)
                        .findOne({
                            where: {
                                requestTokenId: tokenId,
                                senderId,
                            },
                        })

                    if (existingFriendRequest !== null) {
                        return {
                            message: errors.friendRequestAlreadySent,
                        }
                    }

                    // send friend request
                    await tm
                        .getRepository(FriendRequests)
                        .create({
                            senderId,
                            requestTokenId: tokenId,
                        })
                        .save()

                    // update count for the token itself
                    await tm.getRepository(FriendRequestToken).update(
                        {
                            id: foundToken.id,
                        },
                        {
                            usage_count: () => `usage_count + 1`,
                        }
                    )

                    // update count for the token owner
                    await tm.getRepository(User).update(
                        {
                            id: foundToken.userId,
                        },
                        {
                            numberOfFriendRequests: () =>
                                `numberOfFriendRequests + 1`,
                        }
                    )

                    return null
                }
            )
        } catch {
            return { message: errors.unknownError }
        }
    }
}
