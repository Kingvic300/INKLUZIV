"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSpeechRecognition, useSpeechSynthesis } from './use-speech'
import { voiceNLU, VoiceIntent } from '@/lib/voice-nlu'
import { blockchainService } from '@/lib/blockchain'
import { useToast } from './use-toast'

export interface DeFiVoiceState {
  isListening: boolean
  isProcessing: boolean
  lastCommand: string
  pendingAction: VoiceIntent | null
  currentSubtitle: string
}

export function useDeFiVoice() {
  const [state, setState] = useState<DeFiVoiceState>({
    isListening: false,
    isProcessing: false,
    lastCommand: "",
    pendingAction: null,
    currentSubtitle: ""
  })

  const { toast } = useToast()
  const { isListening, transcript, startListening, stopListening, isSupported: speechSupported } = useSpeechRecognition()
  const { speak, isSupported: ttsSupported } = useSpeechSynthesis()

  // Update listening state
  useEffect(() => {
    setState(prev => ({ ...prev, isListening }))
  }, [isListening])

  // Process voice commands
  useEffect(() => {
    if (transcript && transcript !== state.lastCommand) {
      processVoiceCommand(transcript)
    }
  }, [transcript])

  const processVoiceCommand = useCallback(async (command: string) => {
    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      lastCommand: command,
      currentSubtitle: "Processing your DeFi command..."
    }))

    try {
      const intent = await voiceNLU.processCommand(command)
      
      setState(prev => ({ 
        ...prev, 
        pendingAction: intent,
        currentSubtitle: intent.response
      }))

      if (ttsSupported) {
        speak(intent.response)
      }

      toast({
        title: `DeFi Command: ${intent.intent}`,
        description: intent.response
      })

      // Auto-execute certain commands
      if (intent.intent === 'check_balance' || intent.intent === 'check_yield') {
        // These are read-only, execute immediately
        setTimeout(() => {
          setState(prev => ({ ...prev, pendingAction: null }))
        }, 3000)
      }

    } catch (error) {
      const errorMessage = "Failed to process voice command. Please try again."
      setState(prev => ({ ...prev, currentSubtitle: errorMessage }))
      
      if (ttsSupported) {
        speak(errorMessage)
      }
      
      toast({
        title: "Voice Command Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }))
      
      // Clear subtitle after delay
      setTimeout(() => {
        setState(prev => ({ ...prev, currentSubtitle: "" }))
      }, 6000)
    }
  }, [ttsSupported, toast])

  const startVoiceListening = useCallback(() => {
    if (!speechSupported) {
      toast({
        title: "Speech Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      })
      return
    }

    setState(prev => ({ 
      ...prev, 
      currentSubtitle: "Voice recognition active... Say your DeFi command" 
    }))
    
    startListening()
  }, [speechSupported, startListening, toast])

  const stopVoiceListening = useCallback(() => {
    stopListening()
    setState(prev => ({ ...prev, currentSubtitle: "" }))
  }, [stopListening])

  const confirmPendingAction = useCallback(async () => {
    if (!state.pendingAction) return

    setState(prev => ({ ...prev, isProcessing: true }))

    try {
      const { intent, parameters } = state.pendingAction

      switch (intent) {
        case 'deposit':
          await executeDeposit(parameters.amount, parameters.protocol)
          break
        case 'withdraw':
          await executeWithdraw(parameters.amount)
          break
        case 'request_loan':
          await executeLoanRequest(parameters.amount)
          break
        default:
          throw new Error(`Cannot execute intent: ${intent}`)
      }

      setState(prev => ({ ...prev, pendingAction: null }))
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Action failed"
      toast({
        title: "Action Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }))
    }
  }, [state.pendingAction, toast])

  const executeDeposit = async (amount: number, protocol: string) => {
    // Simulate DeFi deposit
    const protocolMap: Record<string, string> = {
      'celo-mento': '0x1234567890123456789012345678901234567890',
      'ubeswap': '0x2345678901234567890123456789012345678901',
      'moola': '0x3456789012345678901234567890123456789012'
    }

    const contractAddress = protocolMap[protocol] || protocolMap['celo-mento']
    
    // Prepare transaction
    const unsignedTx = await blockchainService.prepareDepositTransaction(contractAddress, amount)
    
    // For demo, auto-confirm with mock passphrase
    const signedTx = await blockchainService.signAndBroadcastTransaction(unsignedTx, "confirmed")
    
    const successMessage = `Successfully deposited ${amount} USDT into ${protocol}. Transaction hash: ${signedTx.hash.substring(0, 10)}...`
    
    if (ttsSupported) {
      speak(successMessage)
    }
    
    toast({
      title: "Deposit Successful",
      description: successMessage
    })

    // Update local metrics
    const currentDeposits = blockchainService.getStoredDepositsCount()
    blockchainService.updateDepositsCount(currentDeposits + 1)
  }

  const executeWithdraw = async (amount: number) => {
    // Simulate DeFi withdrawal
    const successMessage = `Successfully withdrew ${amount} USDT from your DeFi positions.`
    
    if (ttsSupported) {
      speak(successMessage)
    }
    
    toast({
      title: "Withdrawal Successful",
      description: successMessage
    })
  }

  const executeLoanRequest = async (amount: number) => {
    // Check eligibility first
    const eligibility = await blockchainService.checkLoanEligibility(3) // Assume level 3
    
    if (!eligibility.eligible) {
      throw new Error("Not eligible for loans. Build your trust passport first.")
    }

    if (amount > eligibility.maxAmount) {
      throw new Error(`Maximum loan amount is ${eligibility.maxAmount} USDT`)
    }

    const loan = await blockchainService.requestMicroLoan(amount, 30)
    
    if (loan.approved) {
      const successMessage = `Loan approved! ${amount} USDT will be transferred to your wallet.`
      
      if (ttsSupported) {
        speak(successMessage)
      }
      
      toast({
        title: "Loan Approved",
        description: successMessage
      })
    }
  }

  const clearPendingAction = useCallback(() => {
    setState(prev => ({ ...prev, pendingAction: null }))
  }, [])

  const updateSubtitle = useCallback((subtitle: string) => {
    setState(prev => ({ ...prev, currentSubtitle: subtitle }))
  }, [])

  return {
    ...state,
    speechSupported,
    ttsSupported,
    startVoiceListening,
    stopVoiceListening,
    confirmPendingAction,
    clearPendingAction,
    updateSubtitle
  }
}