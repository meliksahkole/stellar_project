'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WalletConnection from '@/components/WalletConnection'

export default function Home() {
  const [publicKey, setPublicKey] = useState<string>('')
  const router = useRouter()

  const handleWalletConnected = (walletPublicKey: string) => {
    setPublicKey(walletPublicKey)
    // Redirect to main page after successful connection
    router.push('/main')
  }

  const handleWalletDisconnected = () => {
    setPublicKey('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🏨 Staylar</h1>
          <p className="text-xl text-white/80 mb-2">Hotel Payment dApp</p>
          <p className="text-sm text-white/60">
            Connect your Freighter wallet to start making blockchain payments
          </p>
        </div>

        <div className="space-y-6">
          <WalletConnection 
            onWalletConnected={handleWalletConnected}
            onWalletDisconnected={handleWalletDisconnected}
          />
          
          <div className="text-center">
            <p className="text-xs text-white/50">
              Powered by Stellar Soroban
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}


