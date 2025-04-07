"use client"
import { useAppContext } from "@/context/AppContext"
import { useGetUserByPublicIdQuery } from "@/generated/graphql"
import { Divider, Spinner } from "@heroui/react"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"
import Error from "../helper/Error"
import { errors } from "@hostek/shared"
import PublicProfile from "../profile/PublicProfile"

interface ProfilePageProps {}

const ProfilePage: React.FC<ProfilePageProps> = ({}) => {
    const { user } = useAppContext()

    const Router = useRouter()
    const { id } = Router.query

    const realIdentifier = useMemo(() => {
        if (typeof id === "string") return id
        else return "x"
    }, [id])

    const [{ fetching, data }] = useGetUserByPublicIdQuery({
        variables: { publicId: realIdentifier },
    })

    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (data?.getUserByPublicId.errors) {
            if (data.getUserByPublicId.errors.length > 0)
                setError(data.getUserByPublicId.errors[0].message)
            else setError(errors.unknownError)
        }
    }, [data])

    if (!user || fetching) {
        return <Spinner />
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-screen-md mx-auto p-4">
            <h1 className="text-5xl font-bold text-center">User Profile</h1>
            <Divider />
            {error && <Error>Error: {error}</Error>}
            {data?.getUserByPublicId.user && (
                <PublicProfile user={data.getUserByPublicId.user} />
            )}
        </div>
    )
}

export default ProfilePage
