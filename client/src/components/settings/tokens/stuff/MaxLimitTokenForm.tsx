"use client"
import { useUpdateMaxLimitFriendRequestTokenMutation } from "@/generated/graphql"
import { HandleSubmit } from "@/types"
import { MySwal } from "@/utils/MySwal"
import { Button, Form, Input } from "@heroui/react"
import { errors } from "@hostek/shared"
import React, { useCallback, useState } from "react"
import { Play } from "react-feather"

interface MaxLimitTokenFormProps {
    initialValue: number | null | undefined
    tokenId: number
    setAllError: React.Dispatch<React.SetStateAction<string | null>>
}

const MaxLimitTokenForm: React.FC<MaxLimitTokenFormProps> = ({
    initialValue,
    tokenId,
    setAllError,
}) => {
    const [valueMU, setValueMU] = useState(initialValue?.toString())

    const [{ fetching }, updateMaxLimit] =
        useUpdateMaxLimitFriendRequestTokenMutation()

    const handleSubmit = useCallback<HandleSubmit>(
        async (e) => {
            e.preventDefault()

            if (fetching) return

            setAllError(null)

            const newMaxLimitLocal = valueMU ? parseInt(valueMU) : null

            const res = await updateMaxLimit({
                tokenId,
                newMaxLimit: newMaxLimitLocal,
            })

            if (res.error || !res.data) {
                return setAllError(errors.unknownError)
            }

            if (res.data.updateMaxLimitFriendRequestToken?.message) {
                return setAllError(
                    res.data.updateMaxLimitFriendRequestToken.message
                )
            }

            // token updated! success.

            // @TODO should we update tokens list after so that it is updated? Maybe.

            MySwal.fire({
                title: "Success!",
                text: "Maximum usage limit updated successfully!",
                icon: "success",
                theme: "dark",
            })

            // btw: "successfully" – remember this
        },
        [fetching, updateMaxLimit, tokenId, valueMU, setAllError]
    )

    return (
        <Form onSubmit={handleSubmit} className="flex-row">
            <Input
                placeholder="Empty = Unlimited"
                value={valueMU}
                onChange={(e) => setValueMU(e.currentTarget.value)}
                type="number"
                className="w-40"
            />
            <Button
                type="submit"
                isIconOnly
                color="secondary"
                title="Update maximum usage"
                disabled={fetching}
            >
                <Play />
            </Button>
        </Form>
    )
}

export default MaxLimitTokenForm
