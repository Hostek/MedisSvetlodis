"use client"
import {
    useCreateMessageMutation,
    useGetAllMessagesQuery,
} from "@/generated/graphql"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { useCallback, useState } from "react"

const Page: NextPage = () => {
    const [content, setContent] = useState("")
    const [{ fetching }, createMessage] = useCreateMessageMutation()
    const [{ fetching: queryFetching, data }] = useGetAllMessagesQuery()

    const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        async (e) => {
            e.preventDefault()

            const res = await createMessage({
                content,
                creatorId: 1,
            })

            console.log({ res })
        },
        [createMessage, content]
    )

    return (
        <div>
            <div>fetching: {String(fetching)}</div>
            <div>queryFetching: {String(queryFetching)}</div>
            <form onSubmit={handleSubmit}>
                Content msg:
                <input
                    value={content}
                    onChange={(e) => setContent(e.currentTarget.value)}
                />
                <button type="submit">Submit</button>
            </form>

            <div>
                Messages:
                <div>
                    {data
                        ? data.getAllMessages.map((msg) => (
                              <div key={msg.id}>{msg.content}</div>
                          ))
                        : null}
                </div>
            </div>
        </div>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
