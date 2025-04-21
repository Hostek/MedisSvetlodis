import { generateRandomString } from "../utils/generateRandomString.js"
import { Arg, Ctx, Int, Mutation, Resolver } from "type-graphql"
import { isInProduction } from "../constants.js"
import { FieldError, MyContext } from "../types.js"
import { UserResolver } from "./user.js"
import { AppDataSource } from "../DataSource.js"
import { User } from "../entities/User.js"

@Resolver()
export class ServerResolver {
    @Mutation(() => FieldError, { nullable: true })
    async createHoaxUsers(
        @Arg("secret_key") secret_key: string,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        if (isInProduction) return null
        if (secret_key !== process.env.PRIVATE_SERVER_KEY) return null

        const ur = new UserResolver()

        for (let i = 0; i < 100; i++) {
            const email = `${generateRandomString()}@testhoax.com`
            const password = process.env.HOAX_USER_PASSWORD

            const res = await ur.register(email, password, ctx, true)

            if (res.errors && res.errors.length > 0) {
                console.log("error!")
                return res.errors[0]
            }

            // else gitara ! (git)
        }

        return null
    }

    @Mutation(() => FieldError, { nullable: true })
    async createHoaxUsersAndAddToFriends(
        @Arg("secret_key") secret_key: string,
        @Arg("userId", () => Int) userId: number,
        @Ctx() ctx: MyContext
    ): Promise<FieldError | null> {
        if (isInProduction) return null
        if (secret_key !== process.env.PRIVATE_SERVER_KEY) return null

        const ur = new UserResolver()

        const userA = await AppDataSource.getRepository(User).findOneOrFail({
            where: { id: userId },
        })

        for (let i = 0; i < 100; i++) {
            const email = `${generateRandomString()}@testhoax.com`
            const password = process.env.HOAX_USER_PASSWORD

            const res = await ur.register(email, password, ctx, true)

            if (res.errors && res.errors.length > 0) {
                console.log("error!")
                return res.errors[0]
            }

            // else gitara ! (git)

            const userB = res.user

            // console.log({ res })

            await AppDataSource.getRepository(User)
                .createQueryBuilder()
                .relation(User, "friends")
                .of(userA)
                .add(userB)

            await AppDataSource.getRepository(User)
                .createQueryBuilder()
                .relation(User, "friends")
                .of(userB)
                .add(userA)
        }

        return null
    }
}
