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
import {
  Mic, MicOff, TrendingUp, Award, ArrowUpRight, ArrowDownLeft, 
  Coins, Shield, Volume2, LogOut, Wallet, Eye, Lock, 
  CheckCircle, Star, Trophy, Target, Zap, Timer
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech"
import { useAccessibility } from "@/components/AccessibilityWrapper"
import Link from "next/link"

// Mock DeFi data
const defiProtocols = [
  { name: "Celo Mento", apy: "8.5%", tvl: "$2.1M", risk: "Low", color: "neon-green" },
  { name: "Ubeswap", apy: "12.3%", tvl: "$850K", risk: "Medium", color: "neon-cyan" },
  { name: "Moola Market", apy: "6.8%", tvl: "$1.5M", risk: "Low", color: "neon-purple" }
]

const trustPassportLevels = [
  { level: 1, name: "New Saver", requirement: "First deposit", badge: "🌱", unlocks: "Basic yield farming" },
  { level: 2, name: "Consistent Saver", requirement: "5 deposits, no withdrawals", badge: "⭐", unlocks: "Premium protocols" },
  { level: 3, name: "Reliable Saver", requirement: "10 deposits, 30 days", badge: "🏆", unlocks: "Micro-loans up to 100 USDT" },
  { level: 4, name: "DeFi Expert", requirement: "50 deposits, 90 days", badge: "💎", unlocks: "Advanced lending, 500 USDT loans" }
]

export default function VoiceDeFiPage() {
  // State management
  const [activeTab, setActiveTab] = useState("defi")
  const [balance, setBalance] = useState(1250.75)
  const [yieldEarned, setYieldEarned] = useState(45.32)
  const [totalDeposited, setTotalDeposited] = useState(800.00)
  const [currentSubtitle, setCurrentSubtitle] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [selectedProtocol, setSelectedProtocol] = useState(defiProtocols[0])
  
  // Trust Passport state
  const [trustLevel, setTrustLevel] = useState(2)
  const [depositsCount, setDepositsCount] = useState(7)
  const [daysActive, setDaysActive] = useState(45)
  const [hasPassport, setHasPassport] = useState(true)
  
  // Voice state
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [lastCommand, setLastCommand] = useState("")

  const { toast } = useToast()
  const router = useRouter()
  const { announce } = useAccessibility()
  const { isListening, transcript, isSupported: speechSupported, startListening, stopListening } = useSpeechRecognition()
  const { speak, isSupported: ttsSupported } = useSpeechSynthesis()

  // Welcome message
  useEffect(() => {
    if (voiceEnabled && ttsSupported) {
      const timer = setTimeout(() => {
        const welcomeMessage = `Welcome to your DeFi gateway. Your balance is ${balance.toLocaleString()} USDT. You've earned ${yieldEarned} USDT in yield. Say 'save money' to deposit into high-yield protocols.`
        speak(welcomeMessage)
        if (currentSubtitle) {
          setCurrentSubtitle(welcomeMessage)
          setTimeout(() => setCurrentSubtitle(""), 10000)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

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

    if (command.includes("save") || command.includes("deposit")) {
      // Extract amount if mentioned
      const amountMatch = command.match(/(\d+)/)
      if (amountMatch) {
        const amount = amountMatch[1]
        setDepositAmount(amount)
        response = `Preparing to deposit ${amount} USDT into ${selectedProtocol.name} protocol with ${selectedProtocol.apy} APY. Say 'confirm' to proceed.`
        action = "Deposit Prepared"
      } else {
        response = "How much USDT would you like to save? Say an amount like 'save 50 USDT'."
        action = "Deposit Mode"
      }
      setActiveTab("defi")
    } else if (command.includes("confirm") && depositAmount) {
      handleVoiceDeposit()
      return
    } else if (command.includes("balance") || command.includes("yield")) {
      response = `Your balance is ${balance.toLocaleString()} USDT. You've earned ${yieldEarned} USDT in yield from DeFi protocols.`
      action = "Balance Check"
    } else if (command.includes("passport") || command.includes("trust")) {
      response = `You are a ${trustPassportLevels[trustLevel - 1].name} with ${depositsCount} deposits over ${daysActive} days. Your trust passport unlocks ${trustPassportLevels[trustLevel - 1].unlocks}.`
      action = "Trust Passport"
      setActiveTab("passport")
    } else if (command.includes("loan") || command.includes("borrow")) {
      if (trustLevel >= 3) {
        response = `Based on your trust passport, you're eligible for a micro-loan up to ${trustLevel === 3 ? '100' : '500'} USDT. Say 'request loan' to proceed.`
        action = "Loan Available"
      } else {
        response = "You need to reach Reliable Saver level to access loans. Keep saving consistently!"
        action = "Loan Unavailable"
      }
    } else if (command.includes("help")) {
      response = "Available commands: Save money, Check balance, View passport, Request loan, or say help."
      action = "Help"
    } else {
      response = "Command not recognized. Say 'help' for available commands."
      action = "Unknown Command"
    }

    if (voiceEnabled && ttsSupported) speak(response)
    announce(response)
    setCurrentSubtitle(response)
    setTimeout(() => setCurrentSubtitle(""), 6000)
    toast({ title: action, description: response })
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      if (!speechSupported) {
        toast({ title: "Speech Recognition Not Supported", variant: "destructive" })
        return
      }
      setCurrentSubtitle("Voice recognition active... Say your DeFi command")
      startListening()
    }
  }

  const handleVoiceDeposit = async () => {
    if (!depositAmount) return
    
    setIsProcessing(true)
    const amount = parseFloat(depositAmount)
    
    if (amount > balance) {
      const message = "Insufficient balance for this deposit."
      speak(message)
      setCurrentSubtitle(message)
      toast({ title: "Deposit Failed", description: message, variant: "destructive" })
      setIsProcessing(false)
      return
    }

    // Simulate DeFi deposit
    setTimeout(() => {
      setBalance(prev => prev - amount)
      setTotalDeposited(prev => prev + amount)
      setDepositsCount(prev => prev + 1)
      
      // Check for trust passport upgrade
      if (depositsCount >= 9 && trustLevel < 3) {
        setTrustLevel(3)
        const upgradeMessage = "Congratulations! You've earned the Reliable Saver trust passport and unlocked micro-loans!"
        speak(upgradeMessage)
        toast({ title: "Trust Passport Upgraded!", description: upgradeMessage })
      }
      
      const message = `Successfully deposited ${amount} USDT into ${selectedProtocol.name}. Now earning ${selectedProtocol.apy} APY.`
      speak(message)
      setCurrentSubtitle(message)
      toast({ title: "Deposit Successful", description: message })
      
      setDepositAmount("")
      setIsProcessing(false)
    }, 3000)
  }

  const handleQuickDeposit = (amount: number) => {
    setDepositAmount(amount.toString())
    const message = `Preparing to deposit ${amount} USDT into ${selectedProtocol.name}. Say 'confirm' to proceed.`
    speak(message)
    setCurrentSubtitle(message)
    toast({ title: "Deposit Prepared", description: message })
  }

  const calculateProgress = () => {
    const currentLevel = trustPassportLevels[trustLevel - 1]
    const nextLevel = trustPassportLevels[trustLevel]
    
    if (!nextLevel) return 100
    
    if (trustLevel === 1) return (depositsCount / 5) * 100
    if (trustLevel === 2) return (depositsCount / 10) * 100
    if (trustLevel === 3) return (depositsCount / 50) * 100
    
    return 100
  }

  return (
    <div className="min-h-screen bg-surface scan-lines">
      {/* Header */}
      <header className="bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 shadow-neon-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-neon-orange rounded-lg flex items-center justify-center shimmer">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient font-mono">INKLUZIV DEFI</h1>
              <span className="text-secondary text-sm font-mono">Voice-Powered Yield</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/")} className="border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black bg-transparent transition-smooth font-mono">
              <LogOut className="w-4 h-4 mr-2" />
              EXIT
            </Button>
          </div>
        </div>
      </header>

      {/* Live Captions */}
      {currentSubtitle && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-elevated/95 backdrop-blur-md border border-neon-cyan shadow-neon-cyan container max-w-4xl rounded-lg">
          <div className="px-4 py-3">
            <p className="text-primary text-center font-medium font-mono text-lg">
              <Volume2 className="w-5 h-5 inline mr-3" />
              {currentSubtitle}
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-futuristic transition-smooth mb-4">
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-neon-cyan rounded-full flex items-center justify-center shadow-neon-cyan">
                  <Wallet className="w-10 h-10 text-black" />
                </div>
                <CardTitle className="text-primary font-mono">DeFi Wallet</CardTitle>
                <CardDescription className="text-secondary font-mono">Voice-Controlled</CardDescription>
                <div className="flex justify-center mt-3">
                  <Badge className="bg-neon-green text-black shadow-neon-green font-mono">
                    EARNING YIELD
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Trust Passport Card */}
            <Card className="card-futuristic transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg text-primary font-mono flex items-center">
                  <Award className="w-5 h-5 mr-2 text-neon-orange" />
                  TRUST PASSPORT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">{trustPassportLevels[trustLevel - 1].badge}</div>
                  <h3 className="text-lg font-bold text-primary">{trustPassportLevels[trustLevel - 1].name}</h3>
                  <p className="text-sm text-secondary">{depositsCount} deposits • {daysActive} days</p>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
                <p className="text-xs text-secondary text-center">
                  {trustLevel < 4 ? `Next: ${trustPassportLevels[trustLevel].name}` : "Max Level Reached!"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Voice Control */}
            <div className="text-center mb-8">
              <Button 
                onClick={handleVoiceToggle} 
                disabled={!speechSupported || isProcessing} 
                size="lg" 
                className={`w-32 h-32 rounded-full text-xl transition-smooth font-mono ${
                  isListening 
                    ? "bg-error text-white pulse-recording border-2 border-error" 
                    : "btn-neon-cyan"
                }`}
              >
                {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
              </Button>
              <div className="mt-4">
                <p className="text-secondary text-lg font-mono">
                  {isListening ? "LISTENING FOR DEFI COMMANDS..." : "TAP TO SPEAK"}
                </p>
                {transcript && (
                  <p className="text-neon-cyan font-medium mt-2 font-mono">
                    COMMAND: "{transcript}"
                  </p>
                )}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-surface-elevated border border-strong">
                <TabsTrigger value="defi" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black font-mono">
                  DEFI GATEWAY
                </TabsTrigger>
                <TabsTrigger value="passport" className="data-[state=active]:bg-neon-orange data-[state=active]:text-black font-mono">
                  TRUST PASSPORT
                </TabsTrigger>
                <TabsTrigger value="loans" className="data-[state=active]:bg-neon-purple data-[state=active]:text-black font-mono">
                  MICRO LOANS
                </TabsTrigger>
              </TabsList>

              {/* DeFi Gateway Tab */}
              <TabsContent value="defi" className="space-y-6">
                {/* Balance Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="card-futuristic">
                    <CardHeader className="text-center">
                      <CardTitle className="text-secondary text-lg font-mono">WALLET BALANCE</CardTitle>
                      <div className="text-3xl font-bold text-gradient font-mono">
                        {balance.toLocaleString()} USDT
                      </div>
                    </CardHeader>
                  </Card>
                  <Card className="card-futuristic">
                    <CardHeader className="text-center">
                      <CardTitle className="text-secondary text-lg font-mono">YIELD EARNED</CardTitle>
                      <div className="text-3xl font-bold text-neon-green font-mono">
                        +{yieldEarned} USDT
                      </div>
                    </CardHeader>
                  </Card>
                  <Card className="card-futuristic">
                    <CardHeader className="text-center">
                      <CardTitle className="text-secondary text-lg font-mono">TOTAL DEPOSITED</CardTitle>
                      <div className="text-3xl font-bold text-neon-cyan font-mono">
                        {totalDeposited.toLocaleString()} USDT
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                {/* DeFi Protocols */}
                <Card className="card-futuristic">
                  <CardHeader>
                    <CardTitle className="text-primary text-2xl font-mono flex items-center">
                      <TrendingUp className="w-6 h-6 mr-3 text-neon-green" />
                      HIGH-YIELD PROTOCOLS
                    </CardTitle>
                    <CardDescription className="text-secondary font-mono">
                      Earn yield on your USDT through voice commands
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {defiProtocols.map((protocol, index) => (
                      <div 
                        key={index}
                        onClick={() => setSelectedProtocol(protocol)}
                        className={`p-4 rounded-lg border cursor-pointer transition-smooth ${
                          selectedProtocol.name === protocol.name 
                            ? `border-${protocol.color} bg-${protocol.color}/10` 
                            : 'border-strong hover:border-neon-cyan'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-lg font-bold text-primary font-mono">{protocol.name}</h4>
                            <p className="text-sm text-secondary">TVL: {protocol.tvl} • Risk: {protocol.risk}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold text-${protocol.color} font-mono`}>
                              {protocol.apy}
                            </div>
                            <p className="text-xs text-secondary">APY</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Deposit Interface */}
                <Card className="card-futuristic">
                  <CardHeader>
                    <CardTitle className="text-primary text-xl font-mono">
                      VOICE DEPOSIT TO {selectedProtocol.name.toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-primary font-mono">Amount (USDT)</Label>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="bg-surface border-border text-primary font-mono"
                        />
                      </div>
                      <div>
                        <Label className="text-primary font-mono">Expected APY</Label>
                        <div className={`text-2xl font-bold text-${selectedProtocol.color} font-mono mt-2`}>
                          {selectedProtocol.apy}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3">
                      {[10, 25, 50, 100].map((amount) => (
                        <Button
                          key={amount}
                          onClick={() => handleQuickDeposit(amount)}
                          className="btn-neon-green font-mono"
                          disabled={isProcessing}
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>

                    <Button
                      onClick={handleVoiceDeposit}
                      disabled={!depositAmount || isProcessing}
                      className="w-full btn-neon-cyan font-mono text-lg py-3"
                    >
                      {isProcessing ? "DEPOSITING..." : `DEPOSIT ${depositAmount || "0"} USDT`}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trust Passport Tab */}
              <TabsContent value="passport" className="space-y-6">
                <Card className="card-futuristic">
                  <CardHeader>
                    <CardTitle className="text-primary text-2xl font-mono flex items-center">
                      <Award className="w-6 h-6 mr-3 text-neon-orange" />
                      ON-CHAIN TRUST PASSPORT
                    </CardTitle>
                    <CardDescription className="text-secondary font-mono">
                      Your Soulbound Token proving DeFi reliability
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Level */}
                    <div className="text-center p-6 bg-surface rounded-lg border border-strong">
                      <div className="text-6xl mb-4">{trustPassportLevels[trustLevel - 1].badge}</div>
                      <h3 className="text-2xl font-bold text-primary mb-2">{trustPassportLevels[trustLevel - 1].name}</h3>
                      <p className="text-secondary mb-4">{trustPassportLevels[trustLevel - 1].unlocks}</p>
                      <div className="flex justify-center space-x-6 text-sm">
                        <div>
                          <div className="text-neon-cyan font-bold text-lg">{depositsCount}</div>
                          <div className="text-secondary">Deposits</div>
                        </div>
                        <div>
                          <div className="text-neon-green font-bold text-lg">{daysActive}</div>
                          <div className="text-secondary">Days Active</div>
                        </div>
                        <div>
                          <div className="text-neon-orange font-bold text-lg">0</div>
                          <div className="text-secondary">Withdrawals</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress to Next Level */}
                    {trustLevel < 4 && (
                      <div className="p-4 bg-surface rounded-lg border border-strong">
                        <h4 className="text-lg font-bold text-primary mb-3">Progress to {trustPassportLevels[trustLevel].name}</h4>
                        <Progress value={calculateProgress()} className="h-3 mb-2" />
                        <p className="text-sm text-secondary">
                          {trustPassportLevels[trustLevel].requirement}
                        </p>
                      </div>
                    )}

                    {/* All Levels */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-bold text-primary">All Trust Levels</h4>
                      {trustPassportLevels.map((level, index) => (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg border transition-smooth ${
                            index + 1 <= trustLevel 
                              ? 'border-neon-green bg-neon-green/10' 
                              : 'border-strong'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{level.badge}</div>
                            <div className="flex-1">
                              <h5 className="font-bold text-primary">{level.name}</h5>
                              <p className="text-sm text-secondary">{level.requirement}</p>
                              <p className="text-xs text-neon-cyan">{level.unlocks}</p>
                            </div>
                            {index + 1 <= trustLevel && (
                              <CheckCircle className="w-6 h-6 text-neon-green" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Micro Loans Tab */}
              <TabsContent value="loans" className="space-y-6">
                <Card className="card-futuristic">
                  <CardHeader>
                    <CardTitle className="text-primary text-2xl font-mono flex items-center">
                      <Shield className="w-6 h-6 mr-3 text-neon-purple" />
                      MICRO LOANS
                    </CardTitle>
                    <CardDescription className="text-secondary font-mono">
                      Access loans based on your trust passport
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {trustLevel >= 3 ? (
                      <div className="space-y-4">
                        <div className="p-6 bg-neon-green/10 rounded-lg border border-neon-green/30">
                          <div className="flex items-center space-x-3 mb-4">
                            <CheckCircle className="w-6 h-6 text-neon-green" />
                            <h4 className="text-lg font-bold text-primary">LOAN APPROVED</h4>
                          </div>
                          <p className="text-secondary mb-4">
                            Based on your {trustPassportLevels[trustLevel - 1].name} status, you're eligible for:
                          </p>
                          <div className="text-3xl font-bold text-neon-green mb-4">
                            Up to {trustLevel === 3 ? '100' : '500'} USDT
                          </div>
                          <Button className="btn-neon-green font-mono">
                            REQUEST LOAN
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-surface rounded-lg border border-strong text-center">
                        <Lock className="w-12 h-12 text-secondary mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-primary mb-2">BUILD YOUR TRUST FIRST</h4>
                        <p className="text-secondary mb-4">
                          Reach "Reliable Saver" level to unlock micro-loans
                        </p>
                        <p className="text-sm text-neon-cyan">
                          Need {10 - depositsCount} more deposits
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}