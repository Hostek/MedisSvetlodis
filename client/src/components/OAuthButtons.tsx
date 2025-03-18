"use client"
import { Button } from "@heroui/react"
import { signIn } from "next-auth/react"
import React from "react"
import { GitHub, Gitlab } from "react-feather"

interface OAuthButtonsProps {}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({}) => {
    return (
        <>
            <Button
                className="w-full"
                variant="bordered"
                onPress={() => {
                    signIn("github")
                }}
            >
                <GitHub />
                Login with GitHub
            </Button>
            <Button
                className="w-full"
                variant="bordered"
                onPress={() => {
                    signIn("gitlab")
                }}
            >
                <Gitlab />
                Login with GitLab
            </Button>
        </>
    )
}

export default OAuthButtons
