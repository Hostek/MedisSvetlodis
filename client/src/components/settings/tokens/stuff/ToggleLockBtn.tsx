"use client"
import {
    blockFriendRequestTokenMutationType,
    blockOrUnblockMutRT,
    FriendRequestTokensType,
    unblockFriendRequestTokenMutationType,
} from "@/types"
import { Button } from "@heroui/react"
import { errors } from "@hostek/shared"
import React from "react"
import { Lock, Unlock } from "react-feather"

interface ToggleLockBtnProps {
    titleOfBlockBtn: string
    blockFriendRequestToken: blockFriendRequestTokenMutationType
    unblockFriendRequestToken: unblockFriendRequestTokenMutationType
    setAllError: React.Dispatch<React.SetStateAction<string | null>>
    handleApiResponse: (res: blockOrUnblockMutRT) => boolean
    updateLocalTokenStatus: (newStatus: "active" | "blocked") => void
    value: FriendRequestTokensType[number]
    allFetching: boolean
}

const ToggleLockBtn: React.FC<ToggleLockBtnProps> = ({
    titleOfBlockBtn,
    blockFriendRequestToken,
    setAllError,
    handleApiResponse,
    unblockFriendRequestToken,
    updateLocalTokenStatus,
    value,
    allFetching,
}) => {
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
