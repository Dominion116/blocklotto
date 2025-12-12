# BlockLotto Frontend

This is a minimal Vite + React frontend for the `block-lotto` Clarity contract.

Features:
- Enter lottery (opens Hiro Wallet to call `enter-lottery`)
- Draw winner
- Claim prize
- Refund
- Admin pause/unpause

Note: The UI uses `@stacks/connect` to open transactions in the Hiro Wallet extension. Make sure you have a compatible wallet installed.

 Environment
 
 The frontend calls the contract's read-only functions directly using `@stacks/transactions`.
 Ensure you set your `.env` with `VITE_CONTRACT_ADDRESS` and `VITE_CONTRACT_NAME` before running.

```bash
cd web
npm install
npm run dev
```

Environment

Copy `.env.example` to `.env` and set `VITE_CONTRACT_ADDRESS` to your deployed contract address and `VITE_CONTRACT_NAME` if you used a different name.

Network

By default this UI expects the wallet to be connected to a Stacks network (testnet or mainnet) via Hiro Wallet. Adjust network settings if needed in `src/App.tsx`.

Design Notes

The UI uses a dark, minimal theme inspired by the provided attachment. Components are simple and styled with Tailwind.
