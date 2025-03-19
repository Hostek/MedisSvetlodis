"use client"
import { EMPTY_PASSWORD_STRING, RED_COLOR } from "@/constants"
import {
    useUpdatePasswordMutation,
    useUpdateUsernameMutation,
} from "@/generated/graphql"
import { useIsAuth } from "@/hooks/isAuth"
import { HandleSubmit } from "@/types"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { MySwal } from "@/utils/MySwal"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Form,
    Input,
    Tab,
    Tabs,
} from "@heroui/react"
import { errors, getPasswordError, getUsernameError } from "@hostek/shared"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { useCallback, useState } from "react"
import { ArrowLeft } from "react-feather"

const Page: NextPage = () => {
    const { user } = useIsAuth()

    const [username, setUsername] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [updateUsernameError, setUpdateUsernameError] = useState<
        string | null
    >(null)
    const [updatePasswordError, setUpdatePasswordError] = useState<
        string | null
    >(null)

    const [{ fetching: updateUsernameFetching }, updateUsername] =
        useUpdateUsernameMutation()
    const [{ fetching: updatePasswordFetching }, updatePassword] =
        useUpdatePasswordMutation()

    const handleUsernameUpdate = useCallback<HandleSubmit>(
        async (e) => {
            e.preventDefault()

            if (!user) return

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

            user.updateUsernameAttempts--

            MySwal.fire({
                title: "Success",
                text: "Successfully changed username!",
                icon: "success",
                theme: "dark",
            })
        },
        [username, updateUsername, user]
    )

    const handlePasswordUpdate = useCallback<HandleSubmit>(
        async (e) => {
            e.preventDefault()

            // console.warn("hey!")

            if (!user) return

            const result = await MySwal.fire({
                title: "Are you sure?",
                icon: "warning",
                theme: "dark",
                showCancelButton: true,
                confirmButtonText: "Yes, Change my password",
                cancelButtonText: "Cancel",
                confirmButtonColor: RED_COLOR,
            })

            if (!result.isConfirmed) return

            setUpdatePasswordError(null)

            let areErrors: string | null = getPasswordError(newPassword)
            if (!areErrors && currentPassword !== EMPTY_PASSWORD_STRING) {
                areErrors = getPasswordError(currentPassword)
            }
            if (!areErrors) {
                if (newPassword !== confirmPassword) {
                    areErrors = errors.passwordMismatch
                }
            }
            if (areErrors) {
                setUpdatePasswordError(areErrors)
                return
            }

            const realCurrentPassword =
                currentPassword === EMPTY_PASSWORD_STRING
                    ? null
                    : currentPassword

            const res = await updatePassword({
                newPassword,
                oldPassword: realCurrentPassword,
            })

            if (!res.data || res.error) {
                setUpdatePasswordError(errors.unknownError)
                return
            }

            if (res.data.updatePassword?.message) {
                setUpdatePasswordError(res.data.updatePassword.message)
            }

            MySwal.fire({
                title: "Success",
                text: "Successfully changed password!",
                icon: "success",
                theme: "dark",
            })
        },
        [user, newPassword, confirmPassword, currentPassword, updatePassword]
    )

    if (!user) {
        return null
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-screen-md mx-auto p-4">
            <Button as="a" href="/">
                <ArrowLeft />
            </Button>

            <h1 className="text-2xl font-bold">Account Settings</h1>

            <Tabs aria-label="Settings options">
                <Tab key="username" title="Change Username">
                    <Card>
                        <CardHeader className="font-bold">
                            Change Username |
                            <span className="text-gray-400 mx-1">
                                (Available attempts:{" "}
                                {user.updateUsernameAttempts})
                            </span>
                        </CardHeader>
                        <Divider />
                        <CardBody className="flex flex-col gap-4">
                            <Form
                                className="space-y-2"
                                onSubmit={handleUsernameUpdate}
                            >
                                <Input
                                    label="New Username"
                                    placeholder="Enter new username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
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
                </Tab>

                <Tab key="password" title="Change Password">
                    <Card>
                        <CardHeader className="font-bold">
                            Change Password |
                            <span className="text-gray-400 mx-1">
                                If you didn&apos;t set password type in &quot;
                                {EMPTY_PASSWORD_STRING}&quot;
                            </span>
                        </CardHeader>
                        <Divider />
                        <CardBody className="flex flex-col gap-4">
                            <Form
                                className="space-y-2"
                                onSubmit={handlePasswordUpdate}
                            >
                                <Input
                                    label="Current Password"
                                    type="password"
                                    placeholder="Enter current password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                />
                                <Input
                                    label="New Password"
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                />
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    isInvalid={
                                        confirmPassword !== "" &&
                                        newPassword !== confirmPassword
                                    }
                                    errorMessage={
                                        confirmPassword !== "" &&
                                        newPassword !== confirmPassword
                                            ? "Passwords do not match"
                                            : ""
                                    }
                                />
                                {updatePasswordError && (
                                    <div className="w-full text-red-500">
                                        Error: {updatePasswordError}
                                    </div>
                                )}
                                <Button
                                    color="primary"
                                    className="w-full"
                                    disabled={updatePasswordFetching}
                                    type="submit"
                                >
                                    Update Password
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
