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

class TransactionAPI {
  private baseURL: string

  constructor() {
    this.baseURL = '/api'
  }

  private getAuthToken(): string | null {
    // Get token from localStorage or cookies
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || 'demo-token'
    }
    return 'demo-token'
  }

  private getHeaders(): HeadersInit {
    const token = this.getAuthToken()
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    }
  }

  async getWalletBalance(): Promise<WalletBalanceResponse> {
    const response = await fetch(`${this.baseURL}/wallet`, {
      method: 'GET',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch wallet balance')
    }

    return response.json()
  }

  async createWallet(): Promise<WalletBalanceResponse> {
    const response = await fetch(`${this.baseURL}/wallet`, {
      method: 'POST',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to create wallet')
    }

    return response.json()
  }

  async getTransactionHistory(page: number, limit: number): Promise<TransactionHistoryResponse> {
    const response = await fetch(`${this.baseURL}/transactions?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch transaction history')
    }

    return response.json()
  }

  async sendUSDT(request: SendUSDTRequest): Promise<SendUSDTResponse> {
    const response = await fetch(`${this.baseURL}/transactions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send USDT')
    }

    return response.json()
  }
}

export const transactionAPI = new TransactionAPI()