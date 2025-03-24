"use client"
import React, { PropsWithChildren } from "react"

interface ErrorProps extends PropsWithChildren {}

const Error: React.FC<ErrorProps> = ({ children }) => {
    return <div className="w-full text-red-500">{children}</div>
}

export default Error
