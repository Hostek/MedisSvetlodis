import { useUserQuery } from "@/generated/graphql"
import { useRouter } from "next/router"
import { useEffect } from "react"

export const useIsAuth = () => {
    const router = useRouter()
    const [{ data, fetching, error }] = useUserQuery({
        requestPolicy: "network-only",
    })

    useEffect(() => {
        if (!fetching && !data?.user && router.pathname !== "/login") {
            router.replace(`/login?next=${encodeURIComponent(router.pathname)}`)
        }
    }, [fetching, data, router])

    return {
        user: data?.user,
        loading: fetching,
        error,
    }
}
