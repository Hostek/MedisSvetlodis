import { MiddlewareFn } from "type-graphql"
import { User } from "../entities/User.js"
import { MyContext } from "../types.js"

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
    if (!context.req.session.userId) {
        throw new Error("not logged in")
    }

    // console.log({ id: context.req.session.userId })

    const user = await User.findOne({
        where: { id: context.req.session.userId },
    })

    if (user == null) {
        throw new Error("not logged in")
    }

    return next()
}
