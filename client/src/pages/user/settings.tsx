"use client"
import ChangePasswordTab from "@/components/settings/ChangePasswordTab"
import { RED_COLOR } from "@/constants"
import {
    useCreateDefaultTokensMutation,
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
import { errors, getUsernameError } from "@hostek/shared"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { useCallback, useState } from "react"
import { ArrowLeft } from "react-feather"

const Page: NextPage = () => {
    const { user } = useIsAuth()

    const [showIdentifier, setShowIdentifier] = useState(false)

    const [username, setUsername] = useState("")

    const [updateUsernameError, setUpdateUsernameError] = useState<
        string | null
    >(null)

    const [{ fetching: updateUsernameFetching }, updateUsername] =
        useUpdateUsernameMutation()

    const [{ fetching: createDefaultTokensFetching }, createDefaultTokens] =
        useCreateDefaultTokensMutation()

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
                    <ChangePasswordTab l={!!user} />
                </Tab>
            </Tabs>

            <Divider />

            <div className="w-full">
                <Button
                    className="w-full"
                    onPress={() => setShowIdentifier((v) => !v)}
                    color="warning"
                >
                    Show Identifier
                </Button>
                {showIdentifier && (
                    <div className="w-full text-center my-2">
                        Your identifier: {user.identifier}
                    </div>
                )}
            </div>

            {/* temp button! */}
            <div className="w-full">
                <Button
                    className="w-full"
                    disabled={createDefaultTokensFetching}
                    onPress={async () => {
                        if (!user) return
                        const res = await createDefaultTokens({})

                        console.log({ res })
                    }}
                >
                    Generate Your Default Tokens
                </Button>
            </div>
        </div>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
