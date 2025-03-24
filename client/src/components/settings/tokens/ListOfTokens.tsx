"use client"
import Error from "@/components/helper/Error"
import { useFriendRequestTokensOfUserQuery } from "@/generated/graphql"
import { Alert, Button, CircularProgress } from "@heroui/react"
import React, { useEffect, useState } from "react"
import TokensTable from "./TokensTable"
import { FriendRequestTokensType } from "@/types"

interface ListOfTokensProps {}

const ListOfTokens: React.FC<ListOfTokensProps> = ({}) => {
    const [{ fetching, data }] = useFriendRequestTokensOfUserQuery()
    const [showFriendRequestTokens, setShowFriendRequestTokens] =
        useState(false)

    const [allError, setAllError] = useState<string | null>(null)

    const [tokens, setTokens] = useState<FriendRequestTokensType>([])

    useEffect(() => {
        if (data?.friendRequestTokensOfUser) {
            setTokens(data.friendRequestTokensOfUser)
        }
    }, [data])

    if (fetching || !data || data.friendRequestTokensOfUser.length < 1) {
        return <CircularProgress aria-label="fetching" />
    }

    return (
        <>
            <Button
                className="w-full"
                disabled={fetching}
                onPress={() => {
                    setShowFriendRequestTokens((prev) => !prev)
                }}
            >
                Show Friend Request Tokens
            </Button>
            {showFriendRequestTokens && (
                <>
                    <Alert color="warning" className="my-2">
                        Show these only to people who you want to be friends
                        with!
                    </Alert>

                    {allError && <Error>Error: {allError}</Error>}

                    <TokensTable
                        setAllError={setAllError}
                        setTokens={setTokens}
                        tokens={tokens}
                    />
                </>
            )}
        </>
    )
}

export default ListOfTokens
