# To fully test the NFT functionality, you need to deploy the on-chain program to Solana devnet using Anchor.

This will start the frontend at http://localhost:3000.
```
# Installs the dependencies
yarn install

# Start the development server
yarn dev
```

Set up your wallet and Solana CLI
```
solana config set --url https://api.devnet.solana.com
solana-keygen new --outfile ./target/deploy/keypair.json
solana airdrop 5
```

Deploying the Program to Devnet (Anchor)
```
# Build the program
anchor build

# Deploy the program to devnet
anchor deploy --provider.cluster devnet
```
Anchor will print an address. Copy it to 'app/idl/nft_extensions.ts' and 'app/idl/nft_extensions.json'
