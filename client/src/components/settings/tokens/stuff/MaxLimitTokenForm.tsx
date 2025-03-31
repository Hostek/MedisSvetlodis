"use client"
import { HandleSubmit } from "@/types"
import { Button, Form, Input } from "@heroui/react"
import React, { useCallback, useState } from "react"
import { Play } from "react-feather"

interface MaxLimitTokenFormProps {
    initialValue: number | null | undefined
    tokenId: number
}

const MaxLimitTokenForm: React.FC<MaxLimitTokenFormProps> = ({
    initialValue,
    // tokenId,
}) => {
    const [valueMU, setValueMU] = useState(initialValue?.toString())

    const handleSubmit = useCallback<HandleSubmit>((e) => {
        e.preventDefault()
    }, [])

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
            >
                <Play />
            </Button>
        </Form>
    )
}

export default MaxLimitTokenForm
