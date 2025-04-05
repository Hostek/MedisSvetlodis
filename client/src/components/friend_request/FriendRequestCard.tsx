"use client"
import {
    FriendRequestEnum,
    useHandleFriendRequestMutation,
} from "@/generated/graphql"
import { FriendRequestType } from "@/types"
import { formatUniversalDate } from "@/utils/formatTimestamp"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Code,
    Divider,
    Spinner,
} from "@heroui/react"
import { errors, FRIEND_REQUEST_STATUS_OBJ } from "@hostek/shared"
import React, { useCallback, useMemo, useState } from "react"
import { Check, X } from "react-feather"
import Error from "../helper/Error"

interface FriendRequestCardProps {
    request: FriendRequestType
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ request }) => {
    const [error, setError] = useState<string | null>(null)
    const [{ fetching }, handleFriendRequest] = useHandleFriendRequestMutation()
    const [accepted, setAccepted] = useState(false)
    const [rejected, setRejected] = useState(false)

    const realStatus = useMemo(() => {
        if (accepted) {
            return FRIEND_REQUEST_STATUS_OBJ.accepted
        } else if (rejected) {
            return FRIEND_REQUEST_STATUS_OBJ.rejected
        } else {
            return request.status
        }
    }, [request, accepted, rejected])
    // const fetching = true

    // if(fetching) {}

    const handleClick = useCallback(
        async (actionType: FriendRequestEnum) => {
            if (fetching) return

            setError(null)

            const res = await handleFriendRequest({
                actionType,
                friendRequestId: request.id,
            })

            // console.log({ res })

            if (res.error || !res.data) {
                return setError(errors.unknownError)
            }

            if (res.data.handleFriendRequest?.message) {
                return setError(res.data.handleFriendRequest.message)
            }

            // Good
            if (actionType === FriendRequestEnum.Accept) {
                setAccepted(true)
            } else {
                setRejected(true)
            }
        },
        [fetching, handleFriendRequest, request.id]
    )

    return (
        <Card
            className="border-none shadow-lg hover:shadow-xl transition-shadow duration-200"
            role="article"
            aria-labelledby={`request-${request.id}-sender`}
        >
            <CardHeader className="flex flex-col pb-4 space-y-2">
                <div className="flex justify-between items-center w-full">
                    <div className="text-sm text-gray-500">
                        {formatUniversalDate(request.createdAt)}
                    </div>
                    <div
                        className={`px-2 py-1 rounded-full text-lg`}
                        role="status"
                        aria-label={`Request status: ${realStatus}`}
                    >
                        {realStatus.toUpperCase()}
                    </div>
                </div>

                <div className="space-y-1 w-full">
                    <div
                        className="flex items-center gap-2"
                        id={`request-${request.id}-sender`}
                        aria-label="Sender information"
                    >
                        <span className="font-medium" aria-hidden="true">
                            Sender:
                        </span>
                        <span className="text-blue-600">
                            {request.sender.identifier}
                        </span>
                        <span className="text-gray-500 text-sm">
                            (@{request.sender.username})
                        </span>
                    </div>
                    <div
                        className="flex items-center gap-2 text-sm"
                        aria-label="Request token"
                    >
                        <span className="text-gray-300" aria-hidden="true">
                            Token:
                        </span>
                        <Code aria-labelledby={`request-${request.id}-token`}>
                            {request.requestToken.token}
                        </Code>
                    </div>
                </div>

                {error && <Error>{error}</Error>}

                {fetching && <Spinner aria-hidden />}
            </CardHeader>

            <Divider aria-hidden="true" />

            <CardBody className="flex flex-col sm:flex-row gap-3 pt-4">
                {accepted || rejected ? (
                    <div className="text-green-600">
                        Success! New status: {realStatus.toUpperCase()}
                    </div>
                ) : (
                    <>
                        <Button
                            color="success"
                            className="flex-1 flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                            aria-label={`Accept friend request from ${request.sender.identifier}`}
                            disabled={fetching}
                            onPress={() =>
                                handleClick(FriendRequestEnum.Accept)
                            }
                        >
                            <Check className="w-4 h-4" aria-hidden="true" />
                            <span aria-hidden="true">Accept</span>
                        </Button>
                        <Button
                            color="danger"
                            className="flex-1 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                            aria-label={`Decline friend request from ${request.sender.identifier}`}
                            disabled={fetching}
                            onPress={() =>
                                handleClick(FriendRequestEnum.Reject)
                            }
                        >
                            <X className="w-4 h-4" aria-hidden="true" />
                            <span aria-hidden="true">Cancel</span>
                        </Button>
                    </>
                )}
            </CardBody>
        </Card>
    )
}

export default FriendRequestCard
