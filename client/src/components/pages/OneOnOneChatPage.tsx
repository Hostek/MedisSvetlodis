"use client"
import { useAppContext } from "@/context/AppContext"
import { useCreateMessageFriendMutation } from "@/generated/graphql"
import { Button, Divider, Form, Textarea } from "@heroui/react"
import { errors, getMessageError } from "@hostek/shared"
import React, { useCallback, useState } from "react"
import MessageNotification from "../messages/MessageNotification"

interface OneOnOneChatPageProps {
    friendIdentifier: string
}

const OneOnOneChatPage: React.FC<OneOnOneChatPageProps> = ({
    friendIdentifier,
}) => {
    const { user } = useAppContext()

    const [error, setError] = useState("")
    const [content, setContent] = useState("")

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

    if (!user) {
        return null
    }

    return (
        <div className="text-2xl">
            <div>friend id: {friendIdentifier}</div>
            <div>your id: {user.identifier}</div>

            <Divider />

            {/* @TODO – show messages .. */}

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
