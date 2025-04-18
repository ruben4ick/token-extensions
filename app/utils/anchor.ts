//anchor.ts

import { BN, type IdlAccounts, Program } from '@coral-xyz/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { type NftExtensions, IDL } from '../idl/nft_extensions';
import { WrappedConnection } from './wrappedConnection';
import { AnchorProvider } from '@coral-xyz/anchor';

export const CONNECTION = new WrappedConnection(process.env.NEXT_PUBLIC_RPC ? process.env.NEXT_PUBLIC_RPC : 'https://rpc.magicblock.app/devnet', {
    wsEndpoint: process.env.NEXT_PUBLIC_WSS_RPC ? process.env.NEXT_PUBLIC_WSS_RPC : 'wss://rpc.magicblock.app/devnet',
    commitment: 'confirmed',
});

export const METAPLEX_READAPI = `https://devnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`;

const provider = new AnchorProvider(CONNECTION, null as any, AnchorProvider.defaultOptions());
export const program = new Program(IDL, provider);
