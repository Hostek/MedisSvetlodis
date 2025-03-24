"use client"
import Error from "@/components/helper/Error"
import {
    useBlockFriendRequestTokenMutation,
    useFriendRequestTokensOfUserQuery,
    useUnblockFriendRequestTokenMutation,
} from "@/generated/graphql"
import {
    Alert,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react"
import { errors } from "@hostek/shared"
import React, { useEffect, useMemo, useState } from "react"
import { Lock, Unlock } from "react-feather"

interface ListOfTokensProps {}

const ListOfTokens: React.FC<ListOfTokensProps> = ({}) => {
    const [{ fetching, data }] = useFriendRequestTokensOfUserQuery()
    const [showFriendRequestTokens, setShowFriendRequestTokens] =
        useState(false)

    const [allError, setAllError] = useState<string | null>(null)

    const [tokens, setTokens] = useState<
        Exclude<
            ReturnType<typeof useFriendRequestTokensOfUserQuery>[0]["data"],
            undefined
        >["friendRequestTokensOfUser"]
    >([])

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
                        Show these only to people you want to be friends with!
                    </Alert>

                    {allError && <Error>Error: {allError}</Error>}

                    <Table aria-label="Friend Request Tokens">
                        <TableHeader>
                            <TableColumn>TOKEN</TableColumn>
                            <TableColumn>OPTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {tokens.map((value, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>{value.token}</TableCell>
                                        <TableCell>
                                            <Button
                                                aria-label={
                                                    value.status === "active"
                                                        ? `block token ${i + 1}`
                                                        : `unblock token ${i + 1}`
                                                }
                                                title={
                                                    value.status === "active"
                                                        ? `block token ${i + 1}`
                                                        : `unblock token ${i + 1}`
                                                }
                                                // className="w-2"
                                                onPress={async () => {
                                                    if (
                                                        value.status ===
                                                        "active"
                                                    ) {
                                                        const res =
                                                            await blockFriendRequestToken(
                                                                {
                                                                    tokenId:
                                                                        value.id,
                                                                }
                                                            )

                                                        if (
                                                            res.error ||
                                                            !res.data
                                                        ) {
                                                            return setAllError(
                                                                errors.unknownError
                                                            )
                                                        }

                                                        if (
                                                            res.data
                                                                ?.blockFriendRequestToken
                                                                ?.message
                                                        ) {
                                                            return setAllError(
                                                                res.data
                                                                    .blockFriendRequestToken
                                                                    .message
                                                            )
                                                        }

                                                        setAllError(null)

                                                        // successful ! –> update tokens
                                                        setTokens((prev) => {
                                                            const cr = [...prev]
                                                            cr[i].status =
                                                                "blocked"
                                                            return cr
                                                        })
                                                    } else {
                                                        const res =
                                                            await unblockFriendRequestToken(
                                                                {
                                                                    tokenId:
                                                                        value.id,
                                                                }
                                                            )

                                                        if (
                                                            res.error ||
                                                            !res.data
                                                        ) {
                                                            return setAllError(
                                                                errors.unknownError
                                                            )
                                                        }

                                                        if (
                                                            res.data
                                                                ?.unblockFriendRequestToken
                                                                ?.message
                                                        ) {
                                                            return setAllError(
                                                                res.data
                                                                    .unblockFriendRequestToken
                                                                    .message
                                                            )
                                                        }

                                                        setAllError(null)

                                                        // successful ! –> update tokens
                                                        setTokens((prev) => {
                                                            const cr = [...prev]
                                                            cr[i].status =
                                                                "active"
                                                            return cr
                                                        })
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
                </>
            )}
        </>
    )
}

export default ListOfTokens
