"use client"
import FriendRequestForm from "@/components/friend_request/FriendRequestForm"
import BasicLayout from "@/components/layouts/BasicLayout"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { Button } from "@heroui/react"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { ArrowLeft } from "react-feather"

const Page: NextPage = () => {
    return (
        <BasicLayout>
            <div className="flex flex-col gap-4 w-full max-w-screen-md mx-auto p-4">
                <Button as="a" href="/">
                    <ArrowLeft />
                </Button>
                <h1 className="font-bold text-4xl">Friend Request Form</h1>
                <FriendRequestForm />
            </div>
        </BasicLayout>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
