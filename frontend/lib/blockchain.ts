// Blockchain integration for DeFi operations
export interface WalletConfig {
  address: string
  privateKey?: string // Only stored locally, never sent to server
  network: 'celo-alfajores' | 'celo-mainnet'
}

export interface UnsignedTransaction {
  to: string
  data: string
  value: string
  gasLimit: string
  gasPrice: string
  nonce: number
}

export interface SignedTransaction {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  status: 'pending' | 'confirmed' | 'failed'
}

export interface TrustPassportNFT {
  tokenId: string
  level: number
  name: string
  badge: string
  mintDate: string
  attributes: {
    depositsCount: number
    daysActive: number
    withdrawalsCount: number
    totalYieldEarned: number
  }
}

class BlockchainService {
  private static instance: BlockchainService
  private wallet: WalletConfig | null = null

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService()
    }
    return BlockchainService.instance
  }

  // Wallet Management
  async initializeWallet(): Promise<WalletConfig> {
    // In a real implementation, this would generate or import a wallet
    // For demo, we'll use a mock wallet
    this.wallet = {
      address: "0x" + Math.random().toString(16).substring(2, 42),
      network: 'celo-alfajores'
    }
    
    localStorage.setItem('wallet_address', this.wallet.address)
    return this.wallet
  }

  getWalletAddress(): string | null {
    if (this.wallet) return this.wallet.address
    
    // Try to get from localStorage
    const stored = localStorage.getItem('wallet_address')
    if (stored) {
      this.wallet = { address: stored, network: 'celo-alfajores' }
      return stored
    }
    
    return null
  }

  // DeFi Protocol Interactions
  async prepareDepositTransaction(
    protocolAddress: string, 
    amount: number
  ): Promise<UnsignedTransaction> {
    // Simulate preparing a DeFi deposit transaction
    return {
      to: protocolAddress,
      data: this.encodeDepositData(amount),
      value: "0", // USDT transfer, not ETH
      gasLimit: "150000",
      gasPrice: "1000000000", // 1 gwei
      nonce: Math.floor(Math.random() * 1000)
    }
  }

  async signAndBroadcastTransaction(
    unsignedTx: UnsignedTransaction,
    passphrase: string
  ): Promise<SignedTransaction> {
    // Simulate signing with voice passphrase verification
    if (!this.verifyPassphrase(passphrase)) {
      throw new Error("Invalid voice passphrase")
    }

    // Simulate transaction broadcasting
    const txHash = "0x" + Math.random().toString(16).substring(2, 66)
    
    return {
      hash: txHash,
      from: this.wallet?.address || "",
      to: unsignedTx.to,
      value: unsignedTx.value,
      gasUsed: "120000",
      status: 'pending'
    }
  }

  // Trust Passport (Soulbound Token) Methods
  async checkTrustPassportEligibility(): Promise<{
    eligible: boolean
    currentLevel: number
    nextLevelRequirements: string
  }> {
    // Simulate checking on-chain activity for trust passport eligibility
    const depositsCount = this.getStoredDepositsCount()
    const daysActive = this.getStoredDaysActive()
    
    let currentLevel = 1
    let eligible = false
    let nextLevelRequirements = ""
    
    if (depositsCount >= 50 && daysActive >= 90) {
      currentLevel = 4
      eligible = true
    } else if (depositsCount >= 10 && daysActive >= 30) {
      currentLevel = 3
      eligible = true
      nextLevelRequirements = "Need 50 deposits and 90 days for DeFi Expert level"
    } else if (depositsCount >= 5) {
      currentLevel = 2
      eligible = true
      nextLevelRequirements = "Need 10 deposits and 30 days for Reliable Saver level"
    } else {
      currentLevel = 1
      nextLevelRequirements = "Need 5 deposits for Consistent Saver level"
    }
    
    return { eligible, currentLevel, nextLevelRequirements }
  }

  async mintTrustPassport(level: number): Promise<TrustPassportNFT> {
    // Simulate minting a Soulbound Token
    const tokenId = Math.floor(Math.random() * 10000).toString()
    const levels = [
      { name: "New Saver", badge: "🌱" },
      { name: "Consistent Saver", badge: "⭐" },
      { name: "Reliable Saver", badge: "🏆" },
      { name: "DeFi Expert", badge: "💎" }
    ]
    
    return {
      tokenId,
      level,
      name: levels[level - 1].name,
      badge: levels[level - 1].badge,
      mintDate: new Date().toISOString(),
      attributes: {
        depositsCount: this.getStoredDepositsCount(),
        daysActive: this.getStoredDaysActive(),
        withdrawalsCount: 0,
        totalYieldEarned: parseFloat(localStorage.getItem('total_yield') || "0")
      }
    }
  }

  // Loan Protocol Methods
  async checkLoanEligibility(trustLevel: number): Promise<{
    eligible: boolean
    maxAmount: number
    interestRate: string
  }> {
    if (trustLevel < 3) {
      return {
        eligible: false,
        maxAmount: 0,
        interestRate: "0%"
      }
    }
    
    const maxAmount = trustLevel === 3 ? 100 : 500
    const interestRate = trustLevel === 3 ? "5%" : "3%"
    
    return {
      eligible: true,
      maxAmount,
      interestRate
    }
  }

  async requestMicroLoan(amount: number, duration: number): Promise<{
    approved: boolean
    loanId?: string
    transactionHash?: string
  }> {
    // Simulate loan approval process
    const loanId = "loan_" + Math.random().toString(36).substring(2)
    const txHash = "0x" + Math.random().toString(16).substring(2, 66)
    
    return {
      approved: true,
      loanId,
      transactionHash: txHash
    }
  }

  // Helper methods
  private encodeDepositData(amount: number): string {
    // Simulate encoding function call data for DeFi deposit
    return "0x" + Math.random().toString(16).substring(2, 66)
  }

  private verifyPassphrase(passphrase: string): boolean {
    // In a real implementation, this would verify the voice passphrase
    // For demo, accept any non-empty passphrase
    return passphrase && passphrase.length > 0
  }

  private getStoredDepositsCount(): number {
    return parseInt(localStorage.getItem('deposits_count') || "7")
  }

  private getStoredDaysActive(): number {
    return parseInt(localStorage.getItem('days_active') || "45")
  }

  // Update stored metrics
  updateDepositsCount(count: number): void {
    localStorage.setItem('deposits_count', count.toString())
  }

  updateDaysActive(days: number): void {
    localStorage.setItem('days_active', days.toString())
  }

  updateTotalYield(yield: number): void {
    localStorage.setItem('total_yield', yield.toString())
  }
}

export const blockchainService = BlockchainService.getInstance()