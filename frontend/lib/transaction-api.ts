export interface SendUSDTRequest {
  recipientAddress: string
  recipientName: string
  amountNaira: number
  description: string
}

export interface Transaction {
  id: string
  userId: string
  recipientAddress: string
  recipientName: string
  amountNaira: number
  amountUSDT: number
  exchangeRate: number
  transactionHash: string
  status: string
  type: string
  createdAt: string
  description: string
}

export interface WalletBalanceResponse {
  balanceNaira: number
  balanceUSDT: number
  exchangeRate: number
  walletAddress: string
}

export interface TransactionHistoryResponse {
  transactions: Transaction[]
  hasMore: boolean
}

export interface SendUSDTResponse {
  transactionId: string
  amountNaira: number
  amountUSDT: number
  exchangeRate: number
  transactionHash: string
  status: string
}

// Re-export from main API client for backward compatibility
import { apiClient } from './api'

class TransactionAPI {
  async getWalletBalance(): Promise<WalletBalanceResponse> {
    return apiClient.getWalletBalance()
  }

  async createWallet(): Promise<WalletBalanceResponse> {
    return apiClient.createWallet()
  }

  async getTransactionHistory(page: number, limit: number): Promise<TransactionHistoryResponse> {
    return apiClient.getTransactionHistory(page, limit)
  }

  async sendUSDT(request: SendUSDTRequest): Promise<SendUSDTResponse> {
    return apiClient.sendUSDT(request)
  }
}

export const transactionAPI = new TransactionAPI()