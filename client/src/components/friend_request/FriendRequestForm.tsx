"use client"
import { Button, Form, Input } from "@heroui/react"
import React, { useCallback, useState } from "react"
import Error from "../helper/Error"
import { useCreateFriendRequestMutation } from "@/generated/graphql"
import { HandleSubmit } from "@/types"
import { errors } from "@hostek/shared"
import { MySwal } from "@/utils/MySwal"

interface FriendRequestFormProps {}

const FriendRequestForm: React.FC<FriendRequestFormProps> = ({}) => {
    const [inputToken, setInputToken] = useState("")
    const [error, setError] = useState<string | null>(null)

    const [{ fetching }, createFriendRequest] = useCreateFriendRequestMutation()

    const handleSubmit = useCallback<HandleSubmit>(
        async (e) => {
            e.preventDefault()

            setError(null)

            const res = await createFriendRequest({
                friendRequestToken: inputToken,
            })

            if (!res.data || res.error) {
                setError(errors.unknownError)
                return
            }

            if (res.data.createFriendRequest?.message) {
                return setError(res.data.createFriendRequest.message)
            }

            MySwal.fire({
                title: "Success",
                text: "Successfully sent friend request!",
                icon: "success",
                theme: "dark",
            })
        },
        [createFriendRequest, inputToken]
    )

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                label="Friend Request Token"
                placeholder="Enter friend request token"
                value={inputToken}
                onChange={(e) => {
                    setInputToken(e.currentTarget.value)
                }}
            />
            {error && <Error>Error: {error}</Error>}
            <Button
                type="submit"
                color="primary"
                className="w-full"
                disabled={fetching}
            >
                Send Friend Request!
            </Button>
        </Form>
    )
}

export default FriendRequestForm
