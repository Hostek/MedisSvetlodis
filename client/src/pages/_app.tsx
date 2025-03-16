import { HeroUIProvider } from "@heroui/react"
import { ThemeProvider } from "next-themes"
import type { AppProps } from "next/app"
import "../styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider defaultTheme="dark">
            <HeroUIProvider>
                <Component {...pageProps} />
            </HeroUIProvider>
        </ThemeProvider>
    )
}
