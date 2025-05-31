"use client"
import CircleAvatar from "@/components/ui/CircleAvatar"
import { NextPage } from "next"

const Page: NextPage = () => {
    return (
        <div>
            <CircleAvatar color="blue" letter="W" />
            <CircleAvatar color="green" letter="Z" />
            <CircleAvatar color="red" letter="P" />
            <CircleAvatar color="orange" letter="X" />
        </div>
    )
}

export default Page
