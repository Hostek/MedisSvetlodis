import argon2 from "argon2"
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql"
import xss from "xss"
import { COOKIE_NAME, errors, isInProduction } from "../constants.js"
import { User } from "../entities/User.js"
import { LoginResponse, MyContext } from "../types.js"
import { validateEmailAndPasswordAndUsername } from "../utils/validateEmailAndPassword.js"

@Resolver()
export class UserResolver {
    // middleware isAuth is not needed here
    @Query(() => User, { nullable: true })
    async user(@Ctx() ctx: MyContext): Promise<User | null> {
        const { req } = ctx

        if (!req.session.userId) {
            return null
        }

        const user = await User.findOne({
            where: { id: req.session.userId },
        })

        if (user == null) {
            return null
        }

        // if (user.ban === "yes") {
        //     await this.logout(ctx)
        //     return null
        // }

        return user
    }

    @Mutation(() => LoginResponse!)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Arg("username") username: string,
        @Ctx() { req }: MyContext
    ): Promise<LoginResponse> {
        username = xss(username)

        const validation = validateEmailAndPasswordAndUsername(
            password,
            email,
            username
        )

        if (validation !== -1) {
            return { errors: [validation] }
        }

        const hashed_password = await argon2.hash(password)

        let user
        try {
            const result = await User.create({
                email,
                password: hashed_password,
                username: xss(username),
                // ban: "no",
                // type: "user",
            }).save()

            user = result
        } catch (error) {
            if (error.errno == 1062) {
                if (error.sqlMessage.includes("@")) {
                    return {
                        errors: [{ message: errors.emailTaken }],
                    }
                } else {
                    return {
                        errors: [
                            {
                                message: errors.usernameTaken,
                            },
                        ],
                    }
                }
            }

            return {
                errors: [{ message: errors.unknownError }],
            }
        }

        req.session.userId = user.id

        return { user }
    }

    @Mutation(() => LoginResponse!)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<LoginResponse> {
        const user = await User.findOne({
            where: { email },
        })
        if (!user) {
            return {
                errors: [
                    isInProduction
                        ? {
                              message: errors.incorrectEmail,
                          }
                        : {
                              message: errors.emailDoesNotExist,
                          },
                ],
            }
        }

        const isPasswordValid = await argon2.verify(user.password, password)

        if (!isPasswordValid) {
            return {
                errors: [
                    {
                        message: errors.incorrectPassword,
                    },
                ],
            }
        }

        // if (user.ban === "yes") {
        //     return {
        //         errors: [{ message: "errors.userBanned" }],
        //     }
        // }

        req.session.userId = user.id

        return { user }
    }

    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
        return new Promise<boolean>((resolve) =>
            req.session.destroy((err) => {
                res.clearCookie(COOKIE_NAME)

                if (err) {
                    console.log({ err })
                    return resolve(false)
                }

                resolve(true)
            })
        )
    }
}
