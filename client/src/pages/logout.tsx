import { useLogoutMutation } from "@/generated/graphql"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Page: NextPage = () => {
    const Router = useRouter()
    const [, logout] = useLogoutMutation()

    useEffect(() => {
        logout({}).then(() => {
            Router.replace("/login")
        })
    }, [Router, logout])

    return null
}

export default withUrqlClient(createUrqlClient)(Page)
