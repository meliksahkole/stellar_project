'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import WalletConnection from '@/components/WalletConnection'
import useContractIntegration from '@/components/ContractIntegration'

interface PaymentInfo {
  amount: string
  payer: string
  reservationCode: string
}

export default function MainPage() {
  const [publicKey, setPublicKey] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [hotelAddress, setHotelAddress] = useState<string>('')
  const [reservationCode, setReservationCode] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastPayment, setLastPayment] = useState<PaymentInfo | null>(null)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const router = useRouter()

  // Check for existing wallet connection on mount
  useEffect(() => {
    const savedPublicKey = localStorage.getItem('freighter_public_key')
    if (savedPublicKey) {
      setPublicKey(savedPublicKey)
    } else {
      // Redirect to home if no wallet connected
      router.push('/')
    }
  }, [router])

  const handleWalletConnected = (walletPublicKey: string) => {
    setPublicKey(walletPublicKey)
  }

  const handleWalletDisconnected = () => {
    setPublicKey('')
    router.push('/')
  }

  // Initialize contract integration hook
  const contractIntegration = useContractIntegration({
    publicKey,
    onPaymentSuccess: (paymentInfo) => {
      setLastPayment(paymentInfo)
      setSuccess('Payment processed successfully!')
      
      // Clear form
      setAmount('')
      setHotelAddress('')
      setReservationCode('')
    },
    onError: (errorMsg) => {
      setError(errorMsg)
    }
  })

  const handlePayment = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first')
      return
    }

    if (!amount || !hotelAddress || !reservationCode) {
      setError('Please fill in all fields')
      return
    }

    setIsProcessing(true)
    setError('')
    setSuccess('')

    try {
      // Call the pay_hotel contract function
      await contractIntegration.callPayHotel(hotelAddress, amount, reservationCode)
      
    } catch (err) {
      setError('Payment failed. Please try again.')
      console.error('Payment error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!publicKey) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-white mb-4">Connecting wallet...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🏨 Staylar Payment</h1>
              <p className="text-white/80">Secure hotel payments on Stellar blockchain</p>
            </div>
            <WalletConnection 
              onWalletConnected={handleWalletConnected}
              onWalletDisconnected={handleWalletDisconnected}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Make Payment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Payment Amount (XLM or USDC)
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 10.5 XLM or 100 USDC"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Hotel Wallet Address
                </label>
                <input
                  type="text"
                  value={hotelAddress}
                  onChange={(e) => setHotelAddress(e.target.value)}
                  placeholder="Enter hotel's Stellar address"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Reservation Code
                </label>
                <input
                  type="text"
                  value={reservationCode}
                  onChange={(e) => setReservationCode(e.target.value)}
                  placeholder="Enter your reservation code"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-stellar-blue hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {isProcessing ? 'Processing Payment...' : 'Pay Now'}
              </button>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  <p className="text-sm">{success}</p>
                </div>
              )}
            </div>
          </div>

          {/* Last Payment Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Last Payment</h2>
            
            {lastPayment ? (
              <div className="space-y-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">Amount:</span>
                    <span className="text-white font-medium">{lastPayment.amount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">Payer:</span>
                    <span className="text-white font-mono text-xs">
                      {lastPayment.payer.slice(0, 8)}...{lastPayment.payer.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Reservation:</span>
                    <span className="text-white font-medium">{lastPayment.reservationCode}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60">No payments made yet</p>
                <p className="text-white/40 text-sm mt-2">Payment history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
