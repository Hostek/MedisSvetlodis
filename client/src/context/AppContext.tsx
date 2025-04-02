import { useIsAuth } from "@/hooks/isAuth"
import React, { PropsWithChildren, useContext } from "react"

interface AppContextInterface {
    user: ReturnType<typeof useIsAuth>["user"]
}

const AppContext = React.createContext<AppContextInterface>({ user: undefined })

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { user } = useIsAuth()

    const value: AppContextInterface = { user }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
    return useContext(AppContext)
}
