"use client"
import {
    useBlockFriendRequestTokenMutation,
    useRegenerateFriendRequestTokenMutation,
    useUnblockFriendRequestTokenMutation,
} from "@/generated/graphql"
import { blockOrUnblockMutRT, FriendRequestTokensType } from "@/types"
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react"
import { errors } from "@hostek/shared"
import React, { useMemo } from "react"
import ToggleLockBtn from "./stuff/ToggleLockBtn"
import RegenerateTokenBtn from "./stuff/RegenerateTokenBtn"

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
    const [
        { fetching: regenFriendRequestToken },
        regenerateFriendRequestToken,
    ] = useRegenerateFriendRequestTokenMutation()

    const allFetching = useMemo(() => {
        return (
            blockFriendRequestTokenFetching ||
            unblockFriendRequestTokenFetching ||
            regenFriendRequestToken
        )
    }, [
        blockFriendRequestTokenFetching,
        unblockFriendRequestTokenFetching,
        regenFriendRequestToken,
    ])

    return (
        <Table aria-label="Friend Request Tokens">
            <TableHeader>
                <TableColumn>TOKEN</TableColumn>
                <TableColumn>OPTIONS</TableColumn>
            </TableHeader>
            <TableBody>
                {tokens.map((value, i) => {
                    const titleOfBlockBtn =
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

                    const titleOfRegenBtn = `Regenerate token ${i + 1}`

                    return (
                        <TableRow key={i}>
                            <TableCell>{value.token}</TableCell>
                            <TableCell>
                                <ToggleLockBtn
                                    allFetching={allFetching}
                                    blockFriendRequestToken={
                                        blockFriendRequestToken
                                    }
                                    handleApiResponse={handleApiResponse}
                                    setAllError={setAllError}
                                    titleOfBlockBtn={titleOfBlockBtn}
                                    unblockFriendRequestToken={
                                        unblockFriendRequestToken
                                    }
                                    updateLocalTokenStatus={
                                        updateLocalTokenStatus
                                    }
                                    value={value}
                                />
                                <RegenerateTokenBtn
                                    allFetching={allFetching}
                                    i={i}
                                    regenerateFriendRequestToken={
                                        regenerateFriendRequestToken
                                    }
                                    setAllError={setAllError}
                                    setTokens={setTokens}
                                    titleOfRegenBtn={titleOfRegenBtn}
                                    value={value}
                                />
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default TokensTable
