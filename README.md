# BlockLotto

Decentralized lottery on Stacks blockchain

## Deployment

### Frontend
Deployed on Vercel: [blocklotto.vercel.app](https://blocklotto.vercel.app)

### Smart Contract
- **Mainnet**: `SP30VGN68PSGVWGNMD0HH2WQMM5T486EK3YGPFZ3Y.block-lotto`
- **Explorer**: [View on Explorer](https://explorer.hiro.so/txid/7f958d3247d0beb6ccbe1d6a0929d36f85c8df19a7ea2e2c9f970ec9e216ab85?chain=mainnet)

## Features
- Enter lottery with 1 STX
- Minimum 2 participants required
- Provably fair random winner selection using block headers
- Pull-payment security pattern
- Admin pause/unpause controls
- Automatic refunds if minimum not met

## Development

### Contract
```bash
clarinet check
clarinet test
```

### Deployment
```bash
node deploy-mainnet.js     # Deploy to mainnet
node initialize-mainnet.js # Initialize lottery
```

### Frontend
```bash
cd web
npm install
npm run dev
```

## License
MIT
