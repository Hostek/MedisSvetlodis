"use client"
import {
    useCreateMessageMutation,
    useGetAllMessagesQuery,
    useMessageAddedSubscription,
} from "@/generated/graphql"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@heroui/react"
import Link from "next/link"

const Page: NextPage = () => {
    const [content, setContent] = useState("")
    const [{ fetching }, createMessage] = useCreateMessageMutation()
    const [{ fetching: queryFetching, data }] = useGetAllMessagesQuery()
    const [{ data: newMsgData }] = useMessageAddedSubscription()

    // Combine initial messages + subscription updates
    const [messages, setMessages] = useState<
        Array<{ id: number; content: string }>
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
            await createMessage({ content, creatorId: 1 })
            setContent("") // Clear input after submission
        },
        [createMessage, content]
    )

    return (
        <div className="bg-amber-950 text-red-400">
            <Link href="/login">login</Link>
            <div>fetching: {String(fetching)}</div>
            <div>queryFetching: {String(queryFetching)}</div>
            <form onSubmit={handleSubmit}>
                Content msg:
                <input
                    value={content}
                    onChange={(e) => setContent(e.currentTarget.value)}
                />
                <Button type="submit" color="primary">
                    Submit
                </Button>
            </form>

            <div>
                Messages:
                <div>
                    {messages.map((msg) => (
                        <div key={msg.id}>{msg.content}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
