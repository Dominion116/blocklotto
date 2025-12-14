import React, { useState } from 'react'
import { Button } from './components/button'
import { Card } from './components/card'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME || 'block-lotto'

export default function App() {
  const [status] = useState<string>('Ready - Connect wallet to interact')
  const [targetBlock] = useState<number>(0)
  const [participants] = useState<string[]>([])
  const [totalParticipants] = useState<number>(0)
  const [winner] = useState<string | null>(null)
  const [paused] = useState<boolean>(false)

  const handleEnter = () => {
    alert('Connect Hiro Wallet to enter the lottery')
  }

  const handleDraw = () => {
    alert('Connect Hiro Wallet to draw winner')
  }

  const handleClaim = () => {
    alert('Connect Hiro Wallet to claim prize')
  }

  const handleRefund = () => {
    alert('Connect Hiro Wallet to request refund')
  }

  const handlePause = () => {
    alert('Connect Hiro Wallet (admin only)')
  }

  const handleUnpause = () => {
    alert('Connect Hiro Wallet (admin only)')
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
