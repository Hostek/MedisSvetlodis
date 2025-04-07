"use client"
import { UserFromGetUserByPublicIdQueryType } from "@/types"
import { Button, Divider } from "@heroui/react"
import React, { useCallback, useMemo, useState } from "react"
import BlockIcon from "../icons/BlockIcon"
import {
    useBlockUserMutation,
    useUnblockUserMutation,
} from "@/generated/graphql"
import { errors } from "@hostek/shared"
import Error from "../helper/Error"
import { MySwal } from "@/utils/MySwal"
import { GREEN_COLOR, RED_COLOR } from "@/constants"

interface PublicProfileProps {
    user: UserFromGetUserByPublicIdQueryType
    isBlocked: boolean
}

const PublicProfile: React.FC<PublicProfileProps> = ({
    user,
    isBlocked: isBlockedSomeParam,
}) => {
    const [{ fetching: blockFetching }, blockUser] = useBlockUserMutation()
    const [{ fetching: unblockFetching }, unblockUser] =
        useUnblockUserMutation()
    const [error, setError] = useState<string | null>(null)
    const [blocked, setBlocked] = useState(isBlockedSomeParam)

    const fetching = useMemo(() => {
        return blockFetching || unblockFetching
    }, [unblockFetching, blockFetching])

    const handlePress = useCallback(async () => {
        if (fetching) return

        const result = await MySwal.fire({
            title: "Are you sure?",
            icon: "warning",
            theme: "dark",
            showCancelButton: true,
            confirmButtonColor: RED_COLOR,
            cancelButtonColor: GREEN_COLOR,
            confirmButtonText: "Yes",
        })

        if (!result.isConfirmed) {
            return
        }

        setError(null)

        let isGood = false

        if (!blocked) {
            const res = await blockUser({
                userId: user.id,
            })

            if (res.error || !res.data) {
                return setError(errors.unknownError)
            }

            if (res.data.blockUser?.message) {
                return setError(res.data.blockUser.message)
            }

            // good
            isGood = true
            setBlocked(true)
        } else {
            const res = await unblockUser({
                userId: user.id,
            })

            if (res.error || !res.data) {
                return setError(errors.unknownError)
            }

            if (res.data.unblockUser?.message) {
                return setError(res.data.unblockUser.message)
            }

            isGood = true
            setBlocked(false)
        }

        if (isGood) {
            MySwal.fire({
                title: "Success",
                icon: "success",
                theme: "dark",
            })
        }
    }, [fetching, user, blockUser, blocked, unblockUser])

    return (
        <>
            <div>
                <div>Public Identifier: {user.identifier}</div>
                <div>Username: {user.username}</div>
            </div>
            <Divider />
            {error && <Error>Error: {error}</Error>}
            <div className="flex">
                <Button
                    fullWidth
                    color={blocked ? "secondary" : "danger"}
                    disabled={fetching}
                    onPress={() => handlePress()}
                >
                    <div aria-hidden className="w-4 h-4">
                        <BlockIcon />
                    </div>
                    {blocked ? "Unblock User" : "Block User"}
                </Button>
            </div>
        </>
    )
}

export default PublicProfile
