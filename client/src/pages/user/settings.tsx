"use client"
import ChangePasswordTab from "@/components/settings/ChangePasswordTab"
import FriendRequestTokens from "@/components/settings/FriendRequestTokens"
import UpdateUsername from "@/components/settings/UpdateUsername"
import { useIsAuth } from "@/hooks/isAuth"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { Button, Divider, Tab, Tabs } from "@heroui/react"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { useState } from "react"
import { ArrowLeft } from "react-feather"

const Page: NextPage = () => {
    const { user } = useIsAuth()

    const [showIdentifier, setShowIdentifier] = useState(false)

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
                    <UpdateUsername
                        updateUsernameAttempts={user.updateUsernameAttempts}
                        l={!!user}
                        x={() => user.updateUsernameAttempts--}
                    />
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

            <Divider />

            <FriendRequestTokens
                l={!!user}
                generatedDefaultFriendRequestTokens={
                    user.generatedDefaultFriendRequestTokens
                }
            />
        </div>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
