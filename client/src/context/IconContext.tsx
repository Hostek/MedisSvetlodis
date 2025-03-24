import { ReactIconProps } from "@/types"
import React, { PropsWithChildren, useContext } from "react"

interface IconContextInterface extends ReactIconProps {}

const IconContext = React.createContext<IconContextInterface>({})

export const IconProvider: React.FC<
    IconContextInterface & PropsWithChildren
> = ({ children, ...props }) => {
    const value: IconContextInterface = { ...props }

    return <IconContext.Provider value={value}>{children}</IconContext.Provider>
}

export function useIconContext() {
    return useContext(IconContext)
}
