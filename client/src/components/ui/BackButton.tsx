"use client"
import { Button } from "@heroui/react"
import React from "react"
import { ArrowLeft } from "react-feather"

interface BackButtonProps {
    link?: string
    className?: string | undefined
}

const BackButton: React.FC<BackButtonProps> = ({ link, className }) => {
    return (
        <Button
            as="a"
            href={link ? link : "/"}
            fullWidth
            aria-label="Go to home page"
            className={className}
        >
            <ArrowLeft />
        </Button>
    )
}

export default BackButton
