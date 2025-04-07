"use client"
import BlockIcon from "@/components/icons/BlockIcon"
import QrCodeIcon from "@/components/icons/QrCodeIcon"
import UnblockIcon from "@/components/icons/UnblockIcon"
import { IconProvider } from "@/context/IconContext"
import { SvgWrapperOptions } from "@/types"
import { NextPage } from "next"

export const icons: React.NamedExoticComponent<SvgWrapperOptions>[] = [
    BlockIcon,
    UnblockIcon,
    QrCodeIcon,
]

export const LocalIcons = () => {
    return (
        <>
            {icons.map((Icon, i) => (
                <Icon key={i} />
            ))}
        </>
    )
}

const Page: NextPage = () => {
    return (
        <div style={{ background: "lightblue", color: "brown" }}>
            <IconProvider width={25} height={25}>
                <LocalIcons />
            </IconProvider>
            <hr />
            <IconProvider width={50} height={50}>
                <LocalIcons />
            </IconProvider>
            <hr />
            <IconProvider width={75} height={75}>
                <LocalIcons />
            </IconProvider>
            <hr />
            <IconProvider width={100} height={100}>
                <LocalIcons />
            </IconProvider>
        </div>
    )
}

export default Page
