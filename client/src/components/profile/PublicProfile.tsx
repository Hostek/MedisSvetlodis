"use client"
import { UserFromGetUserByPublicIdQueryType } from "@/types"
import { Button, Divider } from "@heroui/react"
import React, { useCallback, useState } from "react"
import BlockIcon from "../icons/BlockIcon"
import { useBlockUserMutation } from "@/generated/graphql"
import { errors } from "@hostek/shared"
import Error from "../helper/Error"

interface PublicProfileProps {
    user: UserFromGetUserByPublicIdQueryType
}

const PublicProfile: React.FC<PublicProfileProps> = ({ user }) => {
    const [{ fetching }, blockUser] = useBlockUserMutation()
    const [error, setError] = useState<string | null>(null)
    // const [blocked, setBlocked] = useState(false)

    const handlePress = useCallback(async () => {
        if (fetching) return

        setError(null)

        const res = await blockUser({
            userId: user.id,
        })

        // console.log({ res })

        if (res.error || !res.data) {
            return setError(errors.unknownError)
        }

        if (res.data.blockUser?.message) {
            return setError(res.data.blockUser.message)
        }

        // good
        // setBlocked(true)
    }, [fetching, user, blockUser])

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
                    color="danger"
                    disabled={fetching}
                    onPress={() => handlePress()}
                >
                    <div aria-hidden className="w-4 h-4">
                        <BlockIcon />
                    </div>
                    Block User
                </Button>
            </div>
        </>
    )
}

export default PublicProfile
