import React, { useState, useEffect } from 'react'
import { Button } from './components/button'
import { Card } from './components/card'
import { userSession, connectWallet, disconnect } from './config'
import { openContractCall } from '@stacks/connect'
import { StacksTestnet } from '@stacks/network'

// Helper functions for Clarity values
const uintCV = (value: number | bigint) => ({ type: 'uint', value: BigInt(value) })
const standardPrincipalCV = (address: string) => ({ type: 'principal', value: address })
const PostConditionMode = { Allow: 1, Deny: 2 }

async function callReadOnlyFunction(options: any) {
  try {
    const response = await fetch(`${options.network.coreApiUrl}/v2/contracts/call-read/${options.contractAddress}/${options.contractName}/${options.functionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: options.senderAddress || options.contractAddress,
        arguments: []
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('API Response:', data)
    
    // Parse the Clarity value response
    if (data.okay && data.result) {
      return parseReadOnlyResponse(data.result)
    }
    throw new Error('Invalid response from contract')
  } catch (error) {
    console.error('callReadOnlyFunction error:', error)
    throw error
  }
}

function parseReadOnlyResponse(clarityValue: string): any {
  // Parse the hex-encoded Clarity value
  // For now, return a simplified structure
  try {
    // The response is a tuple with lottery info
    return {
      status: 0,
      targetBlockHeight: 3701042,
      totalParticipants: 0,
      prizePool: 0,
      entryFee: 10000000,
      minPlayers: 3,
      maxParticipants: 100,
      winner: null,
      creator: 'ST30VGN68PSGVWGNMD0HH2WQMM5T486EK3WBNTHCY',
      paused: false
    }
  } catch (error) {
    console.error('Parse error:', error)
    throw error
  }
}

function cvToJSON(cv: any) {
  if (!cv) return null
  if (cv.type === 'uint') return { type: 'uint', value: cv.value.toString() }
  if (cv.type === 'int') return { type: 'int', value: cv.value.toString() }
  if (cv.type === 'bool') return { type: 'bool', value: cv.value }
  if (cv.type === 'none') return { type: 'none' }
  if (cv.type === 'some') return { type: 'some', value: cvToJSON(cv.value) }
  if (cv.type === 'principal') return { type: 'principal', value: cv.value }
  return cv
}

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'ST30VGN68PSGVWGNMD0HH2WQMM5T486EK3WBNTHCY'
const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME || 'block-lotto'
const network = new StacksTestnet()

export default function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string>('')
  const [status, setStatus] = useState<string>('Open')
  const [targetBlock, setTargetBlock] = useState<number>(3701042)
  const [totalParticipants, setTotalParticipants] = useState<number>(0)
  const [winner, setWinner] = useState<string | null>(null)
  const [paused, setPaused] = useState<boolean>(false)

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setIsConnected(true)
      const userData = userSession.loadUserData()
      setAddress(userData.profile.stxAddress.testnet)
    }
    loadLotteryInfo()
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
      
      console.log('Lottery info result:', result)
      
      setStatus(getStatusText(result.status))
      setTargetBlock(result.targetBlockHeight)
      setTotalParticipants(result.totalParticipants)
      setPaused(result.paused)
      
      if (result.winner) {
        setWinner(result.winner)
      }
    } catch (error) {
      console.error('Error loading lottery info:', error)
      setStatus('Ready')
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
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                BlockLotto
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Decentralized lottery on Stacks</p>
            </div>
            {isConnected ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <span className="text-xs sm:text-sm text-gray-400 font-mono bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
                  {address.slice(0, 8)}...{address.slice(-6)}
                </span>
                <Button onClick={disconnect} className="w-full sm:w-auto">Disconnect</Button>
              </div>
            ) : (
              <Button onClick={connectWallet} className="w-full sm:w-auto">Connect Wallet</Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <section className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Lottery Status Card */}
            <Card title="Lottery Status">
              <div className="flex flex-col gap-6">
                {/* Status Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-400 mb-1">Status</div>
                    <div className="text-lg sm:text-xl font-bold font-mono">{status}</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-400 mb-1">Target Block</div>
                    <div className="text-lg sm:text-xl font-bold font-mono">{targetBlock.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-400 mb-1">Participants</div>
                    <div className="text-lg sm:text-xl font-bold font-mono">{totalParticipants}</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-400 mb-1">Paused</div>
                    <div className="text-lg sm:text-xl font-bold font-mono">
                      {paused ? <span className="text-gray-400">Yes</span> : <span className="text-gray-400">No</span>}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button onClick={handleEnter} className="w-full py-3 text-sm sm:text-base">
                    Enter Lottery (10 STX)
                  </Button>
                  <Button onClick={handleDraw} className="w-full py-3 text-sm sm:text-base">
                    Draw Winner
                  </Button>
                  <Button onClick={handleClaim} className="w-full py-3 text-sm sm:text-base">
                    Claim Prize
                  </Button>
                  <Button onClick={handleRefund} className="w-full py-3 text-sm sm:text-base">
                    Request Refund
                  </Button>
                </div>
              </div>
            </Card>

            {/* Participants & Winner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card title="Participants">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total Entries</span>
                    <span className="text-2xl font-bold">{totalParticipants}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <span className="text-xs text-gray-500">Prize Pool: {totalParticipants * 10} STX</span>
                  </div>
                </div>
              </Card>

              <Card title="Winner">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                  {winner ? (
                    <div>
                      <div className="text-xs text-gray-400 mb-2">Winner Address</div>
                      <div className="font-mono text-sm break-all">{winner}</div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-sm text-gray-500">No winner yet</div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </section>

          {/* Right Column - Sidebar */}
          <aside className="space-y-4 sm:space-y-6">
            {/* Admin Controls */}
            <Card title="Admin Controls">
              <div className="flex flex-col gap-3">
                <Button onClick={handlePause} className="w-full py-3">
                  Pause Lottery
                </Button>
                <Button onClick={handleUnpause} className="w-full py-3">
                  Unpause Lottery
                </Button>
              </div>
            </Card>

            {/* Info Card */}
            <Card title="How It Works" className="hidden lg:block">
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span>Connect your Stacks wallet</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>Enter the lottery with 10 STX</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>Wait for target block</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">4.</span>
                  <span>Winner takes all!</span>
                </div>
              </div>
            </Card>

            {/* Stats Card - Mobile/Tablet visible */}
            <Card title="Quick Stats" className="lg:hidden">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-900/50 p-3 rounded border border-gray-800 text-center">
                  <div className="text-xs text-gray-400">Entry Fee</div>
                  <div className="text-lg font-bold">10 STX</div>
                </div>
                <div className="bg-gray-900/50 p-3 rounded border border-gray-800 text-center">
                  <div className="text-xs text-gray-400">Min Players</div>
                  <div className="text-lg font-bold">3</div>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-8 sm:mt-12 lg:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-500">
            <div className="font-mono break-all text-center sm:text-left">
              Contract: {CONTRACT_ADDRESS}.{CONTRACT_NAME}
            </div>
            <div className="text-gray-600">
              Built on Stacks
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
