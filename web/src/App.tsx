import React, { useState, useEffect } from 'react'
import { Button } from './components/button'
import { Card } from './components/card'
import { userSession, connectWallet, disconnect } from './config'
import { 
  openContractCall,
  openContractDeploy,
} from '@stacks/connect'
import { StacksTestnet } from '@stacks/network'
import {
  uintCV,
  callReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
  PostConditionMode,
} from '@stacks/transactions'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'ST30VGN68PSGVWGNMD0HH2WQMM5T486EK3WBNTHCY'
const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME || 'block-lotto'
const network = new StacksTestnet()

export default function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string>('')
  const [status, setStatus] = useState<string>('Loading...')
  const [targetBlock, setTargetBlock] = useState<number>(0)
  const [totalParticipants, setTotalParticipants] = useState<number>(0)
  const [winner, setWinner] = useState<string | null>(null)
  const [paused, setPaused] = useState<boolean>(false)

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setIsConnected(true)
      const userData = userSession.loadUserData()
      setAddress(userData.profile.stxAddress.testnet)
      loadLotteryInfo()
    }
  }, [])

  const loadLotteryInfo = async () => {
    try {
      const result = await callReadOnlyFunction({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-lottery-info',
        functionArgs: [],
        senderAddress: CONTRACT_ADDRESS,
      })
      
      const data = cvToJSON(result).value.value
      setStatus(getStatusText(data.status.value))
      setTargetBlock(parseInt(data['target-block-height'].value))
      setTotalParticipants(parseInt(data['total-participants'].value))
      setPaused(data.paused.value)
      
      if (data.winner.value) {
        setWinner(data.winner.value.value)
      }
    } catch (error) {
      console.error('Error loading lottery info:', error)
      setStatus('Error loading lottery info')
    }
  }

  const getStatusText = (statusCode: string) => {
    const codes: Record<string, string> = {
      '0': 'Open',
      '1': 'Ready to Draw',
      '2': 'Completed',
      '3': 'Refunded'
    }
    return codes[statusCode] || 'Unknown'
  }

  const handleEnter = () => {
    if (!isConnected) {
      connectWallet()
      return
    }

    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'enter-lottery',
      functionArgs: [],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log('Transaction:', data.txId)
        setTimeout(loadLotteryInfo, 2000)
      }
    })
  }

  const handleDraw = () => {
    if (!isConnected) {
      connectWallet()
      return
    }

    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'draw-winner',
      functionArgs: [],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log('Transaction:', data.txId)
        setTimeout(loadLotteryInfo, 2000)
      }
    })
  }

  const handleClaim = () => {
    if (!isConnected) {
      connectWallet()
      return
    }

    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'claim-prize',
      functionArgs: [],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log('Transaction:', data.txId)
        setTimeout(loadLotteryInfo, 2000)
      }
    })
  }

  const handleRefund = () => {
    if (!isConnected) {
      connectWallet()
      return
    }

    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'refund',
      functionArgs: [],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log('Transaction:', data.txId)
        setTimeout(loadLotteryInfo, 2000)
      }
    })
  }

  const handlePause = () => {
    if (!isConnected) {
      connectWallet()
      return
    }

    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'pause',
      functionArgs: [],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log('Transaction:', data.txId)
        setTimeout(loadLotteryInfo, 2000)
      }
    })
  }

  const handleUnpause = () => {
    if (!isConnected) {
      connectWallet()
      return
    }

    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'unpause',
      functionArgs: [],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log('Transaction:', data.txId)
        setTimeout(loadLotteryInfo, 2000)
      }
    })
  }

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans" style={{ background: '#000' }}>
      <header className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">BlockLotto</h1>
          <p className="text-sm md:text-base text-gray-400">Decentralized lottery on Stacks</p>
        </div>
        {isConnected ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{address.slice(0, 6)}...{address.slice(-4)}</span>
            <Button onClick={disconnect}>Disconnect</Button>
          </div>
        ) : (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )}
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <section className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card title="Lottery Status">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="text-lg md:text-2xl break-words">Status: <span className="font-mono">{status}</span></div>
                <div className="text-xs md:text-sm text-gray-400">Target block: {targetBlock}</div>
                <div className="text-xs md:text-sm text-gray-400">Participants: {totalParticipants}</div>
                <div className="text-xs md:text-sm text-gray-400">Paused: {paused ? 'Yes' : 'No'}</div>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <Button onClick={handleEnter} className="w-full md:w-auto">Enter Lottery (10 STX)</Button>
                <Button onClick={handleDraw} className="w-full md:w-auto">Draw Winner</Button>
                <Button onClick={handleClaim} className="w-full md:w-auto">Claim Prize</Button>
                <Button onClick={handleRefund} className="w-full md:w-auto">Refund</Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card title="Participants">
              <ul className="text-xs md:text-sm text-gray-300 max-h-48 overflow-y-auto">
                <li className="text-gray-500">Total: {totalParticipants}</li>
              </ul>
            </Card>

            <Card title="Winner">
              <div className="text-sm md:text-base break-all">{winner ?? 'No winner yet'}</div>
            </Card>
          </div>
        </section>

        <aside className="space-y-4 md:space-y-6">
          <Card title="Admin">
            <div className="flex flex-col gap-2">
              <Button onClick={handlePause} className="w-full">Pause</Button>
              <Button onClick={handleUnpause} className="w-full">Unpause</Button>
            </div>
          </Card>

          <Card title="Theme Preview" className="hidden md:block">
            <div className="mt-4 bg-black border border-gray-700 h-32 flex items-center justify-center"> 
              <div className="text-xs md:text-sm text-gray-400 text-center px-2">Theme: Dark Minimal</div>
            </div>
          </Card>
        </aside>
      </main>

      <footer className="mt-8 md:mt-12 text-xs md:text-sm text-gray-500 break-all">
        Contract: {CONTRACT_ADDRESS}.{CONTRACT_NAME}
      </footer>
    </div>
  )
}
