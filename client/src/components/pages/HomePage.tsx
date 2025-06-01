"use client"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@heroui/react"
import Link from "next/link"
import React from "react"
import FriendsListOldUI from "../friends/FriendsListOldUI"
import MessageCreationOld from "../messages/old/MessageCreationOld"

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = ({}) => {
    const { user } = useAppContext()

    if (!user) {
        return null
    }

    return (
        <div className="max-w-screen-md mx-auto p-6 space-y-6">
            <div className="full-width">
                USER ID: {user.id}
                <br />
                <Link href={"/friends"}>Friends Link</Link>
            </div>
            <div className="full-width">
                <Button
                    as="a"
                    href="/friend-request"
                    fullWidth
                    className="uppercase text-lg"
                    color="secondary"
                >
                    Send friend request
                </Button>
            </div>
            <div className="full-width">
                <Button
                    as="a"
                    href="/friend-requests"
                    fullWidth
                    className="uppercase text-lg"
                    color="secondary"
                >
                    Incoming friend requests
                </Button>
            </div>
            <div className="space-y-4">
                <h2 className="text-lg font-medium text-foreground">Friends</h2>
                <FriendsListOldUI />
            </div>

            <MessageCreationOld user={user} />
        </div>
    )
}

export default HomePage
