"use client"

import { ChakraProvider} from "@chakra-ui/react"
import { theme as baseTheme } from "@chakra-ui/theme"
import WalletContextProvider from "@/contexts/WalletContextProvider"
import SessionProvider from "@/contexts/SessionProvider"
import CharacterStateProvider from "@/contexts/CharacterStateProvider"
import { NftProvider } from "@/contexts/NftProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ChakraProvider theme={baseTheme}>
            <WalletContextProvider>
                <SessionProvider>
                    <CharacterStateProvider>
                        <NftProvider>
                            {children}
                        </NftProvider>
                    </CharacterStateProvider>
                </SessionProvider>
            </WalletContextProvider>
        </ChakraProvider>
        </body>
        </html>
    )
}
