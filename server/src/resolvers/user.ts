import { verifyOAuthProof } from "@hostek/shared"
import argon2 from "argon2"
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql"
import { COOKIE_NAME } from "../constants.js"
import { User } from "../entities/User.js"
import { LoginResponse, MyContext } from "../types.js"
import { verifyEmailAndPassword } from "../utils/validateEmailAndPassword.js"

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

    // Shared registration logic
    private async registerUser(input: {
        email: string
        username?: string
        password?: string
        oauthProvider?: string
    }): Promise<User> {
        const existingUser = await User.findOne({
            where: { email: input.email },
        })
        if (existingUser) {
            throw new Error("User already exists")
            // return { errors: [{ message: "User already exists" }] }
        }

        const user = User.create({
            email: input.email,
            username: input.username || input.email.split("@")[0], // Default name
            password: input.password ? await argon2.hash(input.password) : "",
            // oauthProvider: input.oauthProvider,
        })

        await user.save()
        // return { user }
        return user
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("oauthProof", { nullable: true }) oauthProof: string,
        @Arg("password", { nullable: true }) password: string,
        @Ctx() { req }: MyContext
    ): Promise<LoginResponse> {
        const areErrors = verifyEmailAndPassword(email, password)
        if (areErrors) {
            return { errors: [{ message: areErrors }] }
        }

        let user = await User.findOne({ where: { email } })

        // Handle OAuth flow
        if (oauthProof) {
            if (password)
                return {
                    errors: [{ message: "Password not allowed with OAuth" }],
                }

            const isValidProof = await verifyOAuthProof(
                oauthProof,
                email,
                process.env.OAUTH_PROOF_SECRET!
            )

            if (!isValidProof) {
                return { errors: [{ message: "Invalid OAuth proof" }] }
            }

            // Auto-register if user doesn't exist
            if (!user) {
                try {
                    user = await this.registerUser({
                        email,
                    })
                } catch (error) {
                    return {
                        errors: [
                            {
                                message:
                                    error instanceof Error
                                        ? error.message
                                        : "Registration failed",
                            },
                        ],
                    }
                }
            }

            req.session.userId = user.id
            return { user }
        }

        // Handle password flow
        if (!user) return { errors: [{ message: "User not found" }] }
        if (!password) return { errors: [{ message: "Password required" }] }
        if (user.password === "" || user.password.length < 3)
            return { errors: [{ message: "Please, use OAuth provider" }] }

        const isValid = await argon2.verify(user.password, password)
        if (!isValid) return { errors: [{ message: "Invalid password" }] }

        req.session.userId = user.id
        return { user }
    }

    @Mutation(() => LoginResponse)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<LoginResponse> {
        const areErrors = verifyEmailAndPassword(email, password)
        if (areErrors) {
            return { errors: [{ message: areErrors }] }
        }

        try {
            const user = await this.registerUser({
                email,
                password,
            })

            req.session.userId = user.id
            return { user }
        } catch (error) {
            return {
                errors: [
                    {
                        message:
                            error instanceof Error
                                ? error.message
                                : "Registration failed",
                    },
                ],
            }
        }
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
