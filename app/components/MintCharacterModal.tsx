"use client"

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    useDisclosure,
    Image,
    Box,
    Flex,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import {
    PublicKey,
    SystemProgram,
    Keypair,
} from "@solana/web3.js"
import {
    TOKEN_2022_PROGRAM_ID,
    getAssociatedTokenAddressSync,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token"
import { web3 } from "@coral-xyz/anchor"
import { program } from "@/utils/anchor"

const MintCharacterModal = () => {
    const { publicKey, sendTransaction } = useWallet()
    const { connection } = useConnection()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [name, setName] = useState("")
    const [classType, setClassType] = useState("warrior")
    const [weapon, setWeapon] = useState("")
    const [isMinting, setIsMinting] = useState(false)

    const classImage = {
        warrior: "/Warrior.png",
        archer: "/Archer.png",
        mage: "/Mage.png",
    }

    const classDescription = {
        warrior: "Strong melee fighter with high defense.",
        archer: "Agile ranged attacker with fast strikes.",
        mage: "Master of magic with powerful spells.",
    }

    const handleMint = async () => {
        if (!publicKey || !name || !weapon) return
        setIsMinting(true)

        try {
            const mint = new Keypair()
            const tokenAccount = getAssociatedTokenAddressSync(
                mint.publicKey,
                publicKey,
                false,
                TOKEN_2022_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            )

            const [metadataPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("character"), publicKey.toBuffer()],
                program.programId
            )

            const [nftAuthority] = PublicKey.findProgramAddressSync(
                [Buffer.from("nft_authority")],
                program.programId
            )

            const tx = await program.methods
                .mintCharacter(name, classType, weapon)
                .accounts({
                    payer: publicKey,
                    mint: mint.publicKey,
                    tokenAccount,
                    metadataAccount: metadataPDA,
                    nftAuthority,
                    tokenProgram: TOKEN_2022_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                    rent: web3.SYSVAR_RENT_PUBKEY,
                })
                .signers([mint])
                .transaction()

            const txSig = await sendTransaction(tx, connection, {
                signers: [mint],
                skipPreflight: true,
            })

            console.log("Minted! Tx:", `https://explorer.solana.com/tx/${txSig}?cluster=devnet`)
            onClose()
        } catch (e) {
            console.error("Mint failed", e)
        } finally {
            setIsMinting(false)
        }
    }

    return (
        <>
            <Button colorScheme="teal" onClick={onOpen}>
                Mint New Character
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Your Character</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex gap={6}>
                            {/* LEFT SIDE: Form + description */}
                            <VStack flex="1" spacing={4} align="stretch">
                                <Input
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Select
                                    value={classType}
                                    onChange={(e) => setClassType(e.target.value)}
                                >
                                    <option value="Warrior">Warrior</option>
                                    <option value="Archer">Archer</option>
                                    <option value="Mage">Mage</option>
                                </Select>
                                <Input
                                    placeholder="Weapon"
                                    value={weapon}
                                    onChange={(e) => setWeapon(e.target.value)}
                                />
                                <Box fontSize="sm" color="gray.600" mt={2}>
                                    {classDescription[classType as keyof typeof classDescription]}
                                </Box>
                            </VStack>

                            {/* RIGHT SIDE: Image */}
                            <Box flexShrink={0}>
                                <Image
                                    src={classImage[classType as keyof typeof classImage]}
                                    alt={`${classType} preview`}
                                    boxSize="200px"
                                    objectFit="contain"
                                    borderRadius="md"
                                    border="1px solid #ccc"
                                />
                            </Box>
                        </Flex>
                    </ModalBody>


                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={handleMint}
                            isLoading={isMinting}
                            isDisabled={!name || !weapon}
                        >
                            Mint
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default MintCharacterModal
