"use client"
import {
    blockFriendRequestTokenMutationType,
    blockOrUnblockMutRT,
    FriendRequestTokensType,
    unblockFriendRequestTokenMutationType,
} from "@/types"
import { Button } from "@heroui/react"
import { errors } from "@hostek/shared"
import React, { useCallback, useMemo } from "react"
import { Lock, Unlock } from "react-feather"

interface ToggleLockBtnProps {
    // titleOfBlockBtn: string
    blockFriendRequestToken: blockFriendRequestTokenMutationType
    unblockFriendRequestToken: unblockFriendRequestTokenMutationType
    setAllError: React.Dispatch<React.SetStateAction<string | null>>
    // handleApiResponse: (res: blockOrUnblockMutRT) => boolean
    // updateLocalTokenStatus: (newStatus: "active" | "blocked") => void
    value: FriendRequestTokensType[number]
    allFetching: boolean
    i: number
    setTokens: React.Dispatch<React.SetStateAction<FriendRequestTokensType>>
}

const ToggleLockBtn: React.FC<ToggleLockBtnProps> = ({
    // titleOfBlockBtn,
    blockFriendRequestToken,
    setAllError,
    // handleApiResponse,
    unblockFriendRequestToken,
    // updateLocalTokenStatus,
    value,
    allFetching,
    setTokens,
    i,
}) => {
    const titleOfBlockBtn = useMemo(() => {
        return value.status === "active"
            ? `block token ${i + 1}`
            : `unblock token ${i + 1}`
    }, [i, value.status])

    const updateLocalTokenStatus = useCallback(
        (newStatus: "active" | "blocked") => {
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
        },
        [i, setTokens]
    )

    const handleApiResponse = useCallback(
        (res: blockOrUnblockMutRT) => {
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
        },
        [setAllError]
    )

    return (
        <Button
            aria-label={titleOfBlockBtn}
            title={titleOfBlockBtn}
            // className="w-2"
            onPress={async () => {
                setAllError(null)

                const isBlocking = value.status === "active"
                const mutationFn = isBlocking
                    ? blockFriendRequestToken
                    : unblockFriendRequestToken
                const newStatus = isBlocking ? "blocked" : "active"

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
            {value.status === "active" ? <Lock /> : <Unlock />}
        </Button>
    )
}

export default ToggleLockBtn
