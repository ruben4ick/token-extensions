'use client'

import { Box, Flex, Heading, Spacer, VStack, Text } from "@chakra-ui/react"
import WalletMultiButton from "@/components/WalletMultiButton"
import MintCharacterButton from "@/components/MintCharacterButton"
import CompleteMissionButton from "@/components/CompleteMissionButton"


export default function Home() {
    return (
        <Box>
            <Flex px={4} py={4}>
                <Spacer />
                <WalletMultiButton />
            </Flex>
            <VStack>
                <Heading>ExtensionNft</Heading>
                <MintCharacterButton />
                <CompleteMissionButton />
            </VStack>
        </Box>
    )
}
