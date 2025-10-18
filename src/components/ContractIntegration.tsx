'use client'

import { useState } from 'react'
import { 
  Contract, 
  Networks, 
  TransactionBuilder, 
  Operation,
  Keypair,
  Asset,
  BASE_FEE,
  Memo,
  MemoType
} from 'stellar-sdk'
import freighterApi from '@stellar/freighter-api'

// Contract configuration
const CONTRACT_ID = 'CDXY32IN7BZ6FB6677R273SD3QJ25Z3E6OQHZLA6AUPPO764HZ3VE26B' // Deployed contract ID
const NETWORK_PASSPHRASE = Networks.TESTNET
const HORIZON_URL = 'https://horizon-testnet.stellar.org'

interface ContractIntegrationProps {
  publicKey: string
  onPaymentSuccess: (paymentInfo: any) => void
  onError: (error: string) => void
}

export default function useContractIntegration({ 
  publicKey, 
  onPaymentSuccess, 
  onError 
}: ContractIntegrationProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Initialize Stellar server
  const getServer = () => {
    return new (require('stellar-sdk').Server)(HORIZON_URL)
  }

  // Call the pay_hotel contract function
  const callPayHotel = async (
    hotelAddress: string,
    amount: string,
    reservationCode: string
  ) => {
    setIsLoading(true)
    
    try {
      const server = getServer()
      
      // Get account info
      const account = await server.loadAccount(publicKey)
      
      // Create contract instance
      const contract = new Contract(CONTRACT_ID)
      
      // Prepare contract call operation
      const contractCallOp = contract.call(
        'pay_hotel',
        hotelAddress,
        amount,
        reservationCode
      )

      // Build transaction
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contractCallOp)
        .addMemo(Memo.text('Hotel Payment'))
        .setTimeout(30)
        .build()

      // Sign transaction with Freighter
      const signedResult = await freighterApi.signTransaction(transaction.toXDR(), {
        network: 'TESTNET',
        accountToSign: publicKey,
      })

      if (signedResult.error) {
        throw new Error(`Signing failed: ${signedResult.error}`)
      }

      // Submit transaction
      const signedTransaction = TransactionBuilder.fromXDR(
        signedResult.signedTransaction,
        NETWORK_PASSPHRASE
      )

      const result = await server.submitTransaction(signedTransaction)
      
      if (result.successful) {
        console.log('Payment transaction successful:', result)
        
        onPaymentSuccess({
          amount,
          payer: publicKey,
          reservationCode,
          transactionHash: result.hash
        })
        
        return result
      } else {
        throw new Error('Transaction failed')
      }
      
    } catch (error) {
      console.error('Payment error:', error)
      onError(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Call the get_last_payment contract function
  const callGetLastPayment = async () => {
    try {
      const server = getServer()
      
      // Get account info
      const account = await server.loadAccount(publicKey)
      
      // Create contract instance
      const contract = new Contract(CONTRACT_ID)
      
      // Prepare contract call operation (read-only)
      const contractCallOp = contract.call('get_last_payment')

      // Build transaction
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contractCallOp)
        .setTimeout(30)
        .build()

      // Sign transaction with Freighter
      const signedResult = await freighterApi.signTransaction(transaction.toXDR(), {
        network: 'TESTNET',
        accountToSign: publicKey,
      })

      if (signedResult.error) {
        throw new Error(`Signing failed: ${signedResult.error}`)
      }

      // Submit transaction
      const signedTransaction = TransactionBuilder.fromXDR(
        signedResult.signedTransaction,
        NETWORK_PASSPHRASE
      )

      const result = await server.submitTransaction(signedTransaction)
      
      if (result.successful) {
        console.log('Get last payment successful:', result)
        return result
      } else {
        throw new Error('Failed to get last payment')
      }
      
    } catch (error) {
      console.error('Get last payment error:', error)
      throw error
    }
  }

  return {
    callPayHotel,
    callGetLastPayment,
    isLoading
  }
}

// Utility function to parse contract response
export const parseContractResponse = (result: any) => {
  try {
    // Parse the contract response based on the actual return format
    // This will need to be adjusted based on the actual contract response
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Error parsing contract response:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}


