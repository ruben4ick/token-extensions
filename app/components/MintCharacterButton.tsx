//MintCharacterButton.tsx
"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { Button } from "@chakra-ui/react"
import { Keypair, SystemProgram, PublicKey } from "@solana/web3.js"
import { TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddressSync, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { useCallback, useState } from "react"
import { web3 } from "@coral-xyz/anchor"
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
            const mint = new Keypair();
            const tokenAccount = getAssociatedTokenAddressSync(
                mint.publicKey,
                publicKey,
                false,
                TOKEN_2022_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            )

            // const metadataPDA = PublicKey.findProgramAddressSync(
            //     [Buffer.from("character"), publicKey.toBuffer()],
            //     program.programId
            // )[0]

            const nftAuthority = PublicKey.findProgramAddressSync(
                [Buffer.from("nft_authority")],
                program.programId
            );

            const tx = await program.methods
                .mintCharacter("Ryu", "Warrior", "Katana")
                .accounts({
                    payer: publicKey,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_2022_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    rent: web3.SYSVAR_RENT_PUBKEY,
                    mint: mint.publicKey,
                    tokenAccount,
                    nftAuthority: nftAuthority[0],
                })
                .signers([mint])
                .transaction()


            console.log("Transaction Parameters:", {
                method: "mintCharacter",
                args: ["Ryu", "Warrior", "Katana"],
                accounts: {
                    payer: publicKey.toBase58(),
                    systemProgram: SystemProgram.programId.toBase58(),
                    tokenProgram: TOKEN_2022_PROGRAM_ID.toBase58(),
                    tokenAccount: tokenAccount.toBase58(),
                    mint: mint.publicKey.toBase58(),
                    // metadataAccount: metadataPDA.toBase58(),
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID.toBase58(),
                    rent: web3.SYSVAR_RENT_PUBKEY.toBase58(),
                    nftAuthority: nftAuthority[0],
                },
            })

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
