"use client"
import CircleAvatar from "@/components/ui/CircleAvatar"
import { Card, Divider, Link } from "@heroui/react"
import { NextPage } from "next"

const gradientColors = [
    "#FF6B6B", // Soft Red
    "#FFD93D", // Bright Yellow
    "#6BCB77", // Fresh Green
    "#4D96FF", // Cool Blue
    "#FF6F91", // Pinkish Red
    "#845EC2", // Purple
    "#00C9A7", // Teal
    "#FF9671", // Warm Orange
    "#0081CF", // Deep Blue
    "#FFC75F", // Golden Yellow
]

const darkBaseColors = [
    "#5A2E2E", // Dark muted red
    "#4A4A2F", // Olive dark
    "#2F4A3A", // Deep forest green
    "#2F3A4A", // Dark slate blue
    "#4A2F3A", // Dark maroon
    "#3A4A4A", // Teal dark
    "#3A2F4A", // Deep indigo
    "#4A3A2F", // Brown dark
    "#2F4A4A", // Dark cyan
    "#4A4A4A", // Dark gray
]

const diverseDarkColors = [
    "#8B2D2D", // Dark warm red (brick)
    "#994D1E", // Dark burnt orange
    "#7A5230", // Dark golden brown
    "#3B5B45", // Deep forest green
    "#2E4A7A", // Dark steel blue
    "#673B7A", // Dark purple
    "#A04A4A", // Medium dark coral red
    "#6A4A2E", // Dark amber
    "#4A6A6A", // Slate teal
    "#7A4A6A", // Dark magenta
]

const lighterColors = [
    "#C56B6B", // Lighter warm red (brick)
    "#C87A4B", // Lighter burnt orange
    "#B38A57", // Lighter golden brown
    "#699A71", // Lighter forest green
    "#557EB5", // Lighter steel blue
    "#925DB5", // Lighter purple
    "#D07878", // Lighter coral red
    "#A67857", // Lighter amber
    "#699A9A", // Lighter slate teal
    "#A5699A", // Lighter magenta
]

const diverseDarkColors1 = [
    "#8B2D2D", // Dark warm red (brick)
    "#994D1E", // Dark burnt orange
    "#7A5230", // Dark golden brown
    "#3B5B45", // Deep forest green
    "#2E4A7A", // Dark steel blue
    "#673B7A", // Dark purple
    "#A04A4A", // Medium dark coral red
    "#6A4A2E", // Dark amber
    "#7A6A2E", // Dark mustard yellow
    "#4A6A6A", // Slate teal
]

const lighterColors1 = [
    "#C56B6B", // Lighter warm red (brick)
    "#C87A4B", // Lighter burnt orange
    "#B38A57", // Lighter golden brown
    "#699A71", // Lighter forest green
    "#557EB5", // Lighter steel blue
    "#925DB5", // Lighter purple
    "#D07878", // Lighter coral red
    "#A67857", // Lighter amber
    "#C6B14A", // Lighter mustard yellow
    "#699A9A", // Lighter slate teal
]

const letter = "A"

const Page: NextPage = () => {
    return (
        <div>
            <div className="flex items-center justify-center">
                <div className="grid grid-cols-10 auto-rows-auto gap-2 max-w-screen-md">
                    {/* <CircleAvatar color="blue" letter="W" />
                <CircleAvatar color="green" letter="Z" />
                <CircleAvatar color="red" letter="P" />
                <CircleAvatar color="orange" letter="X" />
                <CircleAvatar color="#FF6B6B" letter="X" /> */}
                    {gradientColors.map((c) => (
                        <CircleAvatar color={c} key={c} letter={letter} />
                    ))}
                    {darkBaseColors.map((c) => (
                        <CircleAvatar color={c} key={c} letter={letter} />
                    ))}
                    {diverseDarkColors.map((c) => (
                        <CircleAvatar color={c} key={c} letter={letter} />
                    ))}
                    {lighterColors.map((c) => (
                        <CircleAvatar color={c} key={c} letter={letter} />
                    ))}
                    {diverseDarkColors1.map((c) => (
                        <CircleAvatar color={c} key={c} letter={letter} />
                    ))}
                    {lighterColors1.map((c) => (
                        <CircleAvatar color={c} key={c} letter={letter} />
                    ))}
                </div>
            </div>
            <Divider className="my-10" />
            <div>
                <Link as={Card} href="/" className="p-10" fullWidth>
                    Hello Test
                </Link>

                <div className="my-6" />

                <Card as="a" href="/" className="p-10" fullWidth>
                    Hello Test
                </Card>
            </div>
        </div>
    )
}

export default Page
