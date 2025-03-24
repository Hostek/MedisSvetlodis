"use client"
import { useIconContext } from "@/context/IconContext"
import { SvgWrapperOptions } from "@/types"
import React, { PropsWithChildren } from "react"

interface IconSvgWrapperProps
    extends PropsWithChildren,
        React.SVGProps<SVGSVGElement> {
    options?: SvgWrapperOptions
}

const IconSvgWrapper: React.FC<IconSvgWrapperProps> = ({
    children,
    xmlns: xmlns1,
    viewBox: viewBox1,
    options,
    ...props
}) => {
    const { width, height, viewBox, xmlns, className } = useIconContext()

    return (
        <svg
            width={width}
            height={height}
            className={className ?? ""}
            viewBox={viewBox1 ?? viewBox ?? "0 0 500 500"}
            xmlns={xmlns1 ?? xmlns ?? "http://www.w3.org/2000/svg"}
            onClick={options?.onClick}
            {...props}
        >
            {children}
        </svg>
    )
}

export default IconSvgWrapper
