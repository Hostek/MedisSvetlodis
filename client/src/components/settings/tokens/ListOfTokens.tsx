"use client"
import Error from "@/components/helper/Error"
import { useFriendRequestTokensOfUserQuery } from "@/generated/graphql"
import { FriendRequestTokensType } from "@/types"
import { Alert, Button, CircularProgress, useDisclosure } from "@heroui/react"
import React, { useCallback, useEffect, useState } from "react"
import QrCodeModal from "./stuff/QrCodeModal"
import TokensTable from "./TokensTable"

interface ListOfTokensProps {}

const ListOfTokens: React.FC<ListOfTokensProps> = ({}) => {
    const [{ fetching, data }] = useFriendRequestTokensOfUserQuery()
    const [showFriendRequestTokens, setShowFriendRequestTokens] =
        useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleOpen = useCallback(() => {
        onOpen()
    }, [onOpen])

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

                    <Button
                        fullWidth
                        className="mt-2"
                        color="primary"
                        onPress={() => handleOpen()}
                    >
                        Show QR Codes
                    </Button>

                    <QrCodeModal
                        isOpen={isOpen}
                        onClose={onClose}
                        tokens={tokens}
                    />
                </>
            )}
        </>
    )
}

export default ListOfTokens
