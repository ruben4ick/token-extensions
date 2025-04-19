//CompleteMissionButton.tsx
"use client"
import Image from "next/image"
import { useCallback, useState } from "react"
import { Button, HStack, VStack } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useSessionWallet } from "@magicblock-labs/gum-react-sdk"
import { useCharacterState } from "@/contexts/CharacterStateProvider";
import { useNftState } from "@/contexts/NftProvider"
import { program } from "@/utils/anchor"
import { PublicKey } from "@solana/web3.js"
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token"

const CompleteMissionButton = () => {
    const { publicKey, sendTransaction } = useWallet()
    const { connection } = useConnection()
    const sessionWallet = useSessionWallet()
    const { nftState } = useNftState()
    const { characterDataPDA } = useCharacterState();
    const [isLoadingSession, setIsLoadingSession] = useState(false)
    const [isLoadingMainWallet, setIsLoadingMainWallet] = useState(false)
    const XP_GAIN = 5

    const getNftCharacter = async () => {
        const [nftAuthority] = await PublicKey.findProgramAddress(
            [Buffer.from("nft_authority")],
            program.programId
        )
        return nftState.items.find(
            (nft) => nft.authorities[0]?.address === nftAuthority.toBase58()
        )
    }

    const handleCompleteMission = useCallback(
        async (isSession: boolean) => {
            if (!characterDataPDA) return

            const nft = await getNftCharacter()
            if (!nft) {
                window.alert("Mint your NFT character first")
                return
            }

            const [nftAuthority] = await PublicKey.findProgramAddress(
                [Buffer.from("nft_authority")],
                program.programId
            )

            try {
                if (isSession && sessionWallet) {
                    setIsLoadingSession(true)

                    const tx = await program.methods
                        .completeMission(XP_GAIN)
                        .accounts({
                            character: characterDataPDA,
                            signer: sessionWallet.publicKey!,
                            mint: nft.id,
                            nftAuthority,
                            systemProgram: PublicKey.default,
                            tokenProgram: TOKEN_2022_PROGRAM_ID,
                        })
                        .transaction()

                    const txids = await sessionWallet.signAndSendTransaction!(tx)
                    console.log("Mission transaction (session):", txids)
                } else if (publicKey) {
                    setIsLoadingMainWallet(true)

                    const tx = await program.methods
                        .completeMission(XP_GAIN)
                        .accounts({
                            character: characterDataPDA,
                            signer: publicKey,
                            mint: nft.id,
                            nftAuthority,
                            systemProgram: PublicKey.default,
                            tokenProgram: TOKEN_2022_PROGRAM_ID,
                        })
                        .transaction()

                    const txid = await sendTransaction(tx, connection, { skipPreflight: true })
                    console.log(`Mission TX: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
                }
            } catch (err) {
                console.error("Mission failed:", err)
            } finally {
                setIsLoadingSession(false)
                setIsLoadingMainWallet(false)
            }
        },
        [publicKey, sessionWallet, connection, characterDataPDA, nftState]
    )

    return (
        <>
            {publicKey && (
                <VStack>
                    <Image src="/Mission.png" alt="Mission Icon" width={64} height={64} />
                    <HStack>
                        {sessionWallet && sessionWallet.sessionToken && (
                            <Button isLoading={isLoadingSession} onClick={() => handleCompleteMission(true)}>
                                Complete Mission (Session)
                            </Button>
                        )}
                        <Button isLoading={isLoadingMainWallet} onClick={() => handleCompleteMission(false)}>
                            Complete Mission (MainWallet)
                        </Button>
                    </HStack>
                </VStack>
            )}
        </>
    )
}

export default CompleteMissionButton
