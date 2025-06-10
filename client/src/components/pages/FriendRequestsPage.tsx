"use client"
import { useGetFriendRequestsQuery } from "@/generated/graphql"
import { Spinner } from "@heroui/react"
import React from "react"
import BackButton from "../ui/BackButton"
import FriendRequestCard from "../friends/friend_request/FriendRequestCard"

interface FriendRequestsPageProps {}

const FriendRequestsPage: React.FC<FriendRequestsPageProps> = ({}) => {
    const [{ fetching, data }] = useGetFriendRequestsQuery()

    if (!data || fetching) {
        return (
            <div
                aria-label="Loading..."
                className="max-w-screen-md mx-auto flex justify-center align-middle content-center items-center"
            >
                <Spinner />
            </div>
        )
    }

    return (
        <div
            className="max-w-screen-md mx-auto p-6 space-y-6"
            role="region"
            aria-label="Friend requests section"
        >
            <BackButton aria-label="Go back to previous page" />
            <h1 className="font-bold text-4xl" id="friend-requests-heading">
                Pending Friend Requests
            </h1>
            <ul
                className="full-width flex flex-col gap-4"
                aria-labelledby="friend-requests-heading"
            >
                {data.getFriendRequests.map((request) => {
                    return (
                        <li key={request.id}>
                            <FriendRequestCard request={request} />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default FriendRequestsPage
