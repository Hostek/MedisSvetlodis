"use client"
import { useAppContext } from "@/context/AppContext"
import React from "react"

interface OneOnOneChatPageProps {
    friendIdentifier: string
}

const OneOnOneChatPage: React.FC<OneOnOneChatPageProps> = ({
    friendIdentifier,
}) => {
    const { user } = useAppContext()

    if (!user) {
        return null
    }

    return (
        <div className="text-2xl">
            <div>friend id: {friendIdentifier}</div>
            <div>your id: {user.identifier}</div>
        </div>
    )
}

export default OneOnOneChatPage
