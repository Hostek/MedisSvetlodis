"use client"
import BasicLayout from "@/components/layouts/BasicLayout"
import FriendsPage from "@/components/pages/FriendsPage"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"

const Page: NextPage = () => {
    return (
        <BasicLayout>
            <FriendsPage />
        </BasicLayout>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
