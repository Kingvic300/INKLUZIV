"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Mic, MicOff, Send, History, Volume2, ArrowUpRight, ArrowDownLeft,
  Settings, CheckCircle, Zap, Terminal, User, Shield, LogOut, Key,
  Accessibility, Wallet, Copy, ExternalLink, Clock, DollarSign,
  TrendingUp, AlertCircle, Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech"
import { transactionAPI, type SendUSDTRequest, type Transaction, type WalletBalanceResponse } from "@/lib/transaction-api"

export default function BankingPage() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("wallet")
  const [balance, setBalance] = useState(0)
  const [usdtBalance, setUsdtBalance] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(1600)
  const [walletAddress, setWalletAddress] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [lastCommand, setLastCommand] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)

  // Send USDT Form State
  const [sendForm, setSendForm] = useState({
    recipientAddress: "",
    recipientName: "",
    amountNaira: "",
    description: ""
  })

  // Accessibility States
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [hapticEnabled, setHapticEnabled] = useState(true)
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true)
  const [highContrastEnabled, setHighContrastEnabled] = useState(false)
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(true)
  const [currentSubtitle, setCurrentSubtitle] = useState("")

  const { toast } = useToast()
  const router = useRouter()

  // --- HOOKS ---
  const { isListening, transcript, isSupported: speechSupported, startListening, stopListening } = useSpeechRecognition()
  const { speak, isSupported: ttsSupported } = useSpeechSynthesis()

  // --- REFS ---
  const sendFormRef = useRef<HTMLFormElement>(null)

  // --- EFFECTS ---
  useEffect(() => {
    loadWalletData()
    loadTransactionHistory()
  }, [])

  useEffect(() => {
    if (voiceEnabled && ttsSupported && textToSpeechEnabled && balance > 0) {
      const timer = setTimeout(() => {
        const welcomeMessage = `Welcome to your INKLUZIV wallet. Your current balance is ${balance.toLocaleString()} naira.`
        speak(welcomeMessage)
        if (subtitlesEnabled) {
          setCurrentSubtitle(welcomeMessage)
          setTimeout(() => setCurrentSubtitle(""), 8000)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [balance])

  useEffect(() => {
    if (transcript && transcript.toLowerCase() !== lastCommand) {
      const lowerCaseTranscript = transcript.toLowerCase()
      setLastCommand(lowerCaseTranscript)
      processVoiceCommand(lowerCaseTranscript)
    }
  }, [transcript])

  // --- API FUNCTIONS ---
  const loadWalletData = async () => {
    try {
      setIsLoading(true)
      const walletData = await transactionAPI.getWalletBalance()
      setBalance(walletData.balanceNaira)
      setUsdtBalance(walletData.balanceUSDT)
      setExchangeRate(walletData.exchangeRate)
      setWalletAddress(walletData.walletAddress)
    } catch (error) {
      // Try to create wallet if it doesn't exist
      try {
        const newWallet = await transactionAPI.createWallet()
        setBalance(newWallet.balanceNaira)
        setUsdtBalance(newWallet.balanceUSDT)
        setExchangeRate(newWallet.exchangeRate)
        setWalletAddress(newWallet.walletAddress)
        toast({
          title: "Wallet Created",
          description: "Your USDT wallet has been created successfully!",
          className: "card-futuristic border-neon-green text-primary"
        })
      } catch (createError) {
        toast({
          title: "Wallet Error",
          description: "Failed to load or create wallet",
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loadTransactionHistory = async () => {
    try {
      const historyData = await transactionAPI.getTransactionHistory(0, 20)
      setTransactions(historyData.transactions)
    } catch (error) {
      console.error("Failed to load transaction history:", error)
    }
  }

  const handleSendUSDT = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sendForm.recipientAddress || !sendForm.amountNaira) {
      toast({
        title: "Missing Information",
        description: "Please fill in recipient address and amount",
        variant: "destructive"
      })
      return
    }

    const amountNaira = parseFloat(sendForm.amountNaira)
    if (amountNaira <= 0 || amountNaira > balance) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount within your balance",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      
      const request: SendUSDTRequest = {
        recipientAddress: sendForm.recipientAddress,
        recipientName: sendForm.recipientName || "Unknown",
        amountNaira: amountNaira,
        description: sendForm.description
      }

      const response = await transactionAPI.sendUSDT(request)
      
      // Update local state
      setBalance(prev => prev - amountNaira)
      setUsdtBalance(prev => prev - response.amountUSDT)
      
      // Add new transaction to history
      const newTransaction: Transaction = {
        id: response.transactionId,
        userId: "",
        recipientAddress: request.recipientAddress,
        recipientName: request.recipientName,
        amountNaira: response.amountNaira,
        amountUSDT: response.amountUSDT,
        exchangeRate: response.exchangeRate,
        transactionHash: response.transactionHash,
        status: response.status,
        type: "SEND",
        createdAt: new Date().toISOString(),
        description: request.description
      }
      
      setTransactions(prev => [newTransaction, ...prev])
      
      // Reset form and close dialog
      setSendForm({
        recipientAddress: "",
        recipientName: "",
        amountNaira: "",
        description: ""
      })
      setIsSendDialogOpen(false)

      // Voice feedback
      const message = `Transaction successful! Sent ${amountNaira.toLocaleString()} naira to ${request.recipientName}.`
      if (voiceEnabled && ttsSupported && textToSpeechEnabled) speak(message)
      if (subtitlesEnabled) {
        setCurrentSubtitle(message)
        setTimeout(() => setCurrentSubtitle(""), 4000)
      }

      toast({
        title: "Transaction Successful!",
        description: `₦${amountNaira.toLocaleString()} sent successfully`,
        className: "card-futuristic border-neon-green text-primary"
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Transaction failed"
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // --- HANDLERS ---
  const processVoiceCommand = (command: string) => {
    if (hapticEnabled && navigator.vibrate) navigator.vibrate(50)
    let response = ""
    let action = ""

    if (command.includes("balance")) {
      response = `Your current balance is ${balance.toLocaleString()} naira, equivalent to ${usdtBalance.toFixed(2)} USDT.`
      action = "Balance Accessed"
    } else if (command.includes("send") || command.includes("transfer")) {
      response = "Opening send dialog. You can now enter recipient details."
      action = "Send Dialog Opened"
      setIsSendDialogOpen(true)
    } else if (command.includes("history")) {
      response = "Displaying transaction history."
      action = "Transaction History Accessed"
      setActiveTab("history")
    } else if (command.includes("wallet")) {
      response = "Navigating to wallet overview."
      action = "Wallet Tab"
      setActiveTab("wallet")
    } else if (command.includes("settings")) {
      response = "Navigating to accessibility settings."
      action = "Settings Tab"
      setActiveTab("settings")
    } else if (command.includes("help")) {
      response = "Available commands: Check balance, Send money, Show history, or Open settings."
      action = "Help displayed"
    } else {
      response = "Command not recognized. Say 'help' for available commands."
      action = "Command Not Recognized"
    }

    if (voiceEnabled && ttsSupported && textToSpeechEnabled) speak(response)
    if (subtitlesEnabled) {
      setCurrentSubtitle(response)
      setTimeout(() => setCurrentSubtitle(""), 4000)
    }
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
      if (subtitlesEnabled) setCurrentSubtitle("Voice recognition active... Speak your command clearly")
      startListening()
    }
  }

  const handleQuickTransfer = (amount: number) => {
    setSendForm(prev => ({ ...prev, amountNaira: amount.toString() }))
    setIsSendDialogOpen(true)
  }

  const handleBalanceCheck = () => {
    if (hapticEnabled && navigator.vibrate) navigator.vibrate(50)
    const message = `Balance check complete. Current balance: ${balance.toLocaleString()} naira, equivalent to ${usdtBalance.toFixed(2)} USDT.`
    if (voiceEnabled && ttsSupported && textToSpeechEnabled) speak(message)
    if (subtitlesEnabled) {
      setCurrentSubtitle(message)
      setTimeout(() => setCurrentSubtitle(""), 4000)
    }
    toast({ title: "Balance Accessed", description: message })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied!", description: "Address copied to clipboard" })
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    toast({ title: "Logged Out Successfully" })
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-neon-green"
      case "PENDING": return "text-neon-orange"
      case "FAILED": return "text-error"
      default: return "text-secondary"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-neon-green text-black shadow-neon-green"
      case "PENDING": return "bg-neon-orange text-black shadow-neon-orange"
      case "FAILED": return "bg-error text-white"
      default: return "bg-gray-600 text-gray-400"
    }
  }

  return (
    <div className={`min-h-screen bg-surface scan-lines ${highContrastEnabled ? "contrast-125 saturate-150" : ""}`}>
      <header className="bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 shadow-neon-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-neon-orange rounded-lg flex items-center justify-center shimmer">
              <Accessibility className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-gradient font-mono">INKLUZIV</h1>
            <span className="text-secondary text-sm font-mono">USDT Wallet</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black bg-transparent transition-smooth font-mono">
              <LogOut className="w-4 h-4 mr-2" />
              LOGOUT
            </Button>
          </div>
        </div>
      </header>

      {subtitlesEnabled && currentSubtitle && (
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
            <Card className="card-futuristic transition-smooth">
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-neon-cyan shadow-neon-cyan">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-surface text-neon-cyan text-xl font-mono">KJ</AvatarFallback>
                </Avatar>
                <CardTitle className="text-primary font-mono">Kanyinsola</CardTitle>
                <CardDescription className="text-secondary font-mono">kanyinsola@gmail.com</CardDescription>
                <div className="flex justify-center mt-3">
                  <Badge className="bg-neon-green text-black shadow-neon-green font-mono">
                    WALLET ACTIVE
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Voice Control */}
            <Card className="mt-4 card-futuristic transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg text-primary font-mono">VOICE CONTROL</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={handleVoiceToggle}
                  disabled={!speechSupported}
                  size="lg"
                  className={`w-32 h-32 rounded-full text-xl transition-smooth font-mono ${
                    isListening 
                      ? "bg-error text-white pulse-recording border-2 border-error" 
                      : "btn-neon-cyan"
                  }`}
                  aria-label={isListening ? "Stop voice recognition" : "Activate voice recognition"}
                >
                  {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
                </Button>
                <p className="text-secondary text-sm font-mono mt-4">
                  {isListening ? "LISTENING..." : "TAP TO SPEAK"}
                </p>
                {transcript && (
                  <p className="text-neon-cyan font-medium mt-2 font-mono text-xs">
                    "{transcript}"
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-surface-elevated border border-strong">
                <TabsTrigger value="wallet" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black transition-smooth font-mono">
                  WALLET
                </TabsTrigger>
                <TabsTrigger value="send" className="data-[state=active]:bg-neon-green data-[state=active]:text-black transition-smooth font-mono">
                  SEND
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-neon-purple data-[state=active]:text-black transition-smooth font-mono">
                  HISTORY
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-neon-orange data-[state=active]:text-black transition-smooth font-mono">
                  SETTINGS
                </TabsTrigger>
              </TabsList>

              {/* Wallet Tab */}
              <TabsContent value="wallet" className="space-y-8">
                {/* Balance Card */}
                <Card 
                  onClick={handleBalanceCheck} 
                  tabIndex={0} 
                  role="button" 
                  aria-label="Check wallet balance" 
                  className="card-futuristic cursor-pointer transition-smooth"
                >
                  <CardHeader className="text-center py-20">
                    <CardTitle className="text-secondary text-3xl font-mono">WALLET BALANCE</CardTitle>
                    <div className="text-7xl font-bold text-gradient my-4 text-glow font-mono">
                      ₦{balance.toLocaleString()}
                    </div>
                    <div className="text-2xl text-neon-cyan font-mono mb-4">
                      ≈ {usdtBalance.toFixed(2)} USDT
                    </div>
                    <Badge className="bg-neon-green text-black text-xl px-8 py-4 shadow-neon-green font-mono">
                      TAP OR SAY "CHECK BALANCE"
                    </Badge>
                  </CardHeader>
                </Card>

                {/* Wallet Info */}
                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary text-2xl flex items-center font-mono">
                      <Wallet className="w-6 h-6 mr-4 text-neon-cyan" />
                      WALLET DETAILS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <div>
                        <Label className="text-primary font-mono">Wallet Address</Label>
                        <p className="text-neon-cyan font-mono text-sm break-all">{walletAddress}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(walletAddress)}
                        className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <Label className="text-primary font-mono">Exchange Rate</Label>
                      <span className="text-neon-orange font-mono">1 USDT = ₦{exchangeRate.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="card-futuristic transition-smooth">
                    <CardHeader>
                      <CardTitle className="text-primary text-2xl flex items-center font-mono">
                        <Send className="w-6 h-6 mr-4 text-neon-green" />
                        QUICK SEND
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {[1000, 5000, 10000, 25000].map((amount) => (
                          <Button
                            key={amount}
                            onClick={() => handleQuickTransfer(amount)}
                            className="h-20 text-lg btn-neon-green touch-target-xl transition-smooth font-mono"
                            aria-label={`Quick send ${amount} naira`}
                            disabled={amount > balance}
                          >
                            ₦{amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-futuristic transition-smooth">
                    <CardHeader>
                      <CardTitle className="text-primary text-2xl flex items-center font-mono">
                        <TrendingUp className="w-6 h-6 mr-4 text-neon-purple" />
                        RECENT ACTIVITY
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {transactions.slice(0, 3).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 bg-surface rounded-lg border border-strong hover:border-neon-cyan transition-smooth"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neon-cyan shadow-neon-cyan">
                              <ArrowUpRight className="w-4 h-4 text-black" />
                            </div>
                            <div>
                              <p className="text-primary font-semibold text-sm font-mono">
                                {transaction.recipientName}
                              </p>
                              <p className="text-secondary font-mono text-xs">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-neon-cyan font-bold font-mono text-sm">
                              -₦{transaction.amountNaira.toLocaleString()}
                            </div>
                            <Badge className={`text-xs font-mono ${getStatusBadge(transaction.status)}`}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Send Tab */}
              <TabsContent value="send" className="space-y-6">
                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary text-3xl flex items-center font-mono">
                      <Send className="w-8 h-8 mr-4 text-neon-green" />
                      SEND USDT
                    </CardTitle>
                    <CardDescription className="text-secondary font-mono">
                      Send USDT using Naira amounts. Conversion happens automatically.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form ref={sendFormRef} onSubmit={handleSendUSDT} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="recipientAddress" className="text-primary font-mono">
                          Recipient Wallet Address *
                        </Label>
                        <Input
                          id="recipientAddress"
                          placeholder="Enter USDT wallet address"
                          value={sendForm.recipientAddress}
                          onChange={(e) => setSendForm(prev => ({ ...prev, recipientAddress: e.target.value }))}
                          className="bg-surface border-border text-primary focus:border-neon-cyan font-mono"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recipientName" className="text-primary font-mono">
                          Recipient Name
                        </Label>
                        <Input
                          id="recipientName"
                          placeholder="Enter recipient name (optional)"
                          value={sendForm.recipientName}
                          onChange={(e) => setSendForm(prev => ({ ...prev, recipientName: e.target.value }))}
                          className="bg-surface border-border text-primary focus:border-neon-green font-mono"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amountNaira" className="text-primary font-mono">
                          Amount (Naira) *
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-orange" />
                          <Input
                            id="amountNaira"
                            type="number"
                            placeholder="0.00"
                            value={sendForm.amountNaira}
                            onChange={(e) => setSendForm(prev => ({ ...prev, amountNaira: e.target.value }))}
                            className="pl-10 bg-surface border-border text-primary focus:border-neon-orange font-mono text-2xl"
                            required
                            disabled={isLoading}
                            min="1"
                            max={balance}
                          />
                        </div>
                        {sendForm.amountNaira && (
                          <p className="text-neon-cyan text-sm font-mono">
                            ≈ {(parseFloat(sendForm.amountNaira) / exchangeRate).toFixed(6)} USDT
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-primary font-mono">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Transaction description (optional)"
                          value={sendForm.description}
                          onChange={(e) => setSendForm(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-surface border-border text-primary focus:border-neon-purple font-mono"
                          disabled={isLoading}
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          className="flex-1 btn-neon-green text-lg py-6 font-mono"
                          disabled={isLoading || !sendForm.recipientAddress || !sendForm.amountNaira}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              PROCESSING...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              SEND USDT
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setSendForm({ recipientAddress: "", recipientName: "", amountNaira: "", description: "" })}
                          className="border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black bg-transparent font-mono"
                          disabled={isLoading}
                        >
                          CLEAR
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary text-3xl flex items-center font-mono">
                      <History className="w-8 h-8 mr-4 text-neon-purple" />
                      TRANSACTION HISTORY
                    </CardTitle>
                    <CardDescription className="text-secondary font-mono">
                      Complete history of your USDT transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transactions.length === 0 ? (
                      <div className="text-center py-12">
                        <History className="w-16 h-16 text-secondary mx-auto mb-4" />
                        <p className="text-secondary font-mono">No transactions yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="p-6 bg-surface rounded-lg border border-strong hover:border-neon-cyan transition-smooth"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-neon-cyan shadow-neon-cyan">
                                  <ArrowUpRight className="w-6 h-6 text-black" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-primary font-semibold text-lg font-mono">
                                    {transaction.recipientName}
                                  </h4>
                                  <p className="text-secondary font-mono text-sm break-all">
                                    To: {transaction.recipientAddress}
                                  </p>
                                  <p className="text-secondary font-mono text-sm">
                                    {formatDate(transaction.createdAt)}
                                  </p>
                                  {transaction.description && (
                                    <p className="text-secondary font-mono text-sm italic">
                                      {transaction.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right space-y-2">
                                <div className="text-2xl font-bold text-neon-cyan font-mono">
                                  -₦{transaction.amountNaira.toLocaleString()}
                                </div>
                                <div className="text-sm text-secondary font-mono">
                                  {transaction.amountUSDT.toFixed(6)} USDT
                                </div>
                                <Badge className={`font-mono ${getStatusBadge(transaction.status)}`}>
                                  {transaction.status}
                                </Badge>
                                {transaction.transactionHash && (
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => copyToClipboard(transaction.transactionHash)}
                                      className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black text-xs"
                                    >
                                      <Copy className="w-3 h-3 mr-1" />
                                      HASH
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary text-3xl flex items-center font-mono">
                      <Settings className="w-8 h-8 mr-4 text-neon-orange" />
                      ACCESSIBILITY SETTINGS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <Label htmlFor="voice-enabled" className="text-lg text-primary font-mono">
                        Voice Control & TTS
                      </Label>
                      <Switch
                        id="voice-enabled"
                        checked={voiceEnabled}
                        onCheckedChange={setVoiceEnabled}
                        className="data-[state=checked]:bg-neon-green"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <Label htmlFor="haptic-enabled" className="text-lg text-primary font-mono">
                        Haptic Feedback
                      </Label>
                      <Switch
                        id="haptic-enabled"
                        checked={hapticEnabled}
                        onCheckedChange={setHapticEnabled}
                        className="data-[state=checked]:bg-neon-green"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <Label htmlFor="subtitles-enabled" className="text-lg text-primary font-mono">
                        Live Captions
                      </Label>
                      <Switch
                        id="subtitles-enabled"
                        checked={subtitlesEnabled}
                        onCheckedChange={setSubtitlesEnabled}
                        className="data-[state=checked]:bg-neon-green"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <Label htmlFor="contrast-enabled" className="text-lg text-primary font-mono">
                        High Contrast Mode
                      </Label>
                      <Switch
                        id="contrast-enabled"
                        checked={highContrastEnabled}
                        onCheckedChange={setHighContrastEnabled}
                        className="data-[state=checked]:bg-neon-green"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Send USDT Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="card-futuristic border-holographic max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-mono text-2xl">SEND USDT</DialogTitle>
            <DialogDescription className="text-secondary font-mono">
              Enter recipient details and amount in Naira
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendUSDT} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-address" className="text-primary font-mono">
                Recipient Address *
              </Label>
              <Input
                id="dialog-address"
                placeholder="Enter USDT wallet address"
                value={sendForm.recipientAddress}
                onChange={(e) => setSendForm(prev => ({ ...prev, recipientAddress: e.target.value }))}
                className="bg-surface border-border text-primary focus:border-neon-cyan font-mono"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dialog-name" className="text-primary font-mono">
                Recipient Name
              </Label>
              <Input
                id="dialog-name"
                placeholder="Enter name (optional)"
                value={sendForm.recipientName}
                onChange={(e) => setSendForm(prev => ({ ...prev, recipientName: e.target.value }))}
                className="bg-surface border-border text-primary focus:border-neon-green font-mono"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dialog-amount" className="text-primary font-mono">
                Amount (Naira) *
              </Label>
              <Input
                id="dialog-amount"
                type="number"
                placeholder="0.00"
                value={sendForm.amountNaira}
                onChange={(e) => setSendForm(prev => ({ ...prev, amountNaira: e.target.value }))}
                className="bg-surface border-border text-primary focus:border-neon-orange font-mono text-xl"
                required
                disabled={isLoading}
                min="1"
                max={balance}
              />
              {sendForm.amountNaira && (
                <p className="text-neon-cyan text-sm font-mono">
                  ≈ {(parseFloat(sendForm.amountNaira) / exchangeRate).toFixed(6)} USDT
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 btn-neon-green font-mono"
                disabled={isLoading || !sendForm.recipientAddress || !sendForm.amountNaira}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    SENDING...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    SEND
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSendDialogOpen(false)}
                className="border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black bg-transparent font-mono"
                disabled={isLoading}
              >
                CANCEL
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}