"use client"
import FriendRequestForm from "@/components/friends/friend_request/FriendRequestForm"
import BasicLayout from "@/components/layouts/BasicLayout"
import BackButton from "@/components/ui/BackButton"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import { useMemo } from "react"

const Page: NextPage = () => {
    const Router = useRouter()
    const { defaulttoken } = Router.query

    const defaultToken = useMemo(() => {
        if (typeof defaulttoken === "string") return defaulttoken
        return undefined
    }, [defaulttoken])

    return (
        <BasicLayout>
            <div className="flex flex-col gap-4 w-full max-w-screen-md mx-auto p-4">
                <BackButton />
                <h1 className="font-bold text-4xl">Friend Request Form</h1>
                <FriendRequestForm defaultToken={defaultToken} />
            </div>
        </BasicLayout>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
