//CharacterStateProvider.tsx
"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { PublicKey } from "@solana/web3.js"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { program, CharacterMetadata } from "@/utils/anchor"

type CharacterStateContextType = {
    characterDataPDA: PublicKey | null
    character: CharacterMetadata | null
}

const CharacterStateContext = createContext<CharacterStateContextType>({
    characterDataPDA: null,
    character: null,
})

export const useCharacterState = () => useContext(CharacterStateContext)

const CharacterStateProvider = ({ children }: { children: React.ReactNode }) => {
    const { publicKey } = useWallet()
    const { connection } = useConnection()

    const [characterDataPDA, setCharacterDataPDA] = useState<PublicKey | null>(null)
    const [character, setCharacter] = useState<CharacterMetadata | null>(null)

    useEffect(() => {
        if (!publicKey) return

        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("character"), publicKey.toBuffer()],
            program.programId
        )
        setCharacterDataPDA(pda)


        // @ts-ignore
        program.account.characterMetadata
            .fetch(pda)
            .then((data) => {
                setCharacter(data)
            })
            .catch((_) => {
                console.warn("No character data found. Mint a character first.")
            })

        const subId = connection.onAccountChange(pda, (acc) => {
            const decoded = program.coder.accounts.decode("CharacterMetadata", acc.data)
            setCharacter(decoded)
        })

        return () => {
            connection.removeAccountChangeListener(subId)
        }
    }, [publicKey])

    return (
        <CharacterStateContext.Provider value={{ characterDataPDA, character }}>
            {children}
        </CharacterStateContext.Provider>
    )
}

export default CharacterStateProvider;
