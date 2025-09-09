// Natural Language Understanding for Voice DeFi Commands
export interface VoiceIntent {
  intent: string
  confidence: number
  parameters: Record<string, any>
  response: string
}

export interface DeFiCommand {
  action: 'deposit' | 'withdraw' | 'check_balance' | 'check_yield' | 'request_loan' | 'check_passport'
  amount?: number
  protocol?: string
  token?: string
}

export class VoiceNLU {
  private static instance: VoiceNLU
  
  public static getInstance(): VoiceNLU {
    if (!VoiceNLU.instance) {
      VoiceNLU.instance = new VoiceNLU()
    }
    return VoiceNLU.instance
  }

  async processCommand(transcript: string): Promise<VoiceIntent> {
    const cleanTranscript = transcript.toLowerCase().trim()
    
    // Deposit/Save commands
    if (this.matchesPattern(cleanTranscript, ['save', 'deposit', 'invest', 'put'])) {
      return this.handleDepositCommand(cleanTranscript)
    }
    
    // Withdraw commands
    if (this.matchesPattern(cleanTranscript, ['withdraw', 'take out', 'remove'])) {
      return this.handleWithdrawCommand(cleanTranscript)
    }
    
    // Balance check
    if (this.matchesPattern(cleanTranscript, ['balance', 'how much', 'total'])) {
      return {
        intent: 'check_balance',
        confidence: 0.9,
        parameters: {},
        response: "Checking your current balance and yield earnings."
      }
    }
    
    // Yield check
    if (this.matchesPattern(cleanTranscript, ['yield', 'earnings', 'profit', 'returns'])) {
      return {
        intent: 'check_yield',
        confidence: 0.9,
        parameters: {},
        response: "Displaying your yield earnings from DeFi protocols."
      }
    }
    
    // Trust passport
    if (this.matchesPattern(cleanTranscript, ['passport', 'trust', 'reputation', 'level'])) {
      return {
        intent: 'check_passport',
        confidence: 0.9,
        parameters: {},
        response: "Showing your on-chain trust passport and reputation level."
      }
    }
    
    // Loan requests
    if (this.matchesPattern(cleanTranscript, ['loan', 'borrow', 'lend', 'credit'])) {
      return this.handleLoanCommand(cleanTranscript)
    }
    
    // Default fallback
    return {
      intent: 'unknown',
      confidence: 0.1,
      parameters: {},
      response: "I didn't understand that command. Try saying 'save 50 USDT' or 'check my balance'."
    }
  }

  private handleDepositCommand(transcript: string): VoiceIntent {
    const amount = this.extractAmount(transcript)
    const protocol = this.extractProtocol(transcript)
    
    if (amount) {
      return {
        intent: 'deposit',
        confidence: 0.95,
        parameters: { 
          amount, 
          protocol: protocol || 'celo-mento',
          token: 'USDT'
        },
        response: `Preparing to deposit ${amount} USDT into ${protocol || 'Celo Mento'} protocol. Say 'confirm' to proceed.`
      }
    }
    
    return {
      intent: 'deposit',
      confidence: 0.7,
      parameters: { protocol: protocol || 'celo-mento' },
      response: "How much USDT would you like to save? Say an amount like '50 USDT'."
    }
  }

  private handleWithdrawCommand(transcript: string): VoiceIntent {
    const amount = this.extractAmount(transcript)
    
    return {
      intent: 'withdraw',
      confidence: 0.9,
      parameters: { amount },
      response: amount 
        ? `Preparing to withdraw ${amount} USDT from your DeFi positions. Say 'confirm' to proceed.`
        : "How much would you like to withdraw? Say an amount like 'withdraw 25 USDT'."
    }
  }

  private handleLoanCommand(transcript: string): VoiceIntent {
    const amount = this.extractAmount(transcript)
    
    return {
      intent: 'request_loan',
      confidence: 0.9,
      parameters: { amount },
      response: amount
        ? `Checking your eligibility for a ${amount} USDT loan based on your trust passport.`
        : "Checking your loan eligibility based on your trust passport level."
    }
  }

  private extractAmount(text: string): number | null {
    // Match patterns like "50", "50 USDT", "fifty", etc.
    const numberMatch = text.match(/(\d+(?:\.\d+)?)/);
    if (numberMatch) {
      return parseFloat(numberMatch[1])
    }
    
    // Handle written numbers
    const writtenNumbers: Record<string, number> = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'ten': 10, 'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
      'hundred': 100, 'thousand': 1000
    }
    
    for (const [word, value] of Object.entries(writtenNumbers)) {
      if (text.includes(word)) {
        return value
      }
    }
    
    return null
  }

  private extractProtocol(text: string): string | null {
    if (text.includes('mento') || text.includes('celo')) return 'celo-mento'
    if (text.includes('ubeswap') || text.includes('ube')) return 'ubeswap'
    if (text.includes('moola')) return 'moola'
    return null
  }

  private matchesPattern(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword))
  }
}

export const voiceNLU = VoiceNLU.getInstance()