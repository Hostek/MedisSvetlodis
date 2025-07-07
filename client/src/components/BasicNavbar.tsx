"use client"
import { useAppContext } from "@/context/AppContext"
import { Navbar, NavbarContent, NavbarItem } from "@heroui/react"
import Link from "next/link"
import React from "react"
import { Settings } from "react-feather"

interface BasicNavbarProps {}

const BasicNavbar: React.FC<BasicNavbarProps> = ({}) => {
    const { user } = useAppContext()

    if (!user) {
        return null
    }

    return (
        <Navbar className="flex justify-center items-center mb-4">
            <NavbarContent className="text-foreground">
                <NavbarItem className="mr-6">
                    <Link href="/" className="font-bold text-3xl">
                        MEDIS SVETLODIS
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <span className="font-medium">User: </span>
                    {user.username}
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Link href="/user/settings" aria-label="Settings">
                        <div aria-hidden>
                            <Settings />
                        </div>
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/logout">Logout</Link>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default BasicNavbar
