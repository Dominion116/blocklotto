import React, { useState } from 'react'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { Button } from './components/button'
import { Card } from './components/card'
import './config'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'ST30VGN68PSGVWGNMD0HH2WQMM5T486EK3WBNTHCY'
const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME || 'block-lotto'

export default function App() {
  const { address, isConnected } = useAppKitAccount()
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
    <div className="min-h-screen p-4 md:p-8 font-sans" style={{ background: '#000' }}>
      <header className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">BlockLotto</h1>
          <p className="text-sm md:text-base text-gray-400">Decentralized lottery on Stacks</p>
        </div>
        <appkit-button />
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
                {participants.length === 0 && <li className="text-gray-500">No participants listed</li>}
                {participants.map((p, i) => (
                  <li key={i} className="truncate">{p}</li>
                ))}
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
