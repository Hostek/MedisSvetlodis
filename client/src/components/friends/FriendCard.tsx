"use client"
import { FriendListEdge } from "@/types"
import React from "react"

interface FriendCardProps {
    edge: FriendListEdge
}

const FriendCard: React.FC<FriendCardProps> = ({ edge: { node } }) => {
    return (
        <div className="friend-item">
            {node.identifier} | @{node.username}
        </div>
    )
}

export default FriendCard
