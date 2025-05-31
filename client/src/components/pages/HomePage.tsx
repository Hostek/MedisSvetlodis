"use client"
import { useAppContext } from "@/context/AppContext"
import {
    MessageWithCreatorFragmentFragment,
    useCreateMessageMutation,
    useGetMessagesQuery,
    useMessageAddedSubscription,
} from "@/generated/graphql"
import { Button, Divider, Form, Textarea } from "@heroui/react"
import { errors, getMessageError, MAX_MESSAGE_LENGTH } from "@hostek/shared"
import Link from "next/link"
import React, { useCallback, useEffect, useState } from "react"
import FriendsListOldUI from "../friends/FriendsListOldUI"
import Messages from "../messages/Messages"

interface HomePageProps {}

// @TODO – tmp value
const MESSAGE_PAGE_SIZE = 4

const HomePage: React.FC<HomePageProps> = ({}) => {
    const [content, setContent] = useState("")
    const [error, setError] = useState("")
    const [{ fetching: creatingFetching }, createMessage] =
        useCreateMessageMutation()
    const { user } = useAppContext()

    const [messages, setMessages] = useState<
        MessageWithCreatorFragmentFragment[]
    >([])
    const [cursor, setCursor] = useState<string | null>(null)
    const [hasNextPage, setHasNextPage] = useState(true)

    const [{ data, fetching }, reexecuteGetMessages] = useGetMessagesQuery({
        variables: {
            input: {
                after: cursor,
                first: MESSAGE_PAGE_SIZE,
            },
        },
        pause: true, // always pause
    })

    const [{ data: newMsgData }] = useMessageAddedSubscription()

    // Append paginated messages when fetched
    useEffect(() => {
        if (data?.getMessages?.edges) {
            console.log({ data })

            setMessages((prev) => [
                ...data.getMessages.edges.map((e) => e.node).toReversed(),
                ...prev,
            ])

            setHasNextPage(data.getMessages.pageInfo.hasNextPage)
            setCursor(data.getMessages.pageInfo.endCursor || null)
        }
    }, [data])

    // Append new messages from subscription
    useEffect(() => {
        if (newMsgData?.messageAdded) {
            setMessages((prev) => [...prev, newMsgData.messageAdded])
        }
    }, [newMsgData])

    const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        async (e) => {
            e.preventDefault()
            if (!user) return

            const msg_errors = getMessageError(content)
            if (msg_errors) {
                setError(msg_errors)
                return
            }

            const res = await createMessage({ content })
            if (res.error || !res.data) {
                return setError(errors.unknownError)
            }

            if (res.data.createMessage?.message) {
                return setError(res.data.createMessage.message)
            }

            setContent("")
        },
        [createMessage, content, user]
    )

    const loadOlderMessages = () => {
        if (hasNextPage && !fetching) {
            reexecuteGetMessages({ requestPolicy: "network-only" })
        }
    }

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

            <Divider />

            {hasNextPage && (
                <div className="flex justify-center">
                    <Button onPress={loadOlderMessages} disabled={fetching}>
                        {fetching ? "Loading..." : "Load older messages"}
                    </Button>
                </div>
            )}

            <Messages messages={messages} />

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
        </div>
    )
}

export default HomePage
