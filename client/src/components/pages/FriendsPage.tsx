"use client"
import React from "react"
import FriendsList from "../friends/FriendsList"
import MessageNotification from "../messages/MessageNotification"

interface FriendsPageProps {}

const FriendsPage: React.FC<FriendsPageProps> = ({}) => {
    return (
        <div className="max-w-screen-md mx-auto p-6 space-y-6">
            <div className="space-y-4">
                <h2 className="text-5xl font-medium text-foreground text-center">
                    Friends
                </h2>
                <FriendsList />
                <MessageNotification />
            </div>
        </div>
    )
}

export default FriendsPage
