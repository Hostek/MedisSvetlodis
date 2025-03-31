"use client"
import { useIconContext } from "@/context/IconContext"
import React from "react"
import IconSvgWrapper from "./IconSvgWrapper"
import { SvgWrapperOptions } from "@/types"

interface QrCodeIconProps extends SvgWrapperOptions {}

/*

Source: https://www.svgrepo.com/svg/490299/qr-code

LICENSE: PD License
AUTHOR: IonutNeagu

*/

const QrCodeIcon: React.FC<QrCodeIconProps> = ({ ...props }) => {
    const {} = useIconContext()

    return (
        <IconSvgWrapper
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            viewBox="0 -0.1 122.9 122.9"
            options={props}
        >
            <path
                fillRule="evenodd"
                d="M.2 0h44.6v44.5H.2V0zm111.3 111.5h11.4v11.2h-11.4v-11.2zm-21.9 0H101v10.7H78.3v-21.9h11v-11h11.2v-22h11.4V78h10.8v11.2h-10.8v11.2H89.6v11zM55.8 89h11V77.9H56.3V66.7h10.7V55.5H56v11.2H44.6V55.5h11.2V22.2h11.4v33.3h11v11.2h10.9V55.5h11.3v11.2H89.6v11.2H78.3v22h-11v22.3H55.7V89zm55.5-33.6h11.4v11.2h-11.4V55.5zm-88.9 0h11.4v11.2H22.4V55.5zm-22.2 0h11.4v11.2H.2V55.5zM55.8 0h11.4v11.2H55.8V0zM0 78h44.6v44.5H0V78.1zM10.8 89h23v22.8h-23V89zM78.1 0h44.6v44.5H78V0zm10.8 10.8h23v22.9h-23V10.8zm-77.9 0h23v22.9H11V10.8z"
                clipRule="evenodd"
            />
        </IconSvgWrapper>
    )
}

export default React.memo(QrCodeIcon)
