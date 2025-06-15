"use client"
import { MESSAGE_PAGE_SIZE } from "@/constants"
import { useAppContext } from "@/context/AppContext"
import {
    MessageWithCreatorFragmentFragment,
    useCreateMessageFriendMutation,
    useGetMessagesFromFriendQuery,
    useUsrMessageAddedSubscription,
} from "@/generated/graphql"
import { Button, Divider, Form, Textarea } from "@heroui/react"
import { errors, getMessageError, MAX_MESSAGE_LENGTH } from "@hostek/shared"
import React, { useCallback, useEffect, useState } from "react"
import MessageNotification from "../messages/MessageNotification"
import Messages from "../messages/Messages"

interface OneOnOneChatPageProps {
    friendIdentifier: string
}

const OneOnOneChatPage: React.FC<OneOnOneChatPageProps> = ({
    friendIdentifier,
}) => {
    const { user } = useAppContext()

    const [error, setError] = useState("")
    const [content, setContent] = useState("")

    const [messages, setMessages] = useState<
        MessageWithCreatorFragmentFragment[]
    >([])
    const [cursor, setCursor] = useState<string | null>(null)
    const [hasNextPage, setHasNextPage] = useState(true)

    const [{ data, fetching }, reexecuteGetMessages] =
        useGetMessagesFromFriendQuery({
            variables: {
                input: {
                    after: cursor,
                    first: MESSAGE_PAGE_SIZE,
                },
                FriendIdentifier: friendIdentifier,
            },
            pause: true, // always pause
        })

    const [{ data: newMsgData }] = useUsrMessageAddedSubscription()

    // Append paginated messages when fetched
    useEffect(() => {
        if (data?.getMessagesFromFriend?.edges) {
            console.log({ data })

            setMessages((prev) => [
                ...data.getMessagesFromFriend.edges
                    .map((e) => e.node)
                    .toReversed(),
                ...prev,
            ])

            setHasNextPage(data.getMessagesFromFriend.pageInfo.hasNextPage)
            setCursor(data.getMessagesFromFriend.pageInfo.endCursor || null)
        }
    }, [data])

    // Append new messages from subscription
    useEffect(() => {
        if (
            newMsgData?.usrMessageAdded &&
            user &&
            (newMsgData.usrMessageAdded.creator.identifier ===
                friendIdentifier ||
                newMsgData.usrMessageAdded.creatorId === user.id)
        ) {
            setMessages((prev) => [...prev, newMsgData.usrMessageAdded])
        }
    }, [newMsgData, user, friendIdentifier])

    const [{ fetching: creatingFetching }, createMessage] =
        useCreateMessageFriendMutation()

    const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        async (e) => {
            e.preventDefault()
            if (!user) return

            const msg_errors = getMessageError(content)
            if (msg_errors) {
                setError(msg_errors)
                return
            }

            const res = await createMessage({
                content,
                friendIdentifier: friendIdentifier,
            })

            console.log({ res })

            if (res.error || !res.data) {
                return setError(errors.unknownError)
            }

            if (res.data.createMessageFriend?.message) {
                return setError(res.data.createMessageFriend.message)
            }

            setContent("")
        },
        [createMessage, content, user, friendIdentifier]
    )

    const loadOlderMessages = useCallback(() => {
        if (hasNextPage && !fetching) {
            reexecuteGetMessages({ requestPolicy: "network-only" })
        }
    }, [hasNextPage, fetching, reexecuteGetMessages])

    if (!user) {
        return null
    }

    return (
        <div className="max-w-screen-md mx-auto">
            <div>friend id: {friendIdentifier}</div>

            <Divider className="my-3" />

            {hasNextPage && (
                <div className="flex justify-center">
                    <Button onPress={loadOlderMessages} disabled={fetching}>
                        {fetching ? "Loading..." : "Load older messages"}
                    </Button>
                </div>
            )}

            <Messages messages={messages} />

            <Divider className="my-3" />

            <div
                className={`flex justify-start mt-2 text-sm ${
                    content.length >= MAX_MESSAGE_LENGTH
                        ? "text-red-500"
                        : content.length >= MAX_MESSAGE_LENGTH * 0.9
                          ? "text-yellow-500"
                          : "text-gray-300"
                }`}
            >
                <span className="font-mono">{content.length}</span>
                <span className="text-gray-200 mx-0.5">/</span>
                <span className="font-mono">{MAX_MESSAGE_LENGTH}</span>
            </div>

            <Form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                    label="Message content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    fullWidth
                />
                {error && (
                    <div className="w-full text-red-500">Error: {error}</div>
                )}
                <Button
                    type="submit"
                    color="primary"
                    className="w-full"
                    disabled={creatingFetching}
                >
                    Submit
                </Button>
            </Form>

            <MessageNotification />
        </div>
    )
}

export default OneOnOneChatPage
