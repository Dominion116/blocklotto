# BlockLotto

Decentralized lottery on Stacks blockchain

## Deployment

### Frontend
Deployed on Vercel: [blocklotto.vercel.app](https://blocklotto.vercel.app)

### Smart Contract
- **Testnet**: `ST30VGN68PSGVWGNMD0HH2WQMM5T486EK3WBNTHCY.block-lotto`
- **Explorer**: [View on Explorer](https://explorer.hiro.so/txid/e05710bf7471b4762cdd90487082c0d349760e345479bbbb9bc2c0c77e608135?chain=testnet)

## Features
- Enter lottery with 10 STX
- Minimum 3 participants required
- Provably fair random winner selection using block headers
- Pull-payment security pattern
- Admin pause/unpause controls
- Automatic refunds if minimum not met

## Development

### Contract
```bash
clarinet check
clarinet test
npm run deploy
npm run init
```

### Frontend
```bash
cd web
npm install
npm run dev
```

## License
MIT
