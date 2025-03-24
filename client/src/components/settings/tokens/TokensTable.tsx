"use client"
import { RED_COLOR } from "@/constants"
import {
    useBlockFriendRequestTokenMutation,
    useRegenerateFriendRequestTokenMutation,
    useUnblockFriendRequestTokenMutation,
} from "@/generated/graphql"
import { blockOrUnblockMutRT, FriendRequestTokensType } from "@/types"
import { MySwal } from "@/utils/MySwal"
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react"
import {
    checkIfArrayExistsNotEmpty,
    errors,
    MAXIMUM_TOKEN_REGENERATION_COUNT,
} from "@hostek/shared"
import React, { useMemo } from "react"
import { Lock, RefreshCw, Unlock } from "react-feather"

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
                                <Button
                                    aria-label={titleOfBlockBtn}
                                    title={titleOfBlockBtn}
                                    // className="w-2"
                                    onPress={async () => {
                                        setAllError(null)

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

                                            // setAllError(null)
                                            updateLocalTokenStatus(newStatus)
                                        } catch {
                                            setAllError(errors.unknownError)
                                        }
                                    }}
                                    disabled={allFetching}
                                    isIconOnly
                                    color="danger"
                                >
                                    {value.status === "active" ? (
                                        <Lock />
                                    ) : (
                                        <Unlock />
                                    )}
                                </Button>
                                <Button
                                    aria-label={titleOfRegenBtn}
                                    title={titleOfRegenBtn}
                                    disabled={allFetching}
                                    isIconOnly
                                    color="success"
                                    className="mx-1"
                                    onPress={async () => {
                                        const res_popup = await MySwal.fire({
                                            title: "Are you sure?",
                                            text: `Please, do not regenerate tokens too often (you can perform this operation only ${MAXIMUM_TOKEN_REGENERATION_COUNT} times per day). After regeneration old token won't work anymore.`,
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonColor: RED_COLOR,
                                            // cancelButtonColor: "#d33",
                                            confirmButtonText: "Yes",
                                            theme: "dark",
                                        })

                                        if (!res_popup.isConfirmed) {
                                            return
                                        }

                                        setAllError(null)

                                        const res =
                                            await regenerateFriendRequestToken({
                                                tokenId: value.id,
                                            })

                                        if (!res.data || res.error) {
                                            return setAllError(
                                                errors.unknownError
                                            )
                                        }

                                        if (
                                            checkIfArrayExistsNotEmpty(
                                                res.data
                                                    .regenerateFriendRequestToken
                                                    .errors
                                            )
                                        ) {
                                            return setAllError(
                                                res.data
                                                    .regenerateFriendRequestToken
                                                    .errors[0].message
                                            )
                                        }

                                        if (
                                            !res.data
                                                .regenerateFriendRequestToken
                                                .token
                                        ) {
                                            return setAllError(
                                                errors.unknownError
                                            )
                                        }

                                        setTokens((prev) =>
                                            prev.map((token, index) =>
                                                index === i
                                                    ? (res.data
                                                          ?.regenerateFriendRequestToken
                                                          .token ?? token)
                                                    : token
                                            )
                                        )

                                        MySwal.fire({
                                            title: "Success",
                                            text: "Successfully regenerated token!",
                                            icon: "success",
                                            theme: "dark",
                                        })
                                    }}
                                >
                                    <RefreshCw />
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
