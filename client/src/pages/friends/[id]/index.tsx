"use client"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import { useMemo } from "react"

const Page: NextPage = () => {
    const router = useRouter()
    const { id } = router.query

    const realId = useMemo(() => {
        if (typeof id === "string") return id
        else return "none"
    }, [id])

    return <div>ID: {realId}</div>
}

export default withUrqlClient(createUrqlClient)(Page)
