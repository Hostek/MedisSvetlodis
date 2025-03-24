"use client"
import { useCreateDefaultTokensMutation } from "@/generated/graphql"
import { Button } from "@heroui/react"
import { errors } from "@hostek/shared"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import Error from "../../helper/Error"
import ListOfTokens from "./ListOfTokens"

interface FriendRequestTokensProps {
    l: boolean
    generatedDefaultFriendRequestTokens: boolean
}

const FriendRequestTokens: React.FC<FriendRequestTokensProps> = ({
    l,
    generatedDefaultFriendRequestTokens,
}) => {
    const [{ fetching: createDefaultTokensFetching }, createDefaultTokens] =
        useCreateDefaultTokensMutation()

    const [error, setError] = useState<string | null>(null)

    const Router = useRouter()

    return (
        <div className="w-full">
            {!generatedDefaultFriendRequestTokens && (
                <Button
                    className="w-full"
                    disabled={createDefaultTokensFetching}
                    onPress={async () => {
                        if (!l) return
                        setError(null)
                        const res = await createDefaultTokens({})

                        if (!res.data || res.error) {
                            return setError(errors.unknownError)
                        }

                        if (res.data.createDefaultTokens?.message) {
                            return setError(
                                res.data.createDefaultTokens.message
                            )
                        }

                        // good!
                        Router.refresh()
                    }}
                >
                    Generate Your Default Tokens
                </Button>
            )}
            {error && <Error>Error: {error}</Error>}

            {generatedDefaultFriendRequestTokens && <ListOfTokens />}
        </div>
    )
}

export default FriendRequestTokens
