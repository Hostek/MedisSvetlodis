"use client"
import { Button } from "@heroui/react"
import React from "react"
import { ArrowLeft } from "react-feather"

interface BackButtonProps {
    link?: string
}

const BackButton: React.FC<BackButtonProps> = ({ link }) => {
    return (
        <Button as="a" href={link ? link : "/"} fullWidth>
            <ArrowLeft />
        </Button>
    )
}

export default BackButton
