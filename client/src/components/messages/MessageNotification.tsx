"use client"
import { useUsrMessageAddedSubscription } from "@/generated/graphql"
import React, { useEffect } from "react"

interface MessageNotificationProps {}

/**
 *
 * Handle message notification system .. (so, when,
 * receiving a subscription shows notification with
 * react-tostify )
 *
 */

const MessageNotification: React.FC<MessageNotificationProps> = ({}) => {
    const [{ data }] = useUsrMessageAddedSubscription()

    useEffect(() => {
        if (data?.usrMessageAdded) {
            console.log("New message received:", data.usrMessageAdded)
        }
    }, [data])

    return null
}

export default MessageNotification
