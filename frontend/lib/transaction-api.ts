// Transaction API client for INKLUZIV USDT functionality
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface SendUSDTRequest {
  recipientAddress: string
  recipientName: string
  amountNaira: number
  description?: string
}

export interface SendUSDTResponse {
  message: string
  transactionHash: string
  amountNaira: number
  amountUSDT: number
  exchangeRate: number
  status: string
  transactionId: string
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
  completedAt?: string
  description?: string
  networkFee?: string
}

export interface TransactionHistoryResponse {
  message: string
  transactions: Transaction[]
  totalPages: number
  totalElements: number
  currentPage: number
}

export interface WalletBalanceResponse {
  message: string
  balanceNaira: number
  balanceUSDT: number
  walletAddress: string
  exchangeRate: number
}

export class TransactionAPIClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`[TRANSACTION_API_ERROR: ${response.status}] ${errorText}`)
    }

    return response.json()
  }

  async sendUSDT(request: SendUSDTRequest): Promise<SendUSDTResponse> {
    return this.request("/transactions/send-usdt", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async getTransactionHistory(page: number = 0, size: number = 10): Promise<TransactionHistoryResponse> {
    return this.request(`/transactions/history?page=${page}&size=${size}`)
  }

  async getWalletBalance(): Promise<WalletBalanceResponse> {
    return this.request("/transactions/balance")
  }

  async createWallet(): Promise<WalletBalanceResponse> {
    return this.request("/transactions/create-wallet", {
      method: "POST",
    })
  }
}

export const transactionAPI = new TransactionAPIClient()