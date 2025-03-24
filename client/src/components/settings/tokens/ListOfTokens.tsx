"use client"
import { useFriendRequestTokensOfUserQuery } from "@/generated/graphql"
import {
    Alert,
    Button,
    Checkbox,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react"
import React, { useState } from "react"

interface ListOfTokensProps {}

const ListOfTokens: React.FC<ListOfTokensProps> = ({}) => {
    const [{ fetching, data }] = useFriendRequestTokensOfUserQuery()
    const [showFriendRequestTokens, setShowFriendRequestTokens] =
        useState(false)

    if (fetching || !data || data.friendRequestTokensOfUser.length < 1) {
        return <CircularProgress />
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
                    <Table aria-label="Friend Request Tokens">
                        <TableHeader>
                            <TableColumn>TOKEN</TableColumn>
                            <TableColumn>OPTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.friendRequestTokensOfUser.map((value, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>{value.token}</TableCell>
                                        <TableCell>
                                            <Checkbox />
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
