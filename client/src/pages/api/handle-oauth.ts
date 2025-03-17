import { NextApiRequest, NextApiResponse } from "next"
import { print } from "graphql/language/printer"
import {
    LoginDocument,
    LoginMutationVariables,
    useLoginMutation,
} from "@/generated/graphql"
import { errors } from "@hostek/shared"

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { email, proof } = req.query

    if (typeof email !== "string") {
        throw new Error("email is not a string")
    }
    if (typeof proof !== "string") {
        throw new Error("proof isn't provided")
    }

    const MutationVariables: LoginMutationVariables = {
        email,
        oauthProof: proof,
    }

    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: print(LoginDocument),
            variables: MutationVariables,
        }),
        credentials: "include",
    })

    // console.log({ response })

    // Handle errors
    if (response.status !== 200) {
        return res.redirect("/login?error=oauth_failed")
    }

    const r = (await response.json()) as ReturnType<typeof useLoginMutation>[0]

    const data = r.data

    // console.log({ errors: data.login.errors })

    if (!data) {
        return res.redirect(
            `/login?error=${encodeURIComponent(errors.unknownError)}`
        )
    }

    if (data.login.errors) {
        return res.redirect(
            `/login?error=${encodeURIComponent(data.login.errors[0].message)}`
        )
    }

    // Extract the session cookie from GraphQL response
    const sessionCookie = response.headers.get("set-cookie")

    // Set the cookie in the client's browser
    if (sessionCookie) {
        res.setHeader("Set-Cookie", sessionCookie)
    }

    res.redirect("/")
}
