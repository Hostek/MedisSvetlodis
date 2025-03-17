"use client"
import {
    MessageWithCreatorFragmentFragment,
    useCreateMessageMutation,
    useGetAllMessagesQuery,
    useMessageAddedSubscription,
} from "@/generated/graphql"
import { useIsAuth } from "@/hooks/isAuth"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { Button } from "@heroui/react"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

const Page: NextPage = () => {
    const [content, setContent] = useState("")
    const [{ fetching }, createMessage] = useCreateMessageMutation()
    const [{ fetching: queryFetching, data }] = useGetAllMessagesQuery()
    const [{ data: newMsgData }] = useMessageAddedSubscription()
    const { user } = useIsAuth()

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
            await createMessage({ content, creatorId: user.id })
            setContent("") // Clear input after submission
        },
        [createMessage, content, user]
    )

    if (!user) {
        return null
    }

    return (
        <div className="bg-amber-950 text-red-400">
            <Link href="/login">login</Link>
            <br />
            <Link href="/logout">logout</Link>
            <br />
            <div>u are: {user.username}</div>
            <div>fetching: {String(fetching)}</div>
            <div>queryFetching: {String(queryFetching)}</div>

            <div>
                Messages:
                <div>
                    {messages.map((msg) => (
                        <div key={msg.id}>
                            {msg.creator.username} posted this msg: |{" "}
                            {msg.content}
                        </div>
                    ))}
                </div>
            </div>

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
        </div>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
