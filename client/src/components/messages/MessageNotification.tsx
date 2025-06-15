"use client"
import { useUsrMessageAddedSubscription } from "@/generated/graphql"
import { cropText } from "@/utils/cropText"
import React, { useEffect } from "react"
import { Bounce, toast, ToastContainer } from "react-toastify"

/**
 *
 * Handle message notification system .. (so, when,
 * receiving a subscription shows notification with
 * react-tostify )
 *
 */

interface MessageNotificationProps {
    channelIdToIgnore?: string
}

const MessageNotification: React.FC<MessageNotificationProps> = ({
    channelIdToIgnore,
}) => {
    const [{ data }] = useUsrMessageAddedSubscription()

    useEffect(() => {
        if (
            data?.usrMessageAdded &&
            data.usrMessageAdded.channelIdentifier !== channelIdToIgnore
        ) {
            // console.log("New message received:", data.usrMessageAdded)

            toast.info(
                `New message from @${data.usrMessageAdded.message.creator.username}! (${data.usrMessageAdded.message.creator.identifier}); Message: ${cropText(data.usrMessageAdded.message.content)}`,
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                }
            )
        }
    }, [data, channelIdToIgnore])

    useEffect(() => {}, [])

    return <ToastContainer pauseOnFocusLoss={false} />
}

export default MessageNotification
