"use client"
import BasicLayout from "@/components/layouts/BasicLayout"
import ProfilePage from "@/components/pages/ProfilePage"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { Spinner } from "@heroui/react"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import { useMemo } from "react"

const Page: NextPage = () => {
    const Router = useRouter()
    const { id } = Router.query

    const realIdentifier = useMemo(() => {
        if (typeof id === "string") return id
        return undefined
    }, [id])

    if (!realIdentifier) {
        return <Spinner />
    }

    return (
        <BasicLayout>
            <ProfilePage realIdentifier={realIdentifier} />
        </BasicLayout>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
