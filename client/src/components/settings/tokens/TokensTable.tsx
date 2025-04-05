"use client"
import {
    useBlockFriendRequestTokenMutation,
    useRegenerateFriendRequestTokenMutation,
    useUnblockFriendRequestTokenMutation,
} from "@/generated/graphql"
import { FriendRequestTokensType } from "@/types"
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react"
import React, { useMemo } from "react"
import MaxLimitTokenForm from "./stuff/MaxLimitTokenForm"
import RegenerateTokenBtn from "./stuff/RegenerateTokenBtn"
import TableToken from "./stuff/TableToken"
import ToggleLockBtn from "./stuff/ToggleLockBtn"

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
                <TableColumn>MAX LIMIT</TableColumn>
                <TableColumn className="text-center">USAGE</TableColumn>
            </TableHeader>
            <TableBody>
                {tokens.map((value, i) => {
                    return (
                        <TableRow key={i}>
                            <TableCell
                                className="font-mono"
                                style={{ fontSize: "0.8rem" }}
                            >
                                <TableToken token={value.token} />
                            </TableCell>
                            <TableCell>
                                <ToggleLockBtn
                                    allFetching={allFetching}
                                    blockFriendRequestToken={
                                        blockFriendRequestToken
                                    }
                                    setAllError={setAllError}
                                    unblockFriendRequestToken={
                                        unblockFriendRequestToken
                                    }
                                    setTokens={setTokens}
                                    value={value}
                                    i={i}
                                />
                                <RegenerateTokenBtn
                                    allFetching={allFetching}
                                    i={i}
                                    regenerateFriendRequestToken={
                                        regenerateFriendRequestToken
                                    }
                                    setAllError={setAllError}
                                    setTokens={setTokens}
                                    value={value}
                                />
                            </TableCell>
                            <TableCell>
                                <MaxLimitTokenForm
                                    initialValue={value.max_limit}
                                    tokenId={value.id}
                                    setAllError={setAllError}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                {value.usage_count}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default TokensTable
