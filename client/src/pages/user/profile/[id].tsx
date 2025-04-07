"use client"
import BasicLayout from "@/components/layouts/BasicLayout"
import ProfilePage from "@/components/pages/ProfilePage"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"

const Page: NextPage = () => {
    return (
        <BasicLayout>
            <ProfilePage />
        </BasicLayout>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
