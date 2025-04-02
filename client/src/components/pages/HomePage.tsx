"use client"
import { useAppContext } from "@/context/AppContext"
import {
    MessageWithCreatorFragmentFragment,
    useCreateMessageMutation,
    useGetAllMessagesQuery,
    useMessageAddedSubscription,
} from "@/generated/graphql"
import { formatUniversalDate } from "@/utils/formatTimestamp"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Form,
    Textarea,
} from "@heroui/react"
import { errors, getMessageError, MAX_MESSAGE_LENGTH } from "@hostek/shared"
import React, { useCallback, useEffect, useState } from "react"

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = ({}) => {
    const [content, setContent] = useState("")
    const [error, setError] = useState("")
    const [{ fetching }, createMessage] = useCreateMessageMutation()
    const [{ fetching: queryFetching, data }] = useGetAllMessagesQuery()
    const [{ data: newMsgData }] = useMessageAddedSubscription()
    // const { user } = useIsAuth()
    const { user } = useAppContext()

    console.log({ fetching, queryFetching })

    // Combine initial messages + subscription updates
    const [messages, setMessages] = useState<
        MessageWithCreatorFragmentFragment[]
    >([])

    // Initialize with data from the initial query
    useEffect(() => {
        if (data?.getAllMessages) {
            setMessages(data.getAllMessages)
        }
    }, [data?.getAllMessages])

    // Append new messages from the subscription
    useEffect(() => {
        if (newMsgData?.messageAdded) {
            setMessages((prev) => [...prev, newMsgData.messageAdded])
        }
    }, [newMsgData?.messageAdded])

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

    if (!user) {
        return null
    }

    return (
        <div className="max-w-screen-md mx-auto p-6 space-y-6">
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
            <div className="space-y-4">
                <h2 className="text-lg font-medium text-foreground">
                    Messages
                </h2>
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <Card key={msg.id} shadow="sm" className="border-none">
                            <CardHeader className="flex justify-between pb-0">
                                <span className="font-bold text-foreground">
                                    {msg.creator.username}
                                </span>
                                <span className="text-sm text-default-500">
                                    {formatUniversalDate(msg.createdAt)}
                                </span>
                            </CardHeader>
                            <CardBody className="py-2">{msg.content}</CardBody>
                        </Card>
                    ))}
                </div>
            </div>

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
                <Button type="submit" color="primary" className="w-full">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default HomePage
