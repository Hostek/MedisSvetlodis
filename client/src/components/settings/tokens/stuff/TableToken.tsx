"use client"
import { Tooltip } from "@heroui/react"
import React, { useState } from "react"

interface TableTokenProps {
    token: string
}

// in lieu of (hmm)

const TableToken: React.FC<TableTokenProps> = ({ token }) => {
    const [tooltipContent, setTooltipContent] = useState("Click to copy!")
    const [tooltipColor, setTooltipColor] = useState<
        "default" | "success" | "danger"
    >("default")

    return (
        <Tooltip content={tooltipContent} color={tooltipColor}>
            <div
                onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(token)
                        setTooltipContent("Successfully copied!")
                        setTooltipColor("success")
                    } catch {
                        setTooltipContent("Failed to copy")
                        setTooltipColor("danger")
                    }
                }}
            >
                {token}
            </div>
        </Tooltip>
    )
}

export default TableToken
