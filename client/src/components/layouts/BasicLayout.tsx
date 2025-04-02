"use client"
import { AppProvider } from "@/context/AppContext"
import React, { PropsWithChildren } from "react"
import BasicNavbar from "../BasicNavbar"

interface BasicLayoutProps extends PropsWithChildren {}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
    return (
        <AppProvider>
            <BasicNavbar />
            <main>{children}</main>
        </AppProvider>
    )
}

export default BasicLayout
