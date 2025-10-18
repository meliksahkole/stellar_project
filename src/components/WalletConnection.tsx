'use client'

import { useState, useEffect } from 'react'
import freighterApi from '@stellar/freighter-api'

interface WalletConnectionProps {
  onWalletConnected: (publicKey: string) => void
  onWalletDisconnected: () => void
}

export default function WalletConnection({ onWalletConnected, onWalletDisconnected }: WalletConnectionProps) {
  const [publicKey, setPublicKey] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string>('')

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      // Check if Freighter is installed and connected
      const { isConnected: connected } = await freighterApi.isConnected()
      
      if (connected) {
        // Try to get address silently (only works if previously authorized)
        const { address, error } = await freighterApi.getAddress()
        
        if (!error && address) {
          setPublicKey(address)
          onWalletConnected(address)
          // Save to localStorage
          localStorage.setItem('freighter_public_key', address)
        }
      }
    } catch (err) {
      console.log('Wallet not connected or not authorized')
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    setError('')

    try {
      console.log('Attempting to connect wallet...')
      
      // Check if Freighter is installed
      const { isConnected: connected } = await freighterApi.isConnected()
      console.log('Freighter connected status:', connected)
      
      if (!connected) {
        setError('Freighter wallet is not installed. Please install it from https://freighter.app/')
        setIsConnecting(false)
        return
      }

      // Request access and get public key
      console.log('Requesting access...')
      const { address, error } = await freighterApi.requestAccess()
      console.log('Request access result:', { address, error })
      
      if (error) {
        setError(`Failed to connect wallet: ${error}`)
        setIsConnecting(false)
        return
      }

      if (address) {
        console.log('Wallet connected successfully:', address)
        setPublicKey(address)
        onWalletConnected(address)
        // Save to localStorage
        localStorage.setItem('freighter_public_key', address)
      } else {
        setError('No address returned from wallet')
        setIsConnecting(false)
      }
    } catch (err) {
      console.error('Wallet connection error:', err)
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    console.log('Disconnecting wallet...')
    setPublicKey('')
    onWalletDisconnected()
    // Clear from localStorage
    localStorage.removeItem('freighter_public_key')
    console.log('Wallet disconnected successfully')
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {publicKey ? (
        <div className="text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Wallet Connected!</p>
            <p className="text-sm font-mono">{publicKey.slice(0, 8)}...{publicKey.slice(-8)}</p>
          </div>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-stellar-blue hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {isConnecting ? 'Connecting...' : 'Connect Freighter Wallet'}
          </button>
          
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


