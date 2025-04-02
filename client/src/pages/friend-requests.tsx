"use client"
import BasicLayout from "@/components/layouts/BasicLayout"
import FriendRequestsPage from "@/components/pages/FriendRequestsPage"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"

const Page: NextPage = () => {
    return (
        <BasicLayout>
            <FriendRequestsPage />
        </BasicLayout>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
