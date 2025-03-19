"use client"
import { useIsAuth } from "@/hooks/isAuth"
import { createUrqlClient } from "@/utils/createUrqlClient"
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
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { useState } from "react"

const Page: NextPage = () => {
    const { user } = useIsAuth()

    const [username, setUsername] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    if (!user) {
        return null
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-screen-md mx-auto p-4">
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
                            <Form className="space-y-2">
                                <Input
                                    label="New Username"
                                    placeholder="Enter new username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                                <Button
                                    type="submit"
                                    color="primary"
                                    className="w-full"
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
                            Change Password
                        </CardHeader>
                        <Divider />
                        <CardBody className="flex flex-col gap-4">
                            <Form className="space-y-2">
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
                                <Button color="primary" className="w-full">
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
