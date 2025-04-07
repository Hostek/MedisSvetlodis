import {
    errors,
    getUsernameError,
    UUID_Regex,
    verifyOAuthProof,
} from "@hostek/shared"
import argon2 from "argon2"
import {
    Arg,
    Ctx,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql"
import { COOKIE_NAME } from "../constants.js"
import { User } from "../entities/User.js"
import { FieldError, LoginResponse, MyContext } from "../types.js"
import { verifyEmailAndPassword } from "../utils/validateEmailAndPassword.js"
import { loginRateLimiter } from "../rateLimiters.js"
import { isAuth } from "../middleware/isAuth.js"
import { v4 as uuid } from "uuid"

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
            identifier: uuid(),
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
        @Ctx() { req, ip }: MyContext
    ): Promise<LoginResponse> {
        try {
            await loginRateLimiter.consume(ip)
        } catch (error) {
            return { errors: [{ message: errors.tooManyRequests }] }
        }

        const areErrors = verifyEmailAndPassword(email, password)
        if (areErrors) {
            return { errors: [{ message: areErrors }] }
        }

        let user = await User.findOne({ where: { email } })

        // Handle OAuth flow
        if (oauthProof) {
            if (password)
                return {
                    errors: [{ message: errors.passwordNotAllowedWithOAuth }],
                }

            const isValidProof = await verifyOAuthProof(
                oauthProof,
                email,
                process.env.OAUTH_PROOF_SECRET!
            )

            if (!isValidProof) {
                return { errors: [{ message: errors.invalidOAuthProof }] }
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
                                message: errors.registrationFailed,
                            },
                        ],
                    }
                }
            }

            req.session.userId = user.id
            return { user }
        }

        // Handle password flow
        if (!user) return { errors: [{ message: errors.userNotFound }] }
        if (!password) return { errors: [{ message: errors.passwordRequired }] }
        if (user.password === "" || user.password.length < 3)
            return { errors: [{ message: errors.pleaseUseOAuthProvider }] }

        const isValid = await argon2.verify(user.password, password)
        if (!isValid) return { errors: [{ message: errors.invalidPassword }] }

        req.session.userId = user.id
        return { user }
    }

    @Mutation(() => LoginResponse)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { req, ip }: MyContext
    ): Promise<LoginResponse> {
        try {
            await loginRateLimiter.consume(ip)
        } catch (error) {
            return { errors: [{ message: errors.tooManyRequests }] }
        }

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
                        message: errors.registrationFailed,
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

    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async updateUsername(
        @Arg("newUsername") newUsername: string,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        const userId = ctx.req.session.userId

        const areErrors = getUsernameError(newUsername)
        if (areErrors) {
            return { message: areErrors }
        }

        const res = await User.createQueryBuilder("u")
            .update()
            .set({
                username: newUsername,
                updateUsernameAttempts: () => `"updateUsernameAttempts" - 1`,
            })
            .where("id = :id", { id: userId })
            .andWhere(`"updateUsernameAttempts" > 0`)
            .execute()

        if (res.affected === 0) {
            return { message: errors.cantUpdateUsername }
        }

        return null
    }

    @Mutation(() => FieldError, { nullable: true })
    @UseMiddleware(isAuth)
    async updatePassword(
        @Arg("newPassword") newPassword: string,
        @Arg("oldPassword", () => String, { nullable: true })
        oldPassword: string | null,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        const userId = ctx.req.session.userId

        let areErrors = verifyEmailAndPassword("test@test.com", newPassword)
        if (!areErrors) {
            areErrors = verifyEmailAndPassword("test@test.com", oldPassword)
        }

        if (areErrors) {
            return { message: areErrors }
        }

        const user = await User.findOne({
            where: { id: userId },
        })

        if (!user) {
            return { message: errors.unknownError }
        }

        if (user.password !== "" && user.password.length > 0) {
            if (!oldPassword) {
                return { message: errors.passwordRequired }
            }
            const isValid = await argon2.verify(user.password, oldPassword)
            if (!isValid) return { message: errors.invalidPassword }
        }

        const passwordHash = await argon2.hash(newPassword)

        const res = await User.createQueryBuilder("u")
            .update()
            .set({
                password: passwordHash,
            })
            .where("id = :id", { id: userId })
            .execute()

        if (res.affected === 0) {
            return { message: errors.unknownError }
        }

        return null
    }

    @Query(() => LoginResponse)
    async getUserByPublicId(
        @Arg("publicId") publicId: string
    ): Promise<LoginResponse> {
        if (!UUID_Regex.test(publicId)) {
            return { errors: [{ message: errors.invalidToken }] }
        }
        try {
            const result = await User.findOne({
                where: { identifier: publicId },
                select: ["identifier", "username", "id"],
            })
            if (!result) {
                return { errors: [{ message: errors.userNotFound }] }
            }
            return { user: result }
        } catch {
            return { errors: [{ message: errors.unknownError }] }
        }
    }
}
