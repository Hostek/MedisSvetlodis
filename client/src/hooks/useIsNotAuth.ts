import { useRouter } from "next/router"
import { useEffect } from "react"
import { useUserQuery } from "../generated/graphql"

export const useIsNotAuth = () => {
    const [{ data, fetching }] = useUserQuery({ requestPolicy: "network-only" })
    const Router = useRouter()
    useEffect(() => {
        if (!fetching && data?.user) {
            Router.replace("/", "/")
        }
    }, [fetching, data, Router])
}
