"use client"
import { FriendListEdge } from "@/types"
import { Card } from "@heroui/react"
import React from "react"
import CircleAvatar from "../ui/CircleAvatar"
import { getFirstCharOrDefault } from "@/utils/getFirstCharOrDefault"

interface FriendCardProps {
    edge: FriendListEdge
}

const FriendCard: React.FC<FriendCardProps> = ({ edge: { node } }) => {
    return (
        <Card
            className="my-7 py-5 cursor-pointer transform transition-transform duration-300 hover:scale-110"
            as="a"
            href={`/friends/${node.identifier}`}
        >
            <div className="flex">
                <div className="w-24 flex items-center justify-center">
                    <CircleAvatar
                        color={node.avatarBgColor}
                        letter={getFirstCharOrDefault(node.username)}
                    />
                </div>
                <div className="flex-1">
                    <div className="flex flex-col">
                        <p className="text-lg font-bold">@{node.username}</p>
                        <p className="text-small text-gray-500">
                            {node.identifier}
                        </p>
                    </div>
                </div>
                <div className="w-24">{/*Right*/}</div>
            </div>
            {/*  */}
        </Card>
    )
}

export default FriendCard
