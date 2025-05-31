"use client"
import { useGetFriendsQuery } from "@/generated/graphql"
import { Spinner } from "@heroui/react"
import React, { useCallback, useEffect, useState } from "react"
import Error from "../helper/Error"
import { errors } from "@hostek/shared"

interface FriendsListProps {}

/*
archived component? idk, keep it for now
*/
const FriendsListOldUI: React.FC<FriendsListProps> = () => {
    const [cursor, setCursor] = useState<string | null>(null)
    const [allEdges, setAllEdges] = useState<any[]>([])
    const [hasNextPage, setHasNextPage] = useState(true)

    const [{ data, fetching, error }, reexecuteGetFriends] = useGetFriendsQuery(
        {
            variables: {
                input: {
                    first: 10,
                    after: cursor,
                },
            },
            pause: true, // Always pause
        }
    )

    const loadFriends = useCallback(() => {
        if (hasNextPage && !fetching) {
            reexecuteGetFriends({ requestPolicy: "network-only" })
        }
    }, [hasNextPage, fetching, reexecuteGetFriends])

    useEffect(() => {
        if (data?.getFriends?.edges) {
            setAllEdges((prev) => [...prev, ...data.getFriends.edges])
            setHasNextPage(data.getFriends.pageInfo.hasNextPage)
            setCursor(data.getFriends.pageInfo.endCursor ?? null)
        }
    }, [data])

    // Load first page on mount
    useEffect(() => {
        loadFriends()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // empty deps → runs once

    if (fetching && allEdges.length === 0) return <Spinner />
    if (error) return <Error>{errors.unknownError}</Error>
    if (allEdges.length === 0) return <Error>No friends found</Error>

    return (
        <div>
            {allEdges.map(({ node, cursor }) => (
                <div key={cursor} className="friend-item">
                    {node.identifier} | @{node.username}
                </div>
            ))}

            {hasNextPage && (
                <button onClick={loadFriends} disabled={fetching}>
                    {fetching ? "Loading..." : "Load More"}
                </button>
            )}
        </div>
    )
}

export default FriendsListOldUI
