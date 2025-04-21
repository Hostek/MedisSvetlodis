import { generateRandomString } from "../utils/generateRandomString.js"
import { Arg, Ctx, Mutation, Resolver } from "type-graphql"
import { isInProduction } from "../constants.js"
import { FieldError, MyContext } from "../types.js"
import { UserResolver } from "./user.js"

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
}
