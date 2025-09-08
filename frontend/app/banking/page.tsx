"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  TrendingUp, AlertCircle, Loader2, Database
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech"

interface Transaction {
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

// Mock API client to simulate backend
const mockApiClient = {
  getWalletBalance: async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return {
      balanceNaira: 250000,
      balanceUSDT: 156.25,
      exchangeRate: 1600,
      walletAddress: "0x742d35Cc6634C0532925a3b8D654d22a73ED9c8b"
    }
  },

  createWallet: async () => {
    await new Promise(resolve => setTimeout(resolve, 1200))
    return {
      balanceNaira: 0,
      balanceUSDT: 0,
      exchangeRate: 1600,
      walletAddress: "0x" + Math.random().toString(16).substring(2, 42)
    }
  },

  getTransactionHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 600))

    const mockTransactions: Transaction[] = [
      {
        id: "tx1",
        userId: "user1",
        recipientAddress: "0x8ba1f109551bD432803012645Hac136c33464b",
        recipientName: "John Doe",
        amountNaira: 25000,
        amountUSDT: 15.625,
        exchangeRate: 1600,
        transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
        status: "COMPLETED",
        type: "SEND",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        description: "Payment for services"
      },
      {
        id: "tx2",
        userId: "user1",
        recipientAddress: "0x3c44cdddb6a900fa2b585dd299e03d12fa4263ec",
        recipientName: "Alice Smith",
        amountNaira: 50000,
        amountUSDT: 31.25,
        exchangeRate: 1600,
        transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12",
        status: "COMPLETED",
        type: "SEND",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        description: "Transfer to savings"
      },
      {
        id: "tx3",
        userId: "user1",
        recipientAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        recipientName: "Bob Wilson",
        amountNaira: 12000,
        amountUSDT: 7.5,
        exchangeRate: 1600,
        transactionHash: "0x567890abcdef1234567890abcdef1234567890ab",
        status: "PENDING",
        type: "SEND",
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        description: "Equipment purchase"
      }
    ]

    return {
      transactions: mockTransactions,
      total: mockTransactions.length
    }
  },

  sendUSDT: async (request: any) => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockHash = "0x" + Math.random().toString(16).substring(2, 66)
    return {
      transactionId: "tx_" + Math.random().toString(36).substring(2),
      transactionHash: mockHash,
      amountNaira: request.amountNaira,
      amountUSDT: request.amountNaira / 1600,
      exchangeRate: 1600,
      status: "COMPLETED"
    }
  }
}

export default function SimulatedBankingPage() {
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
  const [currentField, setCurrentField] = useState<string>("")
  const [isConfirming, setIsConfirming] = useState(false)
  const [demoMode] = useState(true)

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

    // Welcome message for wallet
    if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
      const timer = setTimeout(() => {
        const welcomeMessage = "Welcome to your INKLUZIV USDT wallet demo. You can send cryptocurrency using voice commands. Say 'help' for available commands."
        speak(welcomeMessage)
        if (subtitlesEnabled) {
          setCurrentSubtitle(welcomeMessage)
          setTimeout(() => setCurrentSubtitle(""), 8000)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (transcript && transcript.toLowerCase() !== lastCommand) {
      const lowerCaseTranscript = transcript.toLowerCase()
      setLastCommand(lowerCaseTranscript)

      if (currentField) {
        handleVoiceInput(lowerCaseTranscript)
      } else {
        processVoiceCommand(lowerCaseTranscript)
      }
    }
  }, [transcript])

  const handleVoiceInput = (input: string) => {
    const cleanInput = input.trim()

    if (currentField === "recipientAddress") {
      setSendForm(prev => ({ ...prev, recipientAddress: cleanInput }))

      if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
        speak(`Recipient address entered: ${cleanInput}. Now say the recipient name.`)
        setCurrentSubtitle(`Address: ${cleanInput}`)
        setTimeout(() => setCurrentSubtitle(""), 3000)
      }
      setCurrentField("recipientName")
    } else if (currentField === "recipientName") {
      setSendForm(prev => ({ ...prev, recipientName: cleanInput }))

      if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
        speak(`Recipient name: ${cleanInput}. Now say the amount in naira.`)
        setCurrentSubtitle(`Name: ${cleanInput}`)
        setTimeout(() => setCurrentSubtitle(""), 3000)
      }
      setCurrentField("amountNaira")
    } else if (currentField === "amountNaira") {
      // Extract numbers from voice input
      const amount = cleanInput.replace(/[^\d.]/g, '')
      setSendForm(prev => ({ ...prev, amountNaira: amount }))

      if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
        speak(`Amount: ${amount} naira. Say a description or say 'send' to proceed.`)
        setCurrentSubtitle(`Amount: ₦${amount}`)
        setTimeout(() => setCurrentSubtitle(""), 3000)
      }
      setCurrentField("description")
    } else if (currentField === "description") {
      if (cleanInput.includes("send") || cleanInput.includes("confirm")) {
        confirmTransaction()
      } else {
        setSendForm(prev => ({ ...prev, description: cleanInput }))

        if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
          speak(`Description: ${cleanInput}. Say 'send' to confirm the transaction.`)
          setCurrentSubtitle(`Description: ${cleanInput}`)
          setTimeout(() => setCurrentSubtitle(""), 3000)
        }
      }
    }
  }

  const confirmTransaction = () => {
    if (!sendForm.recipientAddress || !sendForm.amountNaira) {
      if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
        speak("Missing required information. Please provide recipient address and amount.")
      }
      return
    }

    setIsConfirming(true)
    const confirmationMessage = `Confirming transaction: Send ${sendForm.amountNaira} naira to ${sendForm.recipientName || 'recipient'} at address ${sendForm.recipientAddress}. Say 'confirm' to proceed or 'cancel' to abort.`

    if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
      speak(confirmationMessage)
      setCurrentSubtitle(confirmationMessage)
      setTimeout(() => setCurrentSubtitle(""), 8000)
    }

    setCurrentField("confirmation")
  }

  const handleFieldFocus = (fieldName: string, fieldLabel: string) => {
    setCurrentField(fieldName)
    if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
      speak(`${fieldLabel} field focused. Please speak your ${fieldLabel.toLowerCase()}.`)
      setCurrentSubtitle(`Speak your ${fieldLabel.toLowerCase()}`)
      setTimeout(() => setCurrentSubtitle(""), 3000)
    }

    if (!isListening && speechSupported) {
      startListening()
    }
  }

  // --- API FUNCTIONS ---
  const loadWalletData = async () => {
    try {
      setIsLoading(true)
      const walletData = await mockApiClient.getWalletBalance()
      setBalance(walletData.balanceNaira)
      setUsdtBalance(walletData.balanceUSDT)
      setExchangeRate(walletData.exchangeRate)
      setWalletAddress(walletData.walletAddress)

      if (demoMode) {
        toast({
          title: "Demo Wallet Loaded",
          description: "Simulated USDT wallet with demo data",
          className: "card-futuristic border-neon-purple text-primary"
        })
      }
    } catch (error) {
      // Try to create wallet if it doesn't exist
      try {
        const newWallet = await mockApiClient.createWallet()
        setBalance(newWallet.balanceNaira)
        setUsdtBalance(newWallet.balanceUSDT)
        setExchangeRate(newWallet.exchangeRate)
        setWalletAddress(newWallet.walletAddress)
        toast({
          title: "Demo Wallet Created",
          description: "Your simulated USDT wallet has been created!",
          className: "card-futuristic border-neon-green text-primary"
        })
      } catch (createError) {
        toast({
          title: "Wallet Error",
          description: "Failed to load or create demo wallet",
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loadTransactionHistory = async () => {
    try {
      const historyData = await mockApiClient.getTransactionHistory()
      setTransactions(historyData.transactions)
    } catch (error) {
      console.error("Failed to load transaction history:", error)
    }
  }

  const handleSendUSDT = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isConfirming && currentField === "confirmation") {
      // Handle voice confirmation
      if (transcript.toLowerCase().includes("cancel")) {
        setIsConfirming(false)
        setCurrentField("")
        if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
          speak("Transaction cancelled.")
        }
        return
      } else if (!transcript.toLowerCase().includes("confirm")) {
        return // Wait for proper confirmation
      }
    }

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

      const request = {
        recipientAddress: sendForm.recipientAddress,
        recipientName: sendForm.recipientName || "Unknown",
        amountNaira: amountNaira,
        description: sendForm.description
      }

      const response = await mockApiClient.sendUSDT(request)

      // Update local state
      setBalance(prev => prev - amountNaira)
      setUsdtBalance(prev => prev - (response.amountUSDT || amountNaira / exchangeRate))

      // Add new transaction to history
      const newTransaction = {
        id: response.transactionId || Date.now().toString(),
        userId: "",
        recipientAddress: request.recipientAddress,
        recipientName: request.recipientName,
        amountNaira: response.amountNaira || amountNaira,
        amountUSDT: response.amountUSDT || amountNaira / exchangeRate,
        exchangeRate: response.exchangeRate || exchangeRate,
        transactionHash: response.transactionHash || "0x" + Math.random().toString(36).substring(2),
        status: response.status || "COMPLETED",
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

      setIsConfirming(false)
      setCurrentField("")

      // Voice feedback
      const message = `Demo transaction successful! Sent ${amountNaira.toLocaleString()} naira to ${request.recipientName}.`
      if (voiceEnabled && ttsSupported && textToSpeechEnabled) speak(message)
      if (subtitlesEnabled) {
        setCurrentSubtitle(message)
        setTimeout(() => setCurrentSubtitle(""), 4000)
      }

      toast({
        title: "Demo Transaction Successful!",
        description: `₦${amountNaira.toLocaleString()} sent successfully (simulated)`,
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
      response = `Your current demo balance is ${balance.toLocaleString()} naira, equivalent to ${usdtBalance.toFixed(2)} USDT.`
      action = "Balance Accessed"
    } else if (command.includes("send") || command.includes("transfer")) {
      response = "Opening send dialog. You can now enter recipient details."
      action = "Send Dialog Opened"
      setIsSendDialogOpen(true)
      // Start voice input flow
      setTimeout(() => {
        setCurrentField("recipientAddress")
        if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
          speak("Send USDT dialog opened. Please say the recipient wallet address.")
          setCurrentSubtitle("Say the recipient wallet address")
          setTimeout(() => setCurrentSubtitle(""), 4000)
        }
      }, 1000)
    } else if (command.includes("history")) {
      response = "Displaying demo transaction history."
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
    const message = `Balance check complete. Current demo balance: ${balance.toLocaleString()} naira, equivalent to ${usdtBalance.toFixed(2)} USDT.`
    if (voiceEnabled && ttsSupported && textToSpeechEnabled) speak(message)
    if (subtitlesEnabled) {
      setCurrentSubtitle(message)
      setTimeout(() => setCurrentSubtitle(""), 4000)
    }
    toast({ title: "Demo Balance Accessed", description: message })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied!", description: "Address copied to clipboard" })
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_email")
      localStorage.removeItem("login_method")
    }
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

  // Fixed handleQuickDemo with debounce to prevent shake
  const handleQuickDemo = useCallback(() => {
    setSendForm({
      recipientAddress: "0x742d35Cc6634C0532925a3b8D654d22a73ED9c8b",
      recipientName: "Demo User",
      amountNaira: "5000",
      description: "Demo transaction"
    })
    setIsSendDialogOpen(true)
    toast({
      title: "Demo Transaction Loaded",
      description: "Pre-filled demo transaction ready to send",
      className: "card-futuristic border-neon-cyan text-primary"
    })
  }, [])

  // Fixed balance addition with debounce to prevent shake
  const handleAddBalance = useCallback(() => {
    setBalance(prev => prev + 50000)
    toast({
      title: "Demo Balance Added",
      description: "₦50,000 added to demo wallet",
      className: "card-futuristic border-neon-green text-primary"
    })
  }, [])

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
              {demoMode && (
                  <Badge className="bg-neon-purple text-black shadow-neon-purple font-mono">
                    <Database className="w-3 h-3 mr-1" />
                    DEMO MODE
                  </Badge>
              )}
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

              {/* Demo Controls - Fixed */}
              <Card className="mt-4 card-futuristic border-neon-purple/50" style={{ transform: 'none' }}>
                <CardHeader>
                  <CardTitle className="text-lg text-primary font-mono flex items-center">
                    <Database className="w-5 h-5 mr-2 text-neon-purple" />
                    DEMO CONTROLS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                      onClick={handleQuickDemo}
                      size="sm"
                      className="w-full btn-neon-purple font-mono text-xs"
                      style={{
                        transform: 'none',
                        transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease'
                      }}
                  >
                    QUICK DEMO SEND
                  </Button>
                  <Button
                      onClick={handleAddBalance}
                      size="sm"
                      className="w-full btn-neon-green font-mono text-xs"
                      style={{
                        transform: 'none',
                        transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease'
                      }}
                  >
                    ADD ₦50,000
                  </Button>
                  <p className="text-xs text-muted-foreground font-mono text-center">
                    Demo functions for testing
                  </p>
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
                      <CardTitle className="text-secondary text-3xl font-mono">DEMO WALLET BALANCE</CardTitle>
                      <div className="text-7xl font-bold text-gradient my-4 text-glow font-mono">
                        ₦{balance.toLocaleString()}
                      </div>
                      <div className="text-2xl text-neon-cyan font-mono mb-4">
                        ≈ {usdtBalance.toFixed(2)} USDT
                      </div>
                      <Badge className="bg-neon-green text-black text-xl px-8 py-4 shadow-neon-green font-mono">
                        TAP OR SAY "CHECK BALANCE"
                      </Badge>
                      {demoMode && (
                          <p className="text-xs text-muted-foreground mt-4 font-mono">
                            Simulated balance - no real cryptocurrency involved
                          </p>
                      )}
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
                          <Label className="text-primary font-mono">Demo Wallet Address</Label>
                          <p className="text-neon-cyan font-mono text-sm break-all">{walletAddress}</p>
                          <p className="text-xs text-muted-foreground font-mono">Simulated address</p>
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
                        <p className="text-xs text-muted-foreground font-mono text-center">
                          Demo transactions only
                        </p>
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
                        {transactions.length === 0 && (
                            <p className="text-center text-muted-foreground font-mono text-sm py-4">
                              No demo transactions yet
                            </p>
                        )}
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
                        SEND USDT (DEMO)
                      </CardTitle>
                      <CardDescription className="text-secondary font-mono">
                        Send simulated USDT using Naira amounts. No real transactions occur.
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
                              onFocus={() => handleFieldFocus("recipientAddress", "Recipient Address")}
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
                              onFocus={() => handleFieldFocus("recipientName", "Recipient Name")}
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
                                onFocus={() => handleFieldFocus("amountNaira", "Amount in Naira")}
                                className="pl-10 bg-surface border-border text-primary focus:border-neon-orange font-mono text-2xl"
                                required
                                disabled={isLoading}
                                min="1"
                                max={balance}
                            />
                          </div>
                          {sendForm.amountNaira && (
                              <p className="text-neon-cyan text-sm font-mono">
                                ≈ {(parseFloat(sendForm.amountNaira) / exchangeRate).toFixed(6)} USDT (simulated)
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
                              onFocus={() => handleFieldFocus("description", "Transaction Description")}
                              className="bg-surface border-border text-primary focus:border-neon-purple font-mono"
                              disabled={isLoading}
                              rows={3}
                          />
                        </div>

                        <div className="flex gap-4">
                          <Button
                              type="submit"
                              className={`flex-1 text-lg py-6 font-mono ${isConfirming ? 'btn-neon-orange' : 'btn-neon-green'}`}
                              disabled={isLoading || !sendForm.recipientAddress || !sendForm.amountNaira}
                          >
                            {isLoading ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  SENDING DEMO USDT...
                                </>
                            ) : isConfirming ? (
                                <>
                                  <Mic className="w-5 h-5 mr-2" />
                                  SAY 'CONFIRM'
                                </>
                            ) : (
                                <>
                                  <Send className="w-5 h-5 mr-2" />
                                  {currentField ? 'VOICE SEND' : 'SEND DEMO USDT'}
                                </>
                            )}
                          </Button>
                          <Button
                              type="button"
                              variant="outline"
                              className="border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black bg-transparent font-mono"
                              disabled={isLoading}
                              onClick={() => {
                                setSendForm({ recipientAddress: "", recipientName: "", amountNaira: "", description: "" })
                                setCurrentField("")
                                setIsConfirming(false)
                                if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
                                  speak("Form cleared.")
                                }
                              }}
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
                        DEMO TRANSACTION HISTORY
                      </CardTitle>
                      <CardDescription className="text-secondary font-mono">
                        Simulated history of your USDT transactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {transactions.length === 0 ? (
                          <div className="text-center py-12">
                            <History className="w-16 h-16 text-secondary mx-auto mb-4" />
                            <p className="text-secondary font-mono">No demo transactions yet</p>
                            <Button
                                onClick={handleQuickDemo}
                                className="mt-4 btn-neon-purple font-mono"
                                size="sm"
                            >
                              CREATE DEMO TRANSACTION
                            </Button>
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
                                        <Badge className="bg-neon-purple/20 text-neon-purple border border-neon-purple font-mono text-xs">
                                          DEMO TRANSACTION
                                        </Badge>
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
                      <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                        <Label htmlFor="tts-enabled" className="text-lg text-primary font-mono">
                          Text-to-Speech
                        </Label>
                        <Switch
                            id="tts-enabled"
                            checked={textToSpeechEnabled}
                            onCheckedChange={setTextToSpeechEnabled}
                            className="data-[state=checked]:bg-neon-green"
                        />
                      </div>

                      {/* Demo Mode Info */}
                      <div className="p-4 bg-neon-purple/10 border border-neon-purple rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <Database className="w-5 h-5 text-neon-purple" />
                          <Label className="text-lg text-neon-purple font-mono">
                            DEMO MODE ACTIVE
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono mb-2">
                          This is a demonstration version with simulated data:
                        </p>
                        <ul className="text-xs text-muted-foreground font-mono space-y-1">
                          <li>• No real blockchain transactions</li>
                          <li>• Simulated wallet balances and addresses</li>
                          <li>• Mock transaction history</li>
                          <li>• Local storage for authentication</li>
                        </ul>
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
              <DialogTitle className="text-primary font-mono text-2xl">SEND DEMO USDT</DialogTitle>
              <DialogDescription className="text-secondary font-mono">
                Enter recipient details and amount in Naira (simulation only)
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
                    onFocus={() => handleFieldFocus("recipientAddress", "Recipient Address")}
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
                    onFocus={() => handleFieldFocus("recipientName", "Recipient Name")}
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
                    onFocus={() => handleFieldFocus("amountNaira", "Amount in Naira")}
                    className="bg-surface border-border text-primary focus:border-neon-orange font-mono text-xl"
                    required
                    disabled={isLoading}
                    min="1"
                    max={balance}
                />
                {sendForm.amountNaira && (
                    <p className="text-neon-cyan text-sm font-mono">
                      ≈ {(parseFloat(sendForm.amountNaira) / exchangeRate).toFixed(6)} USDT (simulated)
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
                        SEND DEMO
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