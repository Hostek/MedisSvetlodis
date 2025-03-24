"use client"
import { RED_COLOR } from "@/constants"
import { useUpdateUsernameMutation } from "@/generated/graphql"
import { HandleSubmit } from "@/types"
import { MySwal } from "@/utils/MySwal"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Form,
    Input,
} from "@heroui/react"
import { errors, getUsernameError } from "@hostek/shared"
import React, { useCallback, useState } from "react"

interface UpdateUsernameProps {
    updateUsernameAttempts: number
    l: boolean
    x: () => void
}

const UpdateUsername: React.FC<UpdateUsernameProps> = ({
    updateUsernameAttempts,
    l,
    x,
}) => {
    const [username, setUsername] = useState("")

    const [updateUsernameError, setUpdateUsernameError] = useState<
        string | null
    >(null)

    const [{ fetching: updateUsernameFetching }, updateUsername] =
        useUpdateUsernameMutation()

    const handleUsernameUpdate = useCallback<HandleSubmit>(
        async (e) => {
            e.preventDefault()

            if (!l) return

            const result = await MySwal.fire({
                title: "Are you sure?",
                text: "This operation is irreversible and will consume your username update attempt (if all are used you won't be able to change username ever again)",
                icon: "warning",
                theme: "dark",
                showCancelButton: true,
                confirmButtonText: "Yes, Change my username",
                cancelButtonText: "Cancel",
                confirmButtonColor: RED_COLOR,
            })

            if (!result.isConfirmed) return

            setUpdateUsernameError(null)

            const areErrors = getUsernameError(username)
            if (areErrors) {
                setUpdateUsernameError(areErrors)
                return
            }

            const res = await updateUsername({
                newUsername: username,
            })

            if (!res.data || res.error) {
                setUpdateUsernameError(errors.unknownError)
                return
            }

            if (res.data.updateUsername?.message) {
                setUpdateUsernameError(res.data.updateUsername.message)
            }

            x()

            MySwal.fire({
                title: "Success",
                text: "Successfully changed username!",
                icon: "success",
                theme: "dark",
            })
        },
        [username, updateUsername, l, x]
    )

    return (
        <Card>
            <CardHeader className="font-bold">
                Change Username |
                <span className="text-gray-400 mx-1">
                    (Available attempts: {updateUsernameAttempts})
                </span>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-4">
                <Form className="space-y-2" onSubmit={handleUsernameUpdate}>
                    <Input
                        label="New Username"
                        placeholder="Enter new username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {updateUsernameError && (
                        <div className="w-full text-red-500">
                            Error: {updateUsernameError}
                        </div>
                    )}
                    <Button
                        type="submit"
                        color="primary"
                        className="w-full"
                        disabled={updateUsernameFetching}
                    >
                        Update Username
                    </Button>
                </Form>
            </CardBody>
        </Card>
    )
}

export default UpdateUsername
