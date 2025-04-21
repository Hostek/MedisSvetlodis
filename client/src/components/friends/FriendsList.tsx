"use client"
import { useGetFriendsQuery } from "@/generated/graphql"
import { Spinner } from "@heroui/react"
import React, { useCallback, useState } from "react"
import Error from "../helper/Error"
import { errors } from "@hostek/shared"

interface FriendsListProps {}

const FriendsList: React.FC<FriendsListProps> = ({}) => {
    const [variables, setVariables] = useState({
        first: 10,
        after: null as string | null,
    })

    const [{ data, fetching, error, stale }] = useGetFriendsQuery({
        variables: { input: variables },
        requestPolicy: "cache-and-network",
    })

    console.log({ data })

    const loadMore = useCallback(() => {
        setVariables((prev) => ({
            ...prev,
            after: data?.getFriends.pageInfo.endCursor || null,
        }))
    }, [data])

    if (fetching) {
        return <Spinner />
    }

    if (error || !data) return <Error>{errors.unknownError}</Error>

    return (
        <div>
            {data.getFriends.edges.map(({ node, cursor }) => (
                <div key={cursor} className="friend-item">
                    <span>
                        {node.identifier} | @{node.username}
                    </span>
                </div>
            ))}

            {data.getFriends.pageInfo.hasNextPage && (
                <button onClick={loadMore} disabled={fetching || stale}>
                    {fetching ? "Loading..." : "Load More"}
                </button>
            )}
        </div>
    )
}

export default FriendsList
