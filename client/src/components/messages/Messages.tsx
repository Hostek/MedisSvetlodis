"use client"
import { MessageWithCreatorFragmentFragment } from "@/generated/graphql"
import { formatUniversalDate } from "@/utils/formatTimestamp"
import { Card, CardBody, CardHeader } from "@heroui/react"
import React from "react"

interface MessagesProps {
    messages: MessageWithCreatorFragmentFragment[]
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">Messages</h2>
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
    )
}

export default Messages
