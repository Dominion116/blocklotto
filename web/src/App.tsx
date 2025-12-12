import React, { useState } from 'react'
import { openContractCall } from '@stacks/connect'
import { Button } from './components/button'
import { Card } from './components/card'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME || 'block-lotto'

export default function App() {
  const [status] = useState<string>('Ready (Connect wallet to interact)')
  const [targetBlock] = useState<number>(0)
  const [participants] = useState<string[]>([])
  const [totalParticipants] = useState<number>(0)
  const [winner] = useState<string | null>(null)
  const [paused] = useState<boolean>(false)

  // Note: In a production app we'd integrate Hiro Wallet via @stacks/connect with network config
  const handleEnter = async () => {
    // This opens Hiro wallet to call the contract's `enter-lottery` function
    try {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'enter-lottery',
        functionArgs: [],
        appDetails: { name: 'BlockLotto', icon: '' },
        onFinish: (tx) => {
          alert('Transaction submitted: ' + tx.txId)
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDraw = async () => {
    openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'draw-winner',
      functionArgs: [],
      appDetails: { name: 'BlockLotto', icon: '' },
      onFinish: (tx) => {
        alert('Draw submitted: ' + tx.txId)
      },
    })
  }

  const handleClaim = async () => {
    openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'claim-prize',
      functionArgs: [],
      appDetails: { name: 'BlockLotto', icon: '' },
      onFinish: (tx) => {
        alert('Claim submitted: ' + tx.txId)
      },
    })
  }

  const handleRefund = async () => {
    openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'refund',
      functionArgs: [],
      appDetails: { name: 'BlockLotto', icon: '' },
      onFinish: (tx) => {
        alert('Refund submitted: ' + tx.txId)
      },
    })
  }

  const handlePause = async () => {
    openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'pause',
      functionArgs: [],
      appDetails: { name: 'BlockLotto Admin', icon: '' },
      onFinish: (tx) => {
        alert('Pause submitted: ' + tx.txId)
      },
    })
  }

  const handleUnpause = async () => {
    openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'unpause',
      functionArgs: [],
      appDetails: { name: 'BlockLotto Admin', icon: '' },
      onFinish: (tx) => {
        alert('Unpause submitted: ' + tx.txId)
      },
    })
  }

  return (
    <div className="min-h-screen p-8 font-sans" style={{ background: '#000' }}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold">BlockLotto</h1>
        <p className="text-gray-400">Decentralized lottery on Stacks</p>
      </header>

      <main className="grid grid-cols-3 gap-6">
        <section className="col-span-2">
          <Card title="Lottery Status">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl">Status: <span className="font-mono">{status}</span></div>
                <div className="text-sm text-gray-400">Target block: {targetBlock}</div>
                <div className="text-sm text-gray-400">Participants: {totalParticipants}</div>
                <div className="text-sm text-gray-400">Paused: {paused ? 'Yes' : 'No'}</div>
              </div>
              <div className="space-y-2">
                <Button onClick={handleEnter}>Enter Lottery (10 STX)</Button>
                <Button onClick={handleDraw}>Draw Winner</Button>
                <Button onClick={handleClaim}>Claim Prize</Button>
                <Button onClick={handleRefund}>Refund</Button>
              </div>
            </div>
          </Card>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Card title="Participants">
              <ul className="text-sm text-gray-300">
                {participants.length === 0 && <li className="text-gray-500">No participants listed</li>}
                {participants.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Card>

            <Card title="Winner">
              <div>{winner ?? 'No winner yet'}</div>
            </Card>
          </div>
        </section>

        <aside>
          <Card title="Admin">
            <div className="space-y-2">
              <Button onClick={handlePause}>Pause</Button>
              <Button onClick={handleUnpause}>Unpause</Button>
            </div>
          </Card>

          <Card title="Theme Preview" >
            <div className="mt-4 bg-black border border-gray-700 h-32 flex items-center justify-center"> 
              <div className="text-gray-400">Theme: Dark Minimal (attachment)</div>
            </div>
          </Card>
        </aside>
      </main>

      <footer className="mt-12 text-sm text-gray-500">Contract: {CONTRACT_ADDRESS}.{CONTRACT_NAME}</footer>
    </div>
  )
}
