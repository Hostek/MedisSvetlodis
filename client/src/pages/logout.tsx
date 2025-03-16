"use client"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NextPage } from "next"
import { signOut } from "next-auth/react"
import { withUrqlClient } from "next-urql"

const Page: NextPage = () => {
    return (
        <div>
            Hello World!
            <button onClick={() => signOut()}>logout</button>
        </div>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
