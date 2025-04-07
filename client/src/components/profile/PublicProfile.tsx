"use client"
import { UserFromGetUserByPublicIdQueryType } from "@/types"
import React from "react"

interface PublicProfileProps {
    user: UserFromGetUserByPublicIdQueryType
}

const PublicProfile: React.FC<PublicProfileProps> = ({ user }) => {
    return <div>Public Identifier: {user.identifier}</div>
}

export default PublicProfile
