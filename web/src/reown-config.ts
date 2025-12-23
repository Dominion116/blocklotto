import { createAppKit } from '@reown/appkit'
import { QueryClient } from '@tanstack/react-query'

// 1. Get projectId from https://cloud.reown.com
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

// 2. Define Stacks networks
const stacksTestnet = {
  id: 'stacks:2147483648',
  chainId: 2147483648,
  name: 'Stacks Testnet',
  currency: 'STX',
  explorerUrl: 'https://explorer.hiro.so',
  rpcUrl: 'https://api.testnet.hiro.so'
}

const stacksMainnet = {
  id: 'stacks:1',
  chainId: 1,
  name: 'Stacks Mainnet',
  currency: 'STX',
  explorerUrl: 'https://explorer.hiro.so',
  rpcUrl: 'https://api.mainnet.hiro.so'
}

const networks = [stacksTestnet, stacksMainnet]

// 3. Create modal
export const modal = createAppKit({
  networks,
  projectId,
  features: {
    analytics: false
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#000000',
    '--w3m-accent': '#4F46E5'
  }
})

export const queryClient = new QueryClient()
