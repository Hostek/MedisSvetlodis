"use client"
import React from "react"
import FriendsList from "../friends/FriendsList"

interface FriendsPageProps {}

const FriendsPage: React.FC<FriendsPageProps> = ({}) => {
    return (
        <div className="max-w-screen-md mx-auto p-6 space-y-6">
            <div className="space-y-4">
                <h2 className="text-lg font-medium text-foreground">Friends</h2>
                <FriendsList />
            </div>
        </div>
    )
}

export default FriendsPage
