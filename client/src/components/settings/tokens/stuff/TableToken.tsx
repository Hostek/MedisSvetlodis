"use client"
import React, { useMemo, useState } from "react"
import { Tooltip } from "react-tooltip"

interface TableTokenProps {
    token: string
}

// in lieu of (hmm)

const TableToken: React.FC<TableTokenProps> = ({ token }) => {
    const [tooltipContent, setTooltipContent] = useState("Click to copy!")
    const [tooltipColor, setTooltipColor] = useState<
        "dark" | "success" | "error"
    >("dark")
    const id = useMemo(() => `${token}_unique_id_tooltip`, [token])

    return (
        <>
            <div
                data-tooltip-id={id}
                data-tooltip-content={tooltipContent}
                data-tooltip-variant={tooltipColor}
                data-tooltip-delay-hide={250}
                onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(token)
                        setTooltipContent("Successfully copied!")
                        setTooltipColor("success")
                    } catch {
                        setTooltipContent("Failed to copy")
                        setTooltipColor("error")
                    }
                }}
            >
                {token}
            </div>
            <Tooltip id={id} className="text-lg" />
        </>
    )
}

export default TableToken
