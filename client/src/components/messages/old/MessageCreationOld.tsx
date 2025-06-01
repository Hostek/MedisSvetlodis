"use client"
import { Button, Divider, Form, Textarea } from "@heroui/react"
import React, { useCallback, useEffect, useState } from "react"
import Messages from "../Messages"
import { errors, getMessageError, MAX_MESSAGE_LENGTH } from "@hostek/shared"
import {
    MessageWithCreatorFragmentFragment,
    useCreateMessageMutation,
    useGetMessagesQuery,
    useMessageAddedSubscription,
} from "@/generated/graphql"
import { MESSAGE_PAGE_SIZE } from "@/constants"
import { UserType } from "@/types"

interface MessageCreationOldProps {
    user: UserType
}

const MessageCreationOld: React.FC<MessageCreationOldProps> = ({ user }) => {
    const [content, setContent] = useState("")
    const [error, setError] = useState("")
    const [{ fetching: creatingFetching }, createMessage] =
        useCreateMessageMutation()

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

    return (
        <>
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
        </>
    )
}

export default MessageCreationOld
