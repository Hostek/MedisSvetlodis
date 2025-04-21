"use client"
import { useGetFriendsQuery } from "@/generated/graphql"
import { Spinner } from "@heroui/react"
import React, { useCallback, useEffect, useState } from "react"
import Error from "../helper/Error"
import { errors } from "@hostek/shared"

interface FriendsListProps {}

const FriendsList: React.FC<FriendsListProps> = () => {
    const [variables, setVariables] = useState({
        first: 10,
        after: null as string | null,
    })
    const [allEdges, setAllEdges] = useState<any[]>([])

    const [{ data, fetching, error }] = useGetFriendsQuery({
        variables: { input: variables },
        requestPolicy: "cache-and-network",
    })

    useEffect(() => {
        if (data && !fetching) {
            setAllEdges((prev) => [...prev, ...data.getFriends.edges])
        }
    }, [data, fetching])

    const loadMore = useCallback(() => {
        if (!data?.getFriends.pageInfo.hasNextPage) return
        setVariables((prev) => ({
            first: prev.first,
            after: data.getFriends.pageInfo.endCursor ?? null,
        }))
    }, [data])

    if (!data && fetching) return <Spinner />
    if (error) return <Error>{errors.unknownError}</Error>
    if (!data) return <Error>No friends found</Error>

    return (
        <div>
            {allEdges.map(({ node, cursor }) => (
                <div key={cursor} className="friend-item">
                    {node.identifier} | @{node.username}
                </div>
            ))}

            {data.getFriends.pageInfo.hasNextPage && (
                <button onClick={loadMore} disabled={fetching}>
                    {fetching ? "Loading..." : "Load More"}
                </button>
            )}
        </div>
    )
}

export default FriendsList
