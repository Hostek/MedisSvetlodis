"use client"
import { useIconContext } from "@/context/IconContext"
import React from "react"
import IconSvgWrapper from "./IconSvgWrapper"
import { SvgWrapperOptions } from "@/types"

interface UnblockIconProps extends SvgWrapperOptions {}

/*

Source: https://www.svgrepo.com/svg/488804/block

LICENSE: PD License
AUTHOR: Gabriele Malaspina

*/

const UnblockIcon: React.FC<UnblockIconProps> = ({ ...props }) => {
    const {} = useIconContext()

    return (
        <IconSvgWrapper
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            options={props}
        >
            <defs>
                <mask id="aaaa">
                    <path fill="#fff" d="M0 0h24v24H0z" />
                    <path fill="#000" d="m12.6 6.7 6 6-6 5.8-5.8-5.9z" />
                </mask>
            </defs>
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.4 5.6A9 9 0 0 1 12 21a9 9 0 0 1-6.4-2.6M18.4 5.6A9 9 0 0 0 3 12a9 9 0 0 0 2.6 6.4M18.4 5.6 5.6 18.4"
                mask="url(#aaaa)"
            />
        </IconSvgWrapper>
    )
}

export default React.memo(UnblockIcon)
