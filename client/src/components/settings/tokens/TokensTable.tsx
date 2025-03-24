"use client"
import {
    useBlockFriendRequestTokenMutation,
    useUnblockFriendRequestTokenMutation,
} from "@/generated/graphql"
import { blockOrUnblockMutRT, FriendRequestTokensType } from "@/types"
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react"
import { errors } from "@hostek/shared"
import React, { useMemo } from "react"
import { Lock, Unlock } from "react-feather"

interface TokensTableProps {
    tokens: FriendRequestTokensType
    setAllError: React.Dispatch<React.SetStateAction<string | null>>
    setTokens: React.Dispatch<React.SetStateAction<FriendRequestTokensType>>
}

const TokensTable: React.FC<TokensTableProps> = ({
    tokens,
    setAllError,
    setTokens,
}) => {
    const [
        { fetching: blockFriendRequestTokenFetching },
        blockFriendRequestToken,
    ] = useBlockFriendRequestTokenMutation()
    const [
        { fetching: unblockFriendRequestTokenFetching },
        unblockFriendRequestToken,
    ] = useUnblockFriendRequestTokenMutation()

    const allFetching = useMemo(() => {
        return (
            blockFriendRequestTokenFetching || unblockFriendRequestTokenFetching
        )
    }, [blockFriendRequestTokenFetching, unblockFriendRequestTokenFetching])

    return (
        <Table aria-label="Friend Request Tokens">
            <TableHeader>
                <TableColumn>TOKEN</TableColumn>
                <TableColumn>OPTIONS</TableColumn>
            </TableHeader>
            <TableBody>
                {tokens.map((value, i) => {
                    const title =
                        value.status === "active"
                            ? `block token ${i + 1}`
                            : `unblock token ${i + 1}`

                    const handleApiResponse = (res: blockOrUnblockMutRT) => {
                        if (res.error || !res.data) {
                            setAllError(errors.unknownError)
                            return false
                        }

                        const message =
                            res.data?.blockFriendRequestToken?.message ||
                            res.data?.unblockFriendRequestToken?.message
                        if (message) {
                            setAllError(message)
                            return false
                        }

                        return true
                    }

                    const updateLocalTokenStatus = (
                        newStatus: "active" | "blocked"
                    ) => {
                        setTokens((prev) =>
                            prev.map((token, index) =>
                                index === i
                                    ? {
                                          ...token,
                                          status: newStatus,
                                      }
                                    : token
                            )
                        )
                    }

                    return (
                        <TableRow key={i}>
                            <TableCell>{value.token}</TableCell>
                            <TableCell>
                                <Button
                                    aria-label={title}
                                    title={title}
                                    // className="w-2"
                                    onPress={async () => {
                                        const isBlocking =
                                            value.status === "active"
                                        const mutationFn = isBlocking
                                            ? blockFriendRequestToken
                                            : unblockFriendRequestToken
                                        const newStatus = isBlocking
                                            ? "blocked"
                                            : "active"

                                        try {
                                            const res = await mutationFn({
                                                tokenId: value.id,
                                            })

                                            if (!handleApiResponse(res)) return

                                            setAllError(null)
                                            updateLocalTokenStatus(newStatus)
                                        } catch {
                                            setAllError(errors.unknownError)
                                        }
                                    }}
                                    disabled={allFetching}
                                >
                                    {value.status === "active" ? (
                                        <Lock />
                                    ) : (
                                        <Unlock />
                                    )}
                                </Button>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default TokensTable
