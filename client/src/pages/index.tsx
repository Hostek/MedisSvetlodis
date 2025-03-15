"use client"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"

const Page: NextPage = () => {
    return <div>Hello World!</div>
}

export default withUrqlClient(createUrqlClient)(Page)
