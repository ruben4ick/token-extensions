"use client"

import {Heading, VStack, Box, Text, Spacer, Flex, Image, Skeleton, Progress} from "@chakra-ui/react"
import MintCharacterModal from "@/components/MintCharacterModal"
import CompleteMissionButton from "@/components/CompleteMissionButton"
import { useCharacterState } from "@/contexts/CharacterStateProvider"
import { useNftState } from "@/contexts/NftProvider"
import WalletMultiButton from "@/components/WalletMultiButton";

export default function Home() {
    const { character } = useCharacterState()
    const { nftState } = useNftState()

    const nft = nftState?.items?.[0]

    return (
        <Box>
        <Flex px={4} py={4}>
            <Spacer />
            <WalletMultiButton />
        </Flex>
            <VStack spacing={6} p={6}>
                <Heading>Token Extensions</Heading>
                <MintCharacterModal />

                {character && nft ? (
                    <Box
                        mt={8}
                        p={4}
                        border="1px solid #ccc"
                        borderRadius="md"
                        w="100%"
                        maxW="400px"
                        textAlign="center"
                    >
                        <Image
                            src={nft.content?.links?.image}
                            alt={character.name}
                            borderRadius="md"
                            boxSize="200px"
                            objectFit="cover"
                            mx="auto"
                            mb={4}
                        />

                        <Text fontWeight="bold" fontSize="xl" mb={2}>{character.name}</Text>
                        <Text><strong>Class:</strong> {character.class}</Text>
                        <Text><strong>Weapon:</strong> {character.weapon}</Text>
                        <Text><strong>Level:</strong> {character.level.toString()}</Text>
                        {typeof character.xp !== "undefined" && (
                            <>
                                <Text mt={2}>XP: {character.xp} / {character.level * 10}</Text>
                                <Progress
                                    value={character.xp}
                                    max={character.level * 10}
                                    size="sm"
                                    colorScheme="green"
                                    borderRadius="md"
                                />
                            </>
                        )}
                    </Box>
                ) : (
                    <Skeleton height="300px" width="400px" />
                )}

                <CompleteMissionButton />
            </VStack>
        </Box>
    )
}
