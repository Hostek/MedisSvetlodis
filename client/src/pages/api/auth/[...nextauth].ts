import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GitlabProvider from "next-auth/providers/gitlab"
import { generateOAuthProof } from "@hostek/shared"

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GitlabProvider({
            clientId: process.env.GITLAB_ID,
            clientSecret: process.env.GITLAB_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            if (!user.email) {
                throw new Error("User email is required")
            }
            try {
                const proof = generateOAuthProof(
                    user.email,
                    process.env.OAUTH_PROOF_SECRET
                )

                return `/api/handle-oauth?email=${user.email}&proof=${encodeURIComponent(proof)}`
            } catch {
                console.error("wtf .. ")
                return `/login?error=server-error`
            }
        },
    },
}

export default NextAuth(authOptions)
