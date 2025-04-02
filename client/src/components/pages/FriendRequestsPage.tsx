"use client"
import { useGetFriendRequestsQuery } from "@/generated/graphql"
import React from "react"
import BackButton from "../ui/BackButton"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Code,
    Divider,
    Spinner,
} from "@heroui/react"
import { formatUniversalDate } from "@/utils/formatTimestamp"
import { Check, X } from "react-feather"

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
        <div className="max-w-screen-md mx-auto p-6 space-y-6">
            <BackButton />
            <h1 className="font-bold text-4xl">Pending Friend Requests</h1>
            <div className="full-width flex flex-col gap-4">
                {data.getFriendRequests.map((request) => {
                    return (
                        <Card
                            key={request.id}
                            className="border-none shadow-lg hover:shadow-xl transition-shadow duration-200"
                        >
                            <CardHeader className="flex flex-col pb-4 space-y-2">
                                <div className="flex justify-between items-center w-full">
                                    <div className="text-sm text-gray-500">
                                        {formatUniversalDate(request.createdAt)}
                                    </div>
                                    <div
                                        className={`px-2 py-1 rounded-full text-lg`}
                                    >
                                        {request.status.toUpperCase()}
                                    </div>
                                </div>

                                <div className="space-y-1 w-full">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            Sender:
                                        </span>
                                        <span className="text-blue-600">
                                            {request.sender.identifier}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            (@{request.sender.username})
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-300">
                                            Token:
                                        </span>
                                        <Code>
                                            {request.requestToken.token}
                                        </Code>
                                    </div>
                                </div>
                            </CardHeader>

                            <Divider />

                            <CardBody className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    color="success"
                                    className="flex-1 flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                                >
                                    <Check className="w-4 h-4" />
                                    Accept
                                </Button>
                                <Button
                                    color="danger"
                                    className="flex-1 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </Button>
                            </CardBody>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

export default FriendRequestsPage
