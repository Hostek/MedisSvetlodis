"use client"
import BasicLayout from "@/components/layouts/BasicLayout"
import HomePage from "@/components/pages/HomePage"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"

const Page: NextPage = () => {
    return (
        <BasicLayout>
            <HomePage />
        </BasicLayout>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
