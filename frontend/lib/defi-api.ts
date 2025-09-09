// DeFi API client for voice-powered yield farming
export interface DeFiProtocol {
  id: string
  name: string
  apy: string
  tvl: string
  risk: 'Low' | 'Medium' | 'High'
  contractAddress: string
}

export interface DepositRequest {
  protocolId: string
  amount: number
  userAddress: string
}

export interface DepositResponse {
  transactionHash: string
  amount: number
  protocol: string
  apy: string
  estimatedYield: number
  status: 'pending' | 'confirmed' | 'failed'
}

export interface YieldPosition {
  id: string
  protocol: string
  amount: number
  apy: string
  yieldEarned: number
  depositDate: string
  status: 'active' | 'withdrawn'
}

export interface TrustPassport {
  level: number
  name: string
  badge: string
  depositsCount: number
  daysActive: number
  withdrawalsCount: number
  soulboundTokenId?: string
  eligibleLoanAmount: number
}

export interface LoanRequest {
  amount: number
  duration: number // days
  collateralAmount?: number
}

export interface LoanResponse {
  loanId: string
  amount: number
  interestRate: string
  duration: number
  status: 'approved' | 'pending' | 'rejected'
  repaymentDate: string
}

class DeFiAPIClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "https://inkluziv.onrender.com"
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
      // @ts-ignore
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `DeFi API Error: ${response.status}`)
    }

    return response.json()
  }

  // DeFi Protocol Methods
  async getAvailableProtocols(): Promise<DeFiProtocol[]> {
    return this.request("/defi/protocols")
  }

  async depositToProtocol(request: DepositRequest): Promise<DepositResponse> {
    return this.request("/defi/deposit", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async getYieldPositions(): Promise<YieldPosition[]> {
    return this.request("/defi/positions")
  }

  async withdrawFromProtocol(positionId: string): Promise<DepositResponse> {
    return this.request(`/defi/withdraw/${positionId}`, {
      method: "POST",
    })
  }

  // Trust Passport Methods
  async getTrustPassport(): Promise<TrustPassport> {
    return this.request("/trust/passport")
  }

  async analyzeTrustScore(): Promise<TrustPassport> {
    return this.request("/trust/analyze", {
      method: "POST",
    })
  }

  async mintTrustPassport(): Promise<{ tokenId: string; transactionHash: string }> {
    return this.request("/trust/mint", {
      method: "POST",
    })
  }

  // Loan Methods
  async checkLoanEligibility(): Promise<{ eligible: boolean; maxAmount: number; reason?: string }> {
    return this.request("/loans/eligibility")
  }

  async requestLoan(request: LoanRequest): Promise<LoanResponse> {
    return this.request("/loans/request", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async getActiveLoans(): Promise<LoanResponse[]> {
    return this.request("/loans/active")
  }

  async repayLoan(loanId: string, amount: number): Promise<{ success: boolean; remainingBalance: number }> {
    return this.request(`/loans/repay/${loanId}`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    })
  }

  // Voice Command Processing
  async processVoiceCommand(command: string): Promise<{
    intent: string
    parameters: Record<string, any>
    response: string
  }> {
    return this.request("/voice/process", {
      method: "POST",
      body: JSON.stringify({ command }),
    })
  }
}

export const defiAPI = new DeFiAPIClient()

// Mock data for development
export const mockProtocols: DeFiProtocol[] = [
  {
    id: "celo-mento",
    name: "Celo Mento",
    apy: "8.5%",
    tvl: "$2.1M",
    risk: "Low",
    contractAddress: "0x1234567890123456789012345678901234567890"
  },
  {
    id: "ubeswap",
    name: "Ubeswap",
    apy: "12.3%",
    tvl: "$850K",
    risk: "Medium",
    contractAddress: "0x2345678901234567890123456789012345678901"
  },
  {
    id: "moola",
    name: "Moola Market",
    apy: "6.8%",
    tvl: "$1.5M",
    risk: "Low",
    contractAddress: "0x3456789012345678901234567890123456789012"
  }
]