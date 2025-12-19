# BlockLotto - Mainnet Deployment Guide

## Updated Contract Parameters
- **Entry Fee**: 1 STX (reduced from 10 STX)
- **Minimum Players**: 2 (reduced from 3)
- **Maximum Participants**: 100

## Prerequisites

1. **Mainnet STX Wallet**: You need a wallet with at least 2-3 STX for deployment fees
2. **24-word Mnemonic**: Your mainnet wallet's recovery phrase

## Deployment Steps

### Step 1: Add Your Mainnet Mnemonic

Edit `.env` file and replace `your-mainnet-24-word-mnemonic-here` with your actual 24-word mnemonic:

```bash
STACKS_MAINNET_MNEMONIC="word1 word2 word3 ... word24"
```

**⚠️ SECURITY WARNING**: Never commit `.env` to git! It's already in `.gitignore`.

### Step 2: Deploy the Contract

```bash
node deploy-mainnet.js
```

This will:
- Deploy the contract to Stacks mainnet
- Cost approximately 0.3-0.5 STX in fees
- Give you a 5-second countdown to cancel
- Show the transaction ID and contract address

**Wait 10-20 minutes for the deployment to confirm** before proceeding to Step 3.

### Step 3: Initialize the Lottery

After deployment confirms:

```bash
node initialize-mainnet.js
```

This will:
- Set the target block to current + 100 blocks (~100 minutes)
- Initialize the lottery contract
- Cost a small transaction fee (~0.01 STX)

### Step 4: Update Frontend for Mainnet

Edit `web/.env`:

```bash
VITE_CONTRACT_ADDRESS=YOUR_MAINNET_ADDRESS  # From deploy output
VITE_CONTRACT_NAME=block-lotto
VITE_NETWORK=mainnet
```

Update `web/src/App.tsx` line ~60 to use mainnet:

```typescript
import { StacksMainnet } from '@stacks/network'
const network = new StacksMainnet()
```

### Step 5: Build and Deploy Frontend

```bash
cd web
npm run build
```

Deploy the `web/dist` folder to Vercel/Netlify/your hosting provider.

## Verification

Check your deployment on Stacks Explorer:
- **Mainnet Explorer**: https://explorer.hiro.so/?chain=mainnet
- **Your Contract**: https://explorer.hiro.so/address/YOUR_ADDRESS?chain=mainnet

## Cost Summary

- Contract Deployment: ~0.3-0.5 STX
- Initialization: ~0.01 STX
- **Total**: ~0.5 STX

## Testing on Testnet First (Recommended)

Before mainnet deployment, test on testnet:

```bash
node deploy.js        # Deploy to testnet
node initialize.js    # Initialize on testnet
```

Then test the full lottery flow before deploying to mainnet.

## Support

If deployment fails, check:
1. You have enough STX in your mainnet wallet
2. The mnemonic in `.env` is correct (24 words)
3. The contract compiles: `clarinet check`
4. Transaction status on the explorer

## Contract Features

- **Entry Fee**: 1 STX per entry
- **Minimum Players**: 2 required to draw
- **Provably Fair**: Uses block hash for randomness
- **Secure**: Pull-payment pattern for prize claims
- **Admin Controls**: Pause/unpause functionality
