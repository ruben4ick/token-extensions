//MintCharacterButton.tsx
"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { Button } from "@chakra-ui/react"
import { Keypair, SystemProgram, PublicKey } from "@solana/web3.js"
import { TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddressSync, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { useCallback, useState } from "react"
import { program } from "@/utils/anchor"

const MintCharacterButton = () => {
    const { publicKey, sendTransaction } = useWallet()
    const { connection } = useConnection()
    const [isMinting, setIsMinting] = useState(false)

    const onMint = useCallback(async () => {
        if (!publicKey) {
            console.error("Wallet not connected")
            return
        }

        setIsMinting(true)

        try {
            const mint = Keypair.generate()
            const tokenAccount = getAssociatedTokenAddressSync(
                mint.publicKey,
                publicKey,
                false,
                TOKEN_2022_PROGRAM_ID
            )

            const metadataPDA = PublicKey.findProgramAddressSync(
                [Buffer.from("character"), publicKey.toBuffer()],
                program.programId
            )[0]

            const tx = await program.methods
                .mintCharacter("Ryu", "Warrior", "Katana")
                .accounts({
                    payer: publicKey,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_2022_PROGRAM_ID,
                    tokenAccount: tokenAccount,
                    mint: mint.publicKey,
                    metadataAccount: metadataPDA,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    rent: PublicKey.findProgramAddressSync([], SystemProgram.programId)[0],
                })
                .signers([mint])
                .transaction()

            const txSig = await sendTransaction(tx, connection, {
                signers: [mint],
                skipPreflight: true,
            })

            console.log("Minted! Tx:", `https://explorer.solana.com/tx/${txSig}?cluster=devnet`)
        } catch (e) {
            console.error("Mint failed", e)
        } finally {
            setIsMinting(false)
        }
    }, [publicKey, connection])

    return (
        <Button isLoading={isMinting} onClick={onMint}>
            Mint Character
        </Button>
    )
}

export default MintCharacterButton
