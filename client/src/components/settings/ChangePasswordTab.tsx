"use client"
import { EMPTY_PASSWORD_STRING, RED_COLOR } from "@/constants"
import { useUpdatePasswordMutation } from "@/generated/graphql"
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
import { errors, getPasswordError } from "@hostek/shared"
import React, { useCallback, useState } from "react"

interface ChangePasswordTabProps {
    l: boolean
}

const ChangePasswordTab: React.FC<ChangePasswordTabProps> = ({ l }) => {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [updatePasswordError, setUpdatePasswordError] = useState<
        string | null
    >(null)

    const [{ fetching: updatePasswordFetching }, updatePassword] =
        useUpdatePasswordMutation()

    const handlePasswordUpdate = useCallback<HandleSubmit>(
        async (e) => {
            e.preventDefault()

            // console.warn("hey!")

            if (!l) return

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
        [l, newPassword, confirmPassword, currentPassword, updatePassword]
    )

    return (
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
                <Form className="space-y-2" onSubmit={handlePasswordUpdate}>
                    <Input
                        label="Current Password"
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        isInvalid={
                            confirmPassword !== "" &&
                            newPassword !== confirmPassword
                        }
                        errorMessage={
                            confirmPassword !== "" &&
                            newPassword !== confirmPassword
                                ? errors.passwordMismatch
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
    )
}

export default ChangePasswordTab
