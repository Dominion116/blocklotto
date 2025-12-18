import { createAppKit } from '@reown/appkit/react'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'

// 1. Get projectId from https://cloud.reown.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

// 2. Create Bitcoin adapter
const bitcoinAdapter = new BitcoinAdapter({
  networks: ['testnet']
})

// 3. Create modal
const metadata = {
  name: 'BlockLotto',
  description: 'Decentralized lottery on Stacks blockchain',
  url: 'https://blocklotto.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

createAppKit({
  adapters: [bitcoinAdapter],
  metadata,
  projectId,
  features: {
    analytics: false
  }
})

export { bitcoinAdapter }
