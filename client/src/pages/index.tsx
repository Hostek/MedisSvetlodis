"use client"
import {
    MessageWithCreatorFragmentFragment,
    useCreateMessageMutation,
    useGetAllMessagesQuery,
    useMessageAddedSubscription,
} from "@/generated/graphql"
import { useIsAuth } from "@/hooks/isAuth"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { formatUniversalDate } from "@/utils/formatTimestamp"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Form,
    Input,
    Navbar,
    NavbarContent,
    NavbarItem,
} from "@heroui/react"
import { getMessageError } from "@hostek/shared"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

const Page: NextPage = () => {
    const [content, setContent] = useState("")
    const [error, setError] = useState("")
    const [{ fetching }, createMessage] = useCreateMessageMutation()
    const [{ fetching: queryFetching, data }] = useGetAllMessagesQuery()
    const [{ data: newMsgData }] = useMessageAddedSubscription()
    const { user } = useIsAuth()

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

            await createMessage({ content, creatorId: user.id })
            setContent("")
        },
        [createMessage, content, user]
    )

    if (!user) {
        return null
    }

    return (
        <>
            <Navbar className="flex justify-center items-center mb-4">
                <NavbarContent className="text-foreground">
                    <NavbarItem>
                        <span className="font-medium">User: </span>
                        {user.username}
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Link href="/logout" color="danger">
                            Logout
                        </Link>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <div className="max-w-screen-md mx-auto p-6 space-y-6">
                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-foreground">
                        Messages
                    </h2>
                    <div className="space-y-3">
                        {messages.map((msg) => (
                            <Card
                                key={msg.id}
                                shadow="sm"
                                className="border-none"
                            >
                                <CardHeader className="flex justify-between pb-0">
                                    <span className="font-bold text-foreground">
                                        {msg.creator.username}
                                    </span>
                                    <span className="text-sm text-default-500">
                                        {formatUniversalDate(msg.createdAt)}
                                    </span>
                                </CardHeader>
                                <CardBody className="py-2">
                                    {msg.content}
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>

                <Form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Message content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fullWidth
                    />
                    {error && (
                        <div className="w-full text-red-500">
                            Error: {error}
                        </div>
                    )}
                    <Button type="submit" color="primary" className="w-full">
                        Submit
                    </Button>
                </Form>
            </div>
        </>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
