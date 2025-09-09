"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft, Mic, MicOff, Send, History, Wallet, TrendingUp, Shield, 
  CheckCircle, Clock, DollarSign, Zap, Award, Star, Lock, Unlock,
  Volume2, Eye, ArrowUpRight, ArrowDownLeft, PiggyBank, CreditCard,
  Target, Trophy, Coins, Banknote, Sparkles, Crown, Gem
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech"
import { useAccessibility } from "@/components/AccessibilityWrapper"
import Link from "next/link"

// Mock data for DeFi protocols
const defiProtocols = [
  { name: "Mento Protocol", apy: "8.5%", tvl: "$2.4M", risk: "Low", description: "Stable savings on Celo" },
  { name: "Compound", apy: "6.2%", tvl: "$1.8B", risk: "Medium", description: "Decentralized lending" },
  { name: "Aave", apy: "7.1%", tvl: "$5.2B", risk: "Medium", description: "Liquidity protocol" }
]

// Trust Passport levels
const trustLevels = [
  { name: "New User", minSavings: 0, maxLoan: 0, badge: "🌱", color: "gray" },
  { name: "Reliable Saver", minSavings: 100, maxLoan: 75, badge: "⭐", color: "neon-green" },
  { name: "Trusted Member", minSavings: 500, maxLoan: 400, badge: "💎", color: "neon-cyan" },
  { name: "Elite Saver", minSavings: 1000, maxLoan: 800, badge: "👑", color: "neon-orange" }
]

export default function VoiceBankingPage() {
  // Core state
  const [balance, setBalance] = useState(1250.75)
  const [savingsBalance, setSavingsBalance] = useState(450.25)
  const [currentSubtitle, setCurrentSubtitle] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("wallet")
  
  // Voice state
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [lastCommand, setLastCommand] = useState("")
  
  // DeFi state
  const [selectedProtocol, setSelectedProtocol] = useState(defiProtocols[0])
  const [depositAmount, setDepositAmount] = useState("")
  const [loanAmount, setLoanAmount] = useState("")
  
  // Trust Passport state
  const [trustScore, setTrustScore] = useState(2) // Index in trustLevels
  const [hasPassport, setHasPassport] = useState(false)
  const [passportProgress, setPassportProgress] = useState(0)
  
  // Transaction history
  const [transactions, setTransactions] = useState([
    { id: 1, type: "deposit", amount: 100, protocol: "Mento Protocol", date: "2 hours ago", status: "earning", apy: "8.5%" },
    { id: 2, type: "deposit", amount: 200, protocol: "Mento Protocol", date: "1 day ago", status: "earning", apy: "8.5%" },
    { id: 3, type: "deposit", amount: 150, protocol: "Mento Protocol", date: "3 days ago", status: "earning", apy: "8.5%" }
  ])

  const { toast } = useToast()
  const router = useRouter()
  const { announce } = useAccessibility()
  const { isListening, transcript, isSupported: speechSupported, startListening, stopListening } = useSpeechRecognition()
  const { speak, isSupported: ttsSupported } = useSpeechSynthesis()

  // Welcome message
  useEffect(() => {
    if (voiceEnabled && ttsSupported) {
      const timer = setTimeout(() => {
        const welcomeMessage = `Welcome to your voice-controlled USDT wallet. Your balance is ${balance.toLocaleString()} USDT. You can save, earn, or ask about loans.`
        speak(welcomeMessage)
        setCurrentSubtitle(welcomeMessage)
        setTimeout(() => setCurrentSubtitle(""), 8000)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [voiceEnabled, ttsSupported])

  // Voice command processing
  useEffect(() => {
    if (transcript && transcript.toLowerCase() !== lastCommand) {
      const lowerCaseTranscript = transcript.toLowerCase()
      setLastCommand(lowerCaseTranscript)
      processVoiceCommand(lowerCaseTranscript)
    }
  }, [transcript])

  const processVoiceCommand = (command: string) => {
    let response = ""
    let action = ""

    if (command.includes("balance")) {
      response = `Your wallet balance is ${balance.toLocaleString()} USDT. Your savings balance is ${savingsBalance.toLocaleString()} USDT.`
      action = "Balance Check"
    } else if (command.includes("save") || command.includes("deposit")) {
      const amount = extractAmount(command)
      if (amount) {
        handleVoiceDeposit(amount)
        return
      } else {
        response = "How much USDT would you like to save? Say an amount like 'save 50 USDT'."
        action = "Savings Mode"
        setActiveTab("defi")
      }
    } else if (command.includes("loan") || command.includes("borrow")) {
      if (hasPassport) {
        const maxLoan = trustLevels[trustScore].maxLoan
        response = `Based on your Trust Passport, you can borrow up to ${maxLoan} USDT. How much would you like to borrow?`
        action = "Loan Available"
        setActiveTab("passport")
      } else {
        response = "You need a Trust Passport to access loans. Say 'create passport' to get started."
        action = "Passport Required"
        setActiveTab("passport")
      }
    } else if (command.includes("passport") || command.includes("trust")) {
      if (hasPassport) {
        const level = trustLevels[trustScore]
        response = `Your Trust Passport level is ${level.name}. You can borrow up to ${level.maxLoan} USDT.`
      } else {
        response = "Creating your Trust Passport by analyzing your savings history..."
        handleCreatePassport()
        return
      }
      action = "Trust Passport"
      setActiveTab("passport")
    } else if (command.includes("withdraw")) {
      response = "Withdrawal mode activated. How much would you like to withdraw from savings?"
      action = "Withdrawal Mode"
      setActiveTab("defi")
    } else if (command.includes("help")) {
      response = "Available commands: Check balance, Save money, Request loan, Create passport, or Withdraw savings."
      action = "Help"
    } else {
      response = "Command not recognized. Say 'help' for available commands."
      action = "Unknown Command"
    }

    if (voiceEnabled && ttsSupported && response) {
      speak(response)
      setCurrentSubtitle(response)
      setTimeout(() => setCurrentSubtitle(""), 6000)
    }
    
    toast({ title: action, description: response })
  }

  const extractAmount = (command: string) => {
    const match = command.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  }

  const handleVoiceDeposit = async (amount: number) => {
    if (amount > balance) {
      const message = "Insufficient balance for this deposit."
      speak(message)
      setCurrentSubtitle(message)
      toast({ title: "Insufficient Balance", description: message, variant: "destructive" })
      return
    }

    setIsProcessing(true)
    const message = `Preparing to deposit ${amount} USDT to ${selectedProtocol.name}. Say 'confirm' to authorize.`
    speak(message)
    setCurrentSubtitle(message)
    
    // Wait for confirmation
    setTimeout(() => {
      if (lastCommand.includes("confirm")) {
        executeDeposit(amount)
      } else {
        setIsProcessing(false)
        speak("Deposit cancelled. Say 'save' to try again.")
      }
    }, 5000)
  }

  const executeDeposit = async (amount: number) => {
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setBalance(prev => prev - amount)
      setSavingsBalance(prev => prev + amount)
      
      const newTransaction = {
        id: Date.now(),
        type: "deposit",
        amount,
        protocol: selectedProtocol.name,
        date: "Just now",
        status: "earning",
        apy: selectedProtocol.apy
      }
      setTransactions(prev => [newTransaction, ...prev])

      const successMessage = `Success! ${amount} USDT deposited to ${selectedProtocol.name}. Now earning ${selectedProtocol.apy} APY.`
      speak(successMessage)
      setCurrentSubtitle(successMessage)
      toast({ 
        title: "Deposit Successful!", 
        description: successMessage,
        className: "card-futuristic border-neon-green"
      })

      // Update trust score progress
      updateTrustProgress()
      
    } catch (error) {
      const errorMessage = "Deposit failed. Please try again."
      speak(errorMessage)
      toast({ title: "Deposit Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreatePassport = async () => {
    setIsProcessing(true)
    setPassportProgress(0)
    
    const steps = [
      "Analyzing on-chain savings behavior...",
      "Verifying transaction consistency...", 
      "Calculating trust score...",
      "Minting Soulbound Token...",
      "Trust Passport created successfully!"
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setPassportProgress((i + 1) * 20)
      
      const message = steps[i]
      speak(message)
      setCurrentSubtitle(message)
      
      if (i === steps.length - 1) {
        setHasPassport(true)
        const level = trustLevels[trustScore]
        const finalMessage = `Congratulations! You've earned the ${level.name} Trust Passport. You can now borrow up to ${level.maxLoan} USDT.`
        speak(finalMessage)
        setCurrentSubtitle(finalMessage)
        toast({
          title: "Trust Passport Created!",
          description: finalMessage,
          className: "card-futuristic border-neon-orange"
        })
      }
    }
    
    setIsProcessing(false)
  }

  const updateTrustProgress = () => {
    const totalSavings = savingsBalance + (depositAmount ? parseFloat(depositAmount) : 0)
    const newLevel = trustLevels.findIndex(level => totalSavings >= level.minSavings && totalSavings < (trustLevels[trustLevels.findIndex(l => l === level) + 1]?.minSavings || Infinity))
    if (newLevel > trustScore) {
      setTrustScore(newLevel)
      const level = trustLevels[newLevel]
      const message = `Trust level upgraded to ${level.name}! New loan limit: ${level.maxLoan} USDT.`
      speak(message)
      toast({ title: "Trust Level Up!", description: message, className: "card-futuristic border-neon-orange" })
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      if (!speechSupported) {
        toast({ title: "Speech Recognition Not Supported", variant: "destructive" })
        return
      }
      setCurrentSubtitle("Voice recognition active... Speak your command")
      startListening()
    }
  }

  const handleQuickDeposit = (amount: number) => {
    if (amount > balance) {
      const message = "Insufficient balance for this deposit."
      speak(message)
      toast({ title: "Insufficient Balance", description: message, variant: "destructive" })
      return
    }
    
    setDepositAmount(amount.toString())
    const message = `Ready to deposit ${amount} USDT to ${selectedProtocol.name}. Tap confirm to proceed.`
    speak(message)
    setCurrentSubtitle(message)
  }

  const handleLoanRequest = (amount: number) => {
    if (!hasPassport) {
      const message = "You need a Trust Passport to access loans. Create one first."
      speak(message)
      toast({ title: "Trust Passport Required", description: message, variant: "destructive" })
      return
    }

    const maxLoan = trustLevels[trustScore].maxLoan
    if (amount > maxLoan) {
      const message = `Maximum loan amount is ${maxLoan} USDT based on your Trust Passport level.`
      speak(message)
      toast({ title: "Loan Limit Exceeded", description: message, variant: "destructive" })
      return
    }

    setBalance(prev => prev + amount)
    const newTransaction = {
      id: Date.now(),
      type: "loan",
      amount,
      protocol: "Inkluziv Lending",
      date: "Just now",
      status: "active",
      apy: "12% APR"
    }
    setTransactions(prev => [newTransaction, ...prev])

    const message = `Loan approved! ${amount} USDT added to your wallet. Repayment terms: 12% APR.`
    speak(message)
    setCurrentSubtitle(message)
    toast({ 
      title: "Loan Approved!", 
      description: message,
      className: "card-futuristic border-neon-green"
    })
  }

  return (
    <div className="min-h-screen bg-surface scan-lines">
      {/* Live Captions */}
      {currentSubtitle && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-elevated/95 backdrop-blur-md border border-neon-cyan shadow-neon-cyan max-w-4xl rounded-lg">
          <div className="px-4 py-3">
            <p className="text-primary text-center font-medium font-mono text-lg">
              <Volume2 className="w-5 h-5 inline mr-3" />
              {currentSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 shadow-neon-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-neon-cyan hover:text-primary transition-colors font-mono">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="w-10 h-10 bg-neon-orange rounded-lg flex items-center justify-center shimmer">
              <Wallet className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient font-mono">VOICE DEFI WALLET</h1>
              <p className="text-sm text-neon-cyan font-mono">Speak to save, earn, and borrow</p>
            </div>
          </div>
          
          {/* Voice Control Button */}
          <Button
            onClick={handleVoiceToggle}
            disabled={!speechSupported}
            className={`w-14 h-14 rounded-full transition-smooth font-mono ${
              isListening
                ? "bg-error text-white pulse-recording border-2 border-error"
                : "btn-neon-cyan"
            }`}
            aria-label={isListening ? "Stop voice recognition" : "Activate voice recognition"}
          >
            <Mic className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* User Profile & Balance */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-futuristic">
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-neon-cyan shadow-neon-cyan">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-surface text-neon-cyan text-xl font-mono">KJ</AvatarFallback>
              </Avatar>
              <CardTitle className="text-primary font-mono">Kanyinsola</CardTitle>
              <CardDescription className="text-secondary font-mono">kanyinsola@gmail.com</CardDescription>
              {hasPassport && (
                <div className="flex justify-center mt-3">
                  <Badge className={`font-mono bg-${trustLevels[trustScore].color} text-black shadow-${trustLevels[trustScore].color}`}>
                    {trustLevels[trustScore].badge} {trustLevels[trustScore].name.toUpperCase()}
                  </Badge>
                </div>
              )}
            </CardHeader>
          </Card>

          <Card className="lg:col-span-3 card-futuristic">
            <CardHeader>
              <CardTitle className="text-primary text-2xl font-mono flex items-center">
                <DollarSign className="w-6 h-6 mr-3 text-neon-green" />
                WALLET OVERVIEW
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-secondary font-mono text-sm">WALLET BALANCE</p>
                  <p className="text-3xl font-bold text-neon-cyan font-mono">${balance.toLocaleString()}</p>
                  <p className="text-xs text-secondary font-mono">Available USDT</p>
                </div>
                <div className="text-center">
                  <p className="text-secondary font-mono text-sm">SAVINGS BALANCE</p>
                  <p className="text-3xl font-bold text-neon-green font-mono">${savingsBalance.toLocaleString()}</p>
                  <p className="text-xs text-secondary font-mono">Earning {selectedProtocol.apy}</p>
                </div>
                <div className="text-center">
                  <p className="text-secondary font-mono text-sm">TOTAL VALUE</p>
                  <p className="text-3xl font-bold text-neon-orange font-mono">${(balance + savingsBalance).toLocaleString()}</p>
                  <p className="text-xs text-secondary font-mono">Combined Portfolio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-surface-elevated border border-strong">
            <TabsTrigger value="wallet" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black font-mono">
              <Wallet className="w-4 h-4 mr-2" />
              WALLET
            </TabsTrigger>
            <TabsTrigger value="defi" className="data-[state=active]:bg-neon-green data-[state=active]:text-black font-mono">
              <TrendingUp className="w-4 h-4 mr-2" />
              DEFI SAVINGS
            </TabsTrigger>
            <TabsTrigger value="passport" className="data-[state=active]:bg-neon-orange data-[state=active]:text-black font-mono">
              <Award className="w-4 h-4 mr-2" />
              TRUST PASSPORT
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-neon-purple data-[state=active]:text-black font-mono">
              <History className="w-4 h-4 mr-2" />
              HISTORY
            </TabsTrigger>
          </TabsList>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="text-center mb-8">
              <Card className="card-futuristic p-8">
                <CardHeader>
                  <CardTitle className="text-4xl text-gradient font-mono mb-4">
                    ${balance.toLocaleString()} USDT
                  </CardTitle>
                  <CardDescription className="text-xl text-secondary font-mono">
                    Available Balance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <Button 
                      onClick={() => handleQuickDeposit(25)}
                      className="h-16 btn-neon-green font-mono"
                      disabled={isProcessing}
                    >
                      SAVE $25
                    </Button>
                    <Button 
                      onClick={() => handleQuickDeposit(50)}
                      className="h-16 btn-neon-green font-mono"
                      disabled={isProcessing}
                    >
                      SAVE $50
                    </Button>
                    <Button 
                      onClick={() => handleQuickDeposit(100)}
                      className="h-16 btn-neon-green font-mono"
                      disabled={isProcessing}
                    >
                      SAVE $100
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("defi")}
                      className="h-16 btn-neon-cyan font-mono"
                    >
                      CUSTOM
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* DeFi Savings Tab */}
          <TabsContent value="defi" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Deposit Section */}
              <Card className="card-futuristic">
                <CardHeader>
                  <CardTitle className="text-primary text-2xl font-mono flex items-center">
                    <PiggyBank className="w-6 h-6 mr-3 text-neon-green" />
                    EARN WITH DEFI
                  </CardTitle>
                  <CardDescription className="text-secondary font-mono">
                    Put your USDT to work in decentralized protocols
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Protocol Selection */}
                  <div className="space-y-3">
                    <Label className="text-primary font-mono">SELECT PROTOCOL</Label>
                    {defiProtocols.map((protocol, index) => (
                      <div 
                        key={index}
                        onClick={() => setSelectedProtocol(protocol)}
                        className={`p-4 rounded-lg border cursor-pointer transition-smooth ${
                          selectedProtocol.name === protocol.name 
                            ? 'border-neon-green bg-neon-green/10' 
                            : 'border-strong bg-surface hover:border-neon-green/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-primary font-mono font-semibold">{protocol.name}</h4>
                            <p className="text-secondary text-sm font-mono">{protocol.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-neon-green font-mono font-bold">{protocol.apy}</p>
                            <p className="text-xs text-secondary font-mono">{protocol.risk} Risk</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Deposit Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="deposit-amount" className="text-primary font-mono">DEPOSIT AMOUNT (USDT)</Label>
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="bg-surface border-border text-primary focus:border-neon-green font-mono"
                    />
                  </div>

                  <Button 
                    onClick={() => depositAmount && executeDeposit(parseFloat(depositAmount))}
                    disabled={!depositAmount || isProcessing || parseFloat(depositAmount) > balance}
                    className="w-full btn-neon-green font-mono h-12"
                  >
                    {isProcessing ? "PROCESSING..." : `DEPOSIT TO ${selectedProtocol.name.toUpperCase()}`}
                  </Button>
                </CardContent>
              </Card>

              {/* Current Savings */}
              <Card className="card-futuristic">
                <CardHeader>
                  <CardTitle className="text-primary text-2xl font-mono flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-neon-cyan" />
                    ACTIVE SAVINGS
                  </CardTitle>
                  <CardDescription className="text-secondary font-mono">
                    Your funds earning in DeFi protocols
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <p className="text-4xl font-bold text-neon-green font-mono mb-2">
                      ${savingsBalance.toLocaleString()}
                    </p>
                    <p className="text-secondary font-mono">Total Savings</p>
                    <p className="text-neon-green font-mono text-sm">
                      Earning {selectedProtocol.apy} APY
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-surface rounded-lg">
                      <span className="text-primary font-mono">Daily Earnings</span>
                      <span className="text-neon-green font-mono">+$0.95</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-surface rounded-lg">
                      <span className="text-primary font-mono">Monthly Projection</span>
                      <span className="text-neon-green font-mono">+$28.50</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline"
                    className="w-full mt-6 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black font-mono"
                  >
                    WITHDRAW SAVINGS
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trust Passport Tab */}
          <TabsContent value="passport" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Trust Passport Status */}
              <Card className="card-futuristic">
                <CardHeader>
                  <CardTitle className="text-primary text-2xl font-mono flex items-center">
                    <Award className="w-6 h-6 mr-3 text-neon-orange" />
                    TRUST PASSPORT
                  </CardTitle>
                  <CardDescription className="text-secondary font-mono">
                    Your on-chain financial reputation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {hasPassport ? (
                    <div className="text-center">
                      <div className={`w-24 h-24 mx-auto mb-4 bg-${trustLevels[trustScore].color} rounded-full flex items-center justify-center shadow-${trustLevels[trustScore].color} shimmer`}>
                        <span className="text-4xl">{trustLevels[trustScore].badge}</span>
                      </div>
                      <h3 className="text-xl font-bold text-primary font-mono mb-2">
                        {trustLevels[trustScore].name}
                      </h3>
                      <p className="text-secondary font-mono mb-4">
                        Loan Limit: ${trustLevels[trustScore].maxLoan} USDT
                      </p>
                      
                      {/* Trust Score Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-mono">
                          <span className="text-secondary">Trust Progress</span>
                          <span className="text-neon-orange">{Math.min(trustScore + 1, trustLevels.length)}/{trustLevels.length}</span>
                        </div>
                        <Progress 
                          value={(trustScore / (trustLevels.length - 1)) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-600 rounded-full flex items-center justify-center">
                        <Lock className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-primary font-mono mb-2">
                        No Trust Passport
                      </h3>
                      <p className="text-secondary font-mono mb-6">
                        Create your on-chain reputation to unlock loans
                      </p>
                      
                      {isProcessing ? (
                        <div className="space-y-4">
                          <Progress value={passportProgress} className="h-3" />
                          <p className="text-neon-orange font-mono text-sm">
                            Creating Trust Passport... {passportProgress}%
                          </p>
                        </div>
                      ) : (
                        <Button 
                          onClick={handleCreatePassport}
                          className="btn-neon-orange font-mono"
                          disabled={savingsBalance < 50}
                        >
                          CREATE TRUST PASSPORT
                        </Button>
                      )}
                      
                      {savingsBalance < 50 && (
                        <p className="text-xs text-secondary font-mono mt-2">
                          Minimum $50 in savings required
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lending Section */}
              <Card className="card-futuristic">
                <CardHeader>
                  <CardTitle className="text-primary text-2xl font-mono flex items-center">
                    <CreditCard className="w-6 h-6 mr-3 text-neon-purple" />
                    MICRO LOANS
                  </CardTitle>
                  <CardDescription className="text-secondary font-mono">
                    Borrow against your Trust Passport
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {hasPassport ? (
                    <div>
                      <div className="text-center mb-6">
                        <p className="text-secondary font-mono text-sm">AVAILABLE CREDIT</p>
                        <p className="text-3xl font-bold text-neon-purple font-mono">
                          ${trustLevels[trustScore].maxLoan}
                        </p>
                        <p className="text-xs text-secondary font-mono">12% APR</p>
                      </div>

                      <div className="space-y-2 mb-4">
                        <Label htmlFor="loan-amount" className="text-primary font-mono">LOAN AMOUNT (USDT)</Label>
                        <Input
                          id="loan-amount"
                          type="number"
                          placeholder="Enter amount"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value)}
                          max={trustLevels[trustScore].maxLoan}
                          className="bg-surface border-border text-primary focus:border-neon-purple font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[25, 50, trustLevels[trustScore].maxLoan].map((amount) => (
                          <Button
                            key={amount}
                            onClick={() => handleLoanRequest(amount)}
                            variant="outline"
                            className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black font-mono"
                            disabled={amount > trustLevels[trustScore].maxLoan}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>

                      <Button 
                        onClick={() => loanAmount && handleLoanRequest(parseFloat(loanAmount))}
                        disabled={!loanAmount || parseFloat(loanAmount) > trustLevels[trustScore].maxLoan}
                        className="w-full btn-neon-purple font-mono h-12"
                      >
                        REQUEST LOAN
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-600 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-secondary font-mono mb-4">
                        Trust Passport required for loans
                      </p>
                      <Button 
                        onClick={() => setActiveTab("passport")}
                        variant="outline"
                        className="border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black font-mono"
                      >
                        CREATE PASSPORT
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Trust Levels Guide */}
            <Card className="card-futuristic">
              <CardHeader>
                <CardTitle className="text-primary text-xl font-mono flex items-center">
                  <Target className="w-5 h-5 mr-2 text-neon-cyan" />
                  TRUST LEVELS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {trustLevels.map((level, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border text-center ${
                        index === trustScore && hasPassport
                          ? `border-${level.color} bg-${level.color}/10`
                          : 'border-strong bg-surface'
                      }`}
                    >
                      <div className="text-2xl mb-2">{level.badge}</div>
                      <h4 className="text-primary font-mono font-semibold text-sm mb-1">
                        {level.name}
                      </h4>
                      <p className="text-xs text-secondary font-mono mb-2">
                        ${level.minSavings}+ savings
                      </p>
                      <p className="text-xs text-neon-green font-mono">
                        ${level.maxLoan} loan limit
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction History */}
          <TabsContent value="history" className="space-y-6">
            <Card className="card-futuristic">
              <CardHeader>
                <CardTitle className="text-primary text-2xl font-mono flex items-center">
                  <History className="w-6 h-6 mr-3 text-neon-purple" />
                  TRANSACTION HISTORY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="flex items-center justify-between p-4 bg-surface rounded-lg border border-strong hover:border-neon-cyan transition-smooth"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          tx.type === 'deposit' ? 'bg-neon-green shadow-neon-green' :
                          tx.type === 'loan' ? 'bg-neon-purple shadow-neon-purple' :
                          'bg-neon-cyan shadow-neon-cyan'
                        }`}>
                          {tx.type === 'deposit' ? <TrendingUp className="w-6 h-6 text-black" /> :
                           tx.type === 'loan' ? <CreditCard className="w-6 h-6 text-black" /> :
                           <Send className="w-6 h-6 text-black" />}
                        </div>
                        <div>
                          <p className="text-primary font-semibold font-mono">
                            {tx.type === 'deposit' ? 'DeFi Deposit' :
                             tx.type === 'loan' ? 'Micro Loan' : 'Transfer'}
                          </p>
                          <p className="text-secondary text-sm font-mono">{tx.protocol}</p>
                          <p className="text-xs text-secondary font-mono">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold font-mono ${
                          tx.type === 'loan' ? 'text-neon-purple' : 'text-neon-green'
                        }`}>
                          {tx.type === 'loan' ? '+' : '-'}${tx.amount}
                        </p>
                        <p className="text-xs text-secondary font-mono">
                          {tx.status === 'earning' ? `Earning ${tx.apy}` : 
                           tx.status === 'active' ? `${tx.apy} APR` : tx.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Voice Commands Help */}
        <Card className="card-futuristic mt-8">
          <CardHeader>
            <CardTitle className="text-primary font-mono flex items-center">
              <Mic className="w-5 h-5 mr-2 text-neon-cyan" />
              VOICE COMMANDS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm font-mono">
              <div>
                <h4 className="text-neon-green font-semibold mb-2">SAVINGS</h4>
                <ul className="text-secondary space-y-1">
                  <li>"Save 50 USDT"</li>
                  <li>"Check balance"</li>
                  <li>"Withdraw savings"</li>
                </ul>
              </div>
              <div>
                <h4 className="text-neon-orange font-semibold mb-2">TRUST PASSPORT</h4>
                <ul className="text-secondary space-y-1">
                  <li>"Create passport"</li>
                  <li>"Check trust level"</li>
                  <li>"Loan eligibility"</li>
                </ul>
              </div>
              <div>
                <h4 className="text-neon-purple font-semibold mb-2">LOANS</h4>
                <ul className="text-secondary space-y-1">
                  <li>"Request loan"</li>
                  <li>"Borrow 25 USDT"</li>
                  <li>"Check loan limit"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}