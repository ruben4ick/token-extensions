/*
import { useCallback, useState } from "react"
import { Button, VStack, HStack } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useAnchor } from "../utils/anchor"
import { PublicKey } from "@solana/web3.js"
import { useSessionWallet } from "@magicblock-labs/gum-react-sdk"
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token"
import { useNftState } from "@/contexts/NftProvider"

const CompleteMissionButton = () => {
    const { publicKey, sendTransaction } = useWallet()
    const { connection } = useConnection()
    const { program } = useAnchor()
    const sessionWallet = useSessionWallet()
    const { nftState } = useNftState()

    const [loadingSession, setLoadingSession] = useState(false)
    const [loadingWallet, setLoadingWallet] = useState(false)

    const getNftAuthorityPDA = async () => {
        return PublicKey.findProgramAddressSync(
            [Buffer.from("nft_authority")],
            program.programId
        )[0]
    }

    const findNft = async (nftAuthority: PublicKey) => {
        return nftState.items.find(
            (nft: any) =>
                nft.authorities[0]?.address === nftAuthority.toBase58()
        )
    }

    const sendCompleteMissionTx = async ({
                                             signer,
                                             sessionToken = null,
                                             mint,
                                         }: {
        signer: PublicKey
        sessionToken?: string | null
        mint: PublicKey
    }) => {
        const nftAuthority = await getNftAuthorityPDA()

        const metadataAccount = PublicKey.findProgramAddressSync(
            [Buffer.from("character"), signer.toBuffer()],
            program.programId
        )[0]

        const tx = await program.methods
            .completeMission()
            .accounts({
                metadataAccount,
                authority: signer,
                mint,
                nftAuthority,
                tokenProgram: TOKEN_2022_PROGRAM_ID,
                sessionToken,
            })
            .transaction()

        return tx
    }

    const onCompleteWithSession = useCallback(async () => {
        if (!sessionWallet || !sessionWallet.sessionToken) return
        setLoadingSession(true)

        try {
            const nftAuthority = await getNftAuthorityPDA()
            const nft = await findNft(nftAuthority)
            if (!nft) return alert("❌ NFT not found!")

            const tx = await sendCompleteMissionTx({
                signer: sessionWallet.publicKey!,
                sessionToken: sessionWallet.sessionToken,
                mint: new PublicKey(nft.id),
            })

            const txids = await sessionWallet.signAndSendTransaction!(tx)
            console.log("✅ Session Tx sent:", txids)
        } catch (e) {
            console.error("❌ Session tx error:", e)
        } finally {
            setLoadingSession(false)
        }
    }, [sessionWallet, nftState])

    const onCompleteWithWallet = useCallback(async () => {
        if (!publicKey) return
        setLoadingWallet(true)

        try {
            const nftAuthority = await getNftAuthorityPDA()
            const nft = await findNft(nftAuthority)
            if (!nft) return alert("❌ NFT not found!")

            const tx = await sendCompleteMissionTx({
                signer: publicKey,
                mint: new PublicKey(nft.id),
            })

            const sig = await sendTransaction(tx, connection)
            console.log("✅ Wallet Tx:", sig)
        } catch (e) {
            console.error("❌ Wallet tx error:", e)
        } finally {
            setLoadingWallet(false)
        }
    }, [publicKey, connection, nftState])

    return (
        <>
            {program && (
                <VStack>
                    <HStack>
                        {sessionWallet?.sessionToken && (
                            <Button
                                onClick={onCompleteWithSession}
                                loading={loadingSession}
                                colorScheme="orange"
                            >
                                Complete Mission (Session)
                            </Button>
                        )}
                        {publicKey && (
                            <Button
                                onClick={onCompleteWithWallet}
                                loading={loadingWallet}
                                colorScheme="orange"
                            >
                                Complete Mission (Wallet)
                            </Button>
                        )}
                    </HStack>
                </VStack>
            )}
        </>
    )
}

export default CompleteMissionButton
*/
