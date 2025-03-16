import { LoginDocument } from "@/generated/graphql"
import { NextApiRequest, NextApiResponse } from "next"
import { print } from "graphql/language/printer"
import { generateOAuthProof } from "@hostek/shared"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.status(200).json({
        value: print(LoginDocument),
        tester: generateOAuthProof(
            "test@test.com",
            process.env.OAUTH_PROOF_SECRET
        ),
    })
}
