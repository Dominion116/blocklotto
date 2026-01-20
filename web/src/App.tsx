import React, { useState, useEffect } from 'react'
import { Button } from './components/button'
import { Card } from './components/card'
import { NotificationBell } from './components/notifications'
import { userSession, connectWallet, disconnect } from './config'
import { openContractCall } from '@stacks/connect'
import { StacksTestnet } from '@stacks/network'
import { 
  // @ts-ignore
  uintCV, 
  // @ts-ignore
  deserializeCV, 
  // @ts-ignore
  ClarityType,
  // @ts-ignore
  Cl
} from '@stacks/transactions'

async function callReadOnlyFunction(options: any) {
  try {
    const apiUrl = (options.network as any).coreApiUrl || 'https://api.testnet.hiro.so'
    const response = await fetch(`${apiUrl}/v2/contracts/call-read/${options.contractAddress}/${options.contractName}/${options.functionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: options.senderAddress || options.contractAddress,
        arguments: []
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Raw API Response:', data)
    
    if (data.okay && data.result) {
      return parseClarityFromAPI(data)
    }
    throw new Error('Invalid response from contract')
  } catch (error) {
    console.error('callReadOnlyFunction error:', error)
    throw error
  }
}

function parseClarityFromAPI(apiResponse: any): any {
  try {
    // Attempt to use Cl.deserialize if available, otherwise fallback
    const deserialize = typeof Cl !== 'undefined' ? Cl.deserialize : deserializeCV;
    const clarityValue = deserialize(apiResponse.result)
    console.log('Deserialized Clarity Value:', clarityValue)
    return clarityValue
  } catch (error) {
    console.error('Failed to deserialize Clarity value:', error)
    return apiResponse
  }
}

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'ST30VGN68PSGVWGNMD0HH2WQMM5T486EK3WBNTHCY'
const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME || 'block-lotto-v3'
const network = new StacksTestnet()

export default function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string>('')
  const [status, setStatus] = useState<string>('Open')
  const [targetBlock, setTargetBlock] = useState<number>(0)
  const [totalParticipants, setTotalParticipants] = useState<number>(0)
  const [winner, setWinner] = useState<string | null>(null)
  const [paused, setPaused] = useState<boolean>(false)
  const [currentBlock, setCurrentBlock] = useState<number>(0)

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setIsConnected(true)
      const userData = userSession.loadUserData()
      setAddress(userData.profile.stxAddress.testnet)
    }
    loadLotteryInfo()
    loadCurrentBlock()
    
    const blockInterval = setInterval(loadCurrentBlock, 30000)
    return () => clearInterval(blockInterval)
  }, [])

  const loadCurrentBlock = async () => {
    try {
      const apiUrl = (network as any).coreApiUrl || 'https://api.testnet.hiro.so'
      const response = await fetch(`${apiUrl}/v2/info`)
      const data = await response.json()
      setCurrentBlock(data.stacks_tip_height)
    } catch (error) {
      console.error('Error loading current block:', error)
    }
  }

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
      
      if (result.type === ClarityType.ResponseOk) {
        const tupleData = result.value.value
        
        const statusCV = tupleData['status']
        const targetBlockCV = tupleData['target-block-height']
        const participantsCV = tupleData['total-participants']
        const pausedCV = tupleData['paused']
        const winnerCV = tupleData['winner']
        
        const statusNum = statusCV?.type === ClarityType.UInt ? Number(statusCV.value) : 0
        const targetBlockNum = targetBlockCV?.type === ClarityType.UInt ? Number(targetBlockCV.value) : 0
        const participantsNum = participantsCV?.type === ClarityType.UInt ? Number(participantsCV.value) : 0
        const pausedBool = pausedCV?.type === ClarityType.BoolTrue
        
        setStatus(getStatusText(statusNum))
        setTargetBlock(targetBlockNum)
        setTotalParticipants(participantsNum)
        setPaused(pausedBool)
        
        if (winnerCV?.type === ClarityType.OptionalSome) {
          const winnerPrincipal = winnerCV.value
          const winnerAddress = winnerPrincipal?.value || winnerPrincipal?.address
          setWinner(winnerAddress || null)
        } else {
          setWinner(null)
        }
      }
    } catch (error) {
      console.error('Error loading lottery info:', error)
      setStatus('Ready')
    }
  }

  const getStatusText = (statusCode: number) => {
    const codes: Record<number, string> = {
      0: 'Open',
      1: 'Ready to Draw',
      2: 'Completed',
      3: 'Refunded'
    }
    return codes[statusCode] || 'Unknown'
  }

  const handleConnect = () => {
    connectWallet()
  }

  const handleDisconnect = () => {
    disconnect()
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
      postConditionMode: 'allow',
      onFinish: (data) => {
        alert('Entry submitted! Transaction ID: ' + data.txId)
        setTimeout(loadLotteryInfo, 3000)
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
      postConditionMode: 'allow',
      onFinish: (data) => {
        alert('Winner drawn! Transaction ID: ' + data.txId)
        setTimeout(loadLotteryInfo, 5000)
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
      postConditionMode: 'allow',
      onFinish: (data) => {
        alert('Prize claimed! Transaction ID: ' + data.txId)
        setTimeout(loadLotteryInfo, 3000)
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
      postConditionMode: 'allow',
      onFinish: (data) => {
        alert('Refund requested! Transaction ID: ' + data.txId)
        setTimeout(loadLotteryInfo, 3000)
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
      postConditionMode: 'allow',
      onFinish: () => setTimeout(loadLotteryInfo, 2000)
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
      postConditionMode: 'allow',
      onFinish: () => setTimeout(loadLotteryInfo, 2000)
    })
  }

  const handleResetLottery = async () => {
    if (!isConnected) {
      connectWallet()
      return
    }

    try {
      const apiUrl = (network as any).coreApiUrl || 'https://api.testnet.hiro.so'
      const response = await fetch(`${apiUrl}/v2/info`)
      const info = await response.json()
      const newTargetBlock = info.stacks_tip_height + 10
      
      // Use Cl.uint if available, fallback to uintCV
      const uintHelper = typeof Cl !== 'undefined' ? Cl.uint : uintCV;
      const targetBlockCV = uintHelper(newTargetBlock)

      openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'reset-lottery',
        functionArgs: [targetBlockCV],
        postConditionMode: 'allow',
        onFinish: (data) => {
          alert(`New lottery started! Target block: ${newTargetBlock}\nTransaction ID: ${data.txId}`)
          setTimeout(loadLotteryInfo, 2000)
        }
      })
    } catch (error) {
      console.error('Error resetting lottery:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">BlockLotto</h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Decentralized lottery on Stacks</p>
            </div>
            {isConnected ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <NotificationBell />
                <span className="text-xs sm:text-sm text-gray-400 font-mono bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
                  {address.slice(0, 8)}...{address.slice(-6)}
                </span>
                <Button onClick={handleDisconnect} className="w-full sm:w-auto">Disconnect</Button>
              </div>
            ) : (
              <Button onClick={handleConnect} className="w-full sm:w-auto">Connect Wallet</Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <section className="xl:col-span-2 space-y-4 sm:space-y-6">
            <Card title="Lottery Status">
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-400 mb-1">Status</div>
                    <div className="text-lg sm:text-xl font-bold font-mono">{status}</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-400 mb-1">Current Block</div>
                    <div className="text-lg sm:text-xl font-bold font-mono text-blue-400">{currentBlock.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-400 mb-1">Target Block</div>
                    <div className="text-lg sm:text-xl font-bold font-mono">{targetBlock.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-400 mb-1">Participants</div>
                    <div className="text-lg sm:text-xl font-bold font-mono">{totalParticipants}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button onClick={handleEnter} className="w-full py-3">Enter Lottery (1 STX)</Button>
                  <Button onClick={handleDraw} className="w-full py-3">Draw Winner</Button>
                  <Button onClick={handleClaim} className="w-full py-3">Claim Prize</Button>
                  <Button onClick={handleRefund} className="w-full py-3">Request Refund</Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card title="Participants">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total Entries</span>
                    <span className="text-2xl font-bold">{totalParticipants}</span>
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
                    <div className="text-center py-4 text-sm text-gray-500">No winner yet</div>
                  )}
                </div>
              </Card>
            </div>
          </section>

          <aside className="space-y-4 sm:space-y-6">
            <Card title="Admin Controls">
              <div className="flex flex-col gap-3">
                {status === 'Completed' && (
                  <Button onClick={handleResetLottery} className="w-full py-3 bg-green-600 hover:bg-green-700"> Start New Lottery </Button>
                )}
                <Button onClick={handlePause} className="w-full py-3">Pause Lottery</Button>
                <Button onClick={handleUnpause} className="w-full py-3">Unpause Lottery</Button>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
