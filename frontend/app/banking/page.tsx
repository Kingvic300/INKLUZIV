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
import {
  Eye,
  Mic,
  MicOff,
  Send,
  History,
  Volume2,
  VolumeX,
  Vibrate,
  Hand,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  CheckCircle,
  Zap,
  Palette,
  Focus,
  Terminal,
  User,
  Shield,
  LogOut,
  Key,
  Accessibility,
  Copy,
  QrCode,
  Wallet,
  ArrowLeft,
  Plus,
  Minus,
  Check
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech"
import { useAccessibilityAnnouncer } from "@/hooks/use-accessibility-announcer"
import Link from "next/link"
import QRCode from "qrcode"

// Mock wallet data
const MOCK_WALLET_ADDRESS = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
const MOCK_BALANCE_USDT = 1247.85
const MOCK_BALANCE_NAIRA = 1995600

// Initial Transaction Data
const initialTransactions = [
  { id: 1, type: "received", amount: 5000, from: "Divine Obinali", date: "Yesterday", icon: ArrowDownLeft, hash: "0x1a2b3c4d5e6f" },
  { id: 2, type: "sent", amount: 2500, to: "Farid Abubakr", date: "2 days ago", icon: ArrowUpRight, hash: "0x7g8h9i0j1k2l" },
  { id: 3, type: "received", amount: 15000, from: "Salary", date: "1 week ago", icon: ArrowDownLeft, hash: "0x3m4n5o6p7q8r" },
]

export default function BankingPage() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("wallet")
  const [balance, setBalance] = useState(MOCK_BALANCE_NAIRA)
  const [usdtBalance, setUsdtBalance] = useState(MOCK_BALANCE_USDT)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [lastCommand, setLastCommand] = useState("")
  const [showQR, setShowQR] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)

  // Send Money Form
  const [sendForm, setSendForm] = useState({
    recipientAddress: "",
    recipientName: "",
    amount: "",
    description: ""
  })

  // Accessibility States
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [hapticEnabled, setHapticEnabled] = useState(true)
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true)
  const [highContrastEnabled, setHighContrastEnabled] = useState(false)
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(true)
  const [currentSubtitle, setCurrentSubtitle] = useState("")

  // Dashboard States
  const [voiceAuthEnabled, setVoiceAuthEnabled] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const { toast } = useToast()
  const router = useRouter()
  const { announce } = useAccessibilityAnnouncer()

  // --- HOOKS ---
  const { isListening, transcript, isSupported: speechSupported, startListening, stopListening } = useSpeechRecognition()
  const { speak, isSupported: ttsSupported } = useSpeechSynthesis()

  // Refs for accessibility
  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const liveRegionRef = useRef<HTMLDivElement>(null)

  // --- EFFECTS ---
  useEffect(() => {
    if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
      const timer = setTimeout(() => {
        const welcomeMessage = `Welcome to your INKLUZIV USDT wallet. Your current balance is ${balance.toLocaleString()} naira, equivalent to ${usdtBalance} USDT.`
        speak(welcomeMessage)
        announce(welcomeMessage)
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
      processVoiceCommand(lowerCaseTranscript)
    }
  }, [transcript])

  // Generate QR code when component mounts
  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrUrl = await QRCode.toDataURL(MOCK_WALLET_ADDRESS, {
          width: 200,
          margin: 2,
          color: {
            dark: '#00ffff',
            light: '#0f1629'
          }
        })
        setQrCodeUrl(qrUrl)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }
    generateQR()
  }, [])

  // --- HANDLERS ---

  const copyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_WALLET_ADDRESS)
      setCopySuccess(true)
      
      const successMessage = "Wallet address copied to clipboard successfully"
      
      // Visual feedback
      toast({
        title: "Address Copied!",
        description: successMessage,
        className: "card-futuristic border-neon-green text-primary"
      })

      // Audio feedback
      if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
        speak(successMessage)
      }

      // Screen reader announcement
      announce(successMessage)

      // Haptic feedback
      if (hapticEnabled && navigator.vibrate) {
        navigator.vibrate(100)
      }

      // Visual caption
      if (subtitlesEnabled) {
        setCurrentSubtitle(successMessage)
        setTimeout(() => setCurrentSubtitle(""), 3000)
      }

      // Reset copy success state
      setTimeout(() => setCopySuccess(false), 2000)

    } catch (error) {
      const errorMessage = "Failed to copy wallet address. Please try again."
      
      toast({
        title: "Copy Failed",
        description: errorMessage,
        variant: "destructive"
      })

      announce(errorMessage)

      if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
        speak(errorMessage)
      }
    }
  }

  const toggleQRCode = () => {
    setShowQR(!showQR)
    const message = showQR ? "QR code hidden" : "QR code displayed for wallet address"
    
    announce(message)
    
    if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
      speak(message)
    }

    if (subtitlesEnabled) {
      setCurrentSubtitle(message)
      setTimeout(() => setCurrentSubtitle(""), 3000)
    }
  }

  // Original Voice Command Implementation
  const processVoiceCommand = (command: string) => {
    if (hapticEnabled && navigator.vibrate) navigator.vibrate(50)
    let response = ""
    let action = ""

    if (command.includes("balance")) {
      response = `Your current balance is ${balance.toLocaleString()} naira, equivalent to ${usdtBalance} USDT.`
      action = "Balance Accessed"
    } else if (command.includes("copy") && command.includes("address")) {
      copyWalletAddress()
      return
    } else if (command.includes("show qr") || command.includes("qr code")) {
      toggleQRCode()
      return
    } else if (command.includes("send") || command.includes("transfer")) {
      response = "Transfer mode activated. Fill in recipient details or use quick transfer."
      action = "Transfer Mode Initiated"
      setActiveTab("send")
    } else if (command.includes("history")) {
      response = "Displaying transaction history."
      action = "Transaction History Accessed"
      setActiveTab("history")
    } else if (command.includes("wallet")) {
      response = "Displaying wallet overview."
      action = "Wallet Tab"
      setActiveTab("wallet")
    } else if (command.includes("help")) {
      response = "Available commands: Check balance, Copy address, Show QR code, Send money, Show history, or Toggle features."
      action = "Help displayed"
    } else {
      response = "Command not recognized. Say 'help' for available commands."
      action = "Command Not Recognized"
    }

    if (voiceEnabled && ttsSupported && textToSpeechEnabled) speak(response)
    announce(response)
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
    if (hapticEnabled && navigator.vibrate) navigator.vibrate(100)

    if (amount > balance) {
      const message = `Transfer failed. Insufficient funds.`
      if (voiceEnabled && ttsSupported && textToSpeechEnabled) speak(message)
      announce(message)
      if (subtitlesEnabled) {
        setCurrentSubtitle(message)
        setTimeout(() => setCurrentSubtitle(""), 4000)
      }
      toast({ title: "Transfer Failed", description: "Your balance is too low to complete this transaction.", variant: "destructive" })
      return
    }

    setBalance((prevBalance) => prevBalance - amount)
    const newTransaction = {
      id: Date.now(),
      type: "sent" as const,
      amount,
      to: "Quick Transfer",
      date: "Just now",
      icon: ArrowUpRight,
      hash: `0x${Math.random().toString(16).substring(2, 14)}`
    }
    setTransactions((prevTransactions) => [newTransaction, ...prevTransactions])

    const message = `Transfer of ${amount.toLocaleString()} naira successful.`
    if (voiceEnabled && ttsSupported && textToSpeechEnabled) speak(message)
    announce(message)
    if (subtitlesEnabled) {
      setCurrentSubtitle(message)
      setTimeout(() => setCurrentSubtitle(""), 4000)
    }
    toast({ title: "Transfer Successful!", description: `₦${amount.toLocaleString()} has been sent.` })
  }

  const handleSendMoney = (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = parseFloat(sendForm.amount)
    if (amount > balance) {
      const message = "Insufficient funds for this transaction"
      announce(message)
      toast({ title: "Transfer Failed", description: message, variant: "destructive" })
      return
    }

    // Simulate transaction
    setBalance(prev => prev - amount)
    const newTransaction = {
      id: Date.now(),
      type: "sent" as const,
      amount,
      to: sendForm.recipientName || sendForm.recipientAddress,
      date: "Just now",
      icon: ArrowUpRight,
      hash: `0x${Math.random().toString(16).substring(2, 14)}`
    }
    setTransactions(prev => [newTransaction, ...prev])

    const message = `Successfully sent ${amount.toLocaleString()} naira to ${sendForm.recipientName || sendForm.recipientAddress}`
    announce(message)
    toast({ title: "Transfer Successful!", description: message })

    // Reset form
    setSendForm({
      recipientAddress: "",
      recipientName: "",
      amount: "",
      description: ""
    })
  }

  const handleBalanceCheck = () => {
    if (hapticEnabled && navigator.vibrate) navigator.vibrate(50)
    const message = `Balance check complete. Current balance: ${balance.toLocaleString()} naira, equivalent to ${usdtBalance} USDT.`
    if (voiceEnabled && ttsSupported && textToSpeechEnabled) speak(message)
    announce(message)
    if (subtitlesEnabled) {
      setCurrentSubtitle(message)
      setTimeout(() => setCurrentSubtitle(""), 4000)
    }
    toast({ title: "Balance Accessed", description: message })
  }

  const handleVoiceAuthToggle = (enabled: boolean) => {
    setVoiceAuthEnabled(enabled)
    const message = enabled ? "Voice Authentication Enabled" : "Voice Authentication Disabled"
    announce(message)
    toast({ title: message })
  }

  const handleLogout = () => {
    announce("Logging out of USDT wallet")
    toast({ title: "Logged Out Successfully" })
    router.push("/")
  }

  const handleLogoutAllDevices = () => {
    announce("Logging out from all devices")
    toast({ title: "Logged Out from All Devices", description: "All active sessions have been terminated." })
    router.push("/")
  }

  return (
    <div className={`min-h-screen bg-surface scan-lines ${highContrastEnabled ? "contrast-125 saturate-150" : ""}`}>
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-neon-cyan focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-mono"
      >
        Skip to main content
      </a>

      {/* Live region for screen reader announcements */}
      <div 
        ref={liveRegionRef}
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="accessibility-announcements"
      />

      <header className="bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 shadow-neon-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2 text-neon-cyan hover:text-primary transition-colors focus-visible:ring-accessible font-mono">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">DASHBOARD</span>
            </Link>
            <div className="w-10 h-10 bg-neon-orange rounded-lg flex items-center justify-center shimmer">
              <Wallet className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient font-mono">USDT WALLET</h1>
              <span className="text-secondary text-sm font-mono">Blockchain Banking</span>
            </div>
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
          <div className="px-4 py-3"><p className="text-primary text-center font-medium font-mono text-lg"><Volume2 className="w-5 h-5 inline mr-3" />{currentSubtitle}</p></div>
        </div>
      )}

      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
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
                  <Badge className={`font-mono ${voiceAuthEnabled ? "bg-neon-green text-black shadow-neon-green" : "bg-gray-600 text-gray-400"}`}>
                    {voiceAuthEnabled ? "VOICE ACTIVE" : "VOICE INACTIVE"}
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
                  className={`w-20 h-20 rounded-full text-xl transition-smooth font-mono ${
                    isListening
                      ? "bg-error text-white pulse-recording border-2 border-error"
                      : "btn-neon-cyan"
                  }`}
                  aria-label={isListening ? "Stop voice recognition" : "Activate voice recognition"}
                >
                  {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </Button>
                <p className="text-secondary text-sm font-mono mt-2">
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

          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-surface-elevated border border-strong">
                <TabsTrigger value="wallet" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black transition-smooth font-mono">WALLET</TabsTrigger>
                <TabsTrigger value="send" className="data-[state=active]:bg-neon-green data-[state=active]:text-black transition-smooth font-mono">SEND</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-neon-purple data-[state=active]:text-black transition-smooth font-mono">HISTORY</TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-neon-orange data-[state=active]:text-black transition-smooth font-mono">SETTINGS</TabsTrigger>
              </TabsList>

              <TabsContent value="wallet" className="space-y-6">
                {/* Balance Card */}
                <Card onClick={handleBalanceCheck} tabIndex={0} role="button" aria-label="Check account balance" className="card-futuristic cursor-pointer transition-smooth">
                  <CardHeader className="text-center py-12">
                    <CardTitle className="text-secondary text-2xl font-mono">WALLET BALANCE</CardTitle>
                    <div className="text-5xl font-bold text-gradient my-4 text-glow font-mono">₦{balance.toLocaleString()}</div>
                    <div className="text-xl text-neon-cyan font-mono">{usdtBalance} USDT</div>
                    <Badge className="bg-neon-green text-black text-lg px-6 py-2 shadow-neon-green font-mono mt-4">TAP OR SAY "CHECK BALANCE"</Badge>
                  </CardHeader>
                </Card>

                {/* Wallet Address Section */}
                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary text-2xl flex items-center font-mono">
                      <Wallet className="w-6 h-6 mr-3 text-neon-cyan" />
                      WALLET ADDRESS
                    </CardTitle>
                    <CardDescription className="text-secondary font-mono">
                      Your USDT wallet address for receiving payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Address Display */}
                    <div className="bg-surface p-4 rounded-lg border border-strong">
                      <Label htmlFor="wallet-address" className="text-sm text-secondary font-mono mb-2 block">
                        WALLET ADDRESS
                      </Label>
                      <div className="flex items-center space-x-3">
                        <Input
                          id="wallet-address"
                          value={MOCK_WALLET_ADDRESS}
                          readOnly
                          className="bg-surface-elevated border-neon-cyan text-primary font-mono text-sm flex-1"
                          aria-label="Your wallet address"
                        />
                        <Button
                          ref={copyButtonRef}
                          onClick={copyWalletAddress}
                          className={`btn-neon-green transition-smooth font-mono ${copySuccess ? 'bg-neon-green text-black' : ''}`}
                          aria-label="Copy wallet address to clipboard"
                        >
                          {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span className="ml-2 hidden sm:inline">
                            {copySuccess ? "COPIED!" : "COPY"}
                          </span>
                        </Button>
                      </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={toggleQRCode}
                        variant="outline"
                        className="bg-transparent border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black transition-smooth font-mono"
                        aria-label={showQR ? "Hide QR code" : "Show QR code for wallet address"}
                        aria-expanded={showQR}
                        aria-controls="qr-code-section"
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        {showQR ? "HIDE QR" : "SHOW QR"}
                      </Button>
                    </div>

                    {/* QR Code Display */}
                    {showQR && (
                      <div 
                        id="qr-code-section"
                        className="bg-surface p-6 rounded-lg border border-neon-purple text-center"
                        role="region"
                        aria-label="QR code for wallet address"
                      >
                        {qrCodeUrl ? (
                          <div>
                            <img 
                              src={qrCodeUrl} 
                              alt={`QR code for wallet address ${MOCK_WALLET_ADDRESS}`}
                              className="mx-auto mb-4 rounded-lg"
                              width={200}
                              height={200}
                            />
                            <p className="text-secondary text-sm font-mono">
                              Scan this QR code to get the wallet address
                            </p>
                          </div>
                        ) : (
                          <div className="text-secondary font-mono">Generating QR code...</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="card-futuristic transition-smooth">
                    <CardHeader>
                      <CardTitle className="text-primary text-xl flex items-center font-mono">
                        <Send className="w-6 h-6 mr-3 text-neon-green" />
                        QUICK TRANSFER
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[1000, 5000, 10000, 20000].map((amount) => (
                          <Button
                            key={amount}
                            onClick={() => handleQuickTransfer(amount)}
                            className="h-16 text-lg btn-neon-green touch-target-xl transition-smooth font-mono"
                            aria-label={`Quick transfer ${amount} naira`}
                          >
                            ₦{amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-futuristic transition-smooth">
                    <CardHeader>
                      <CardTitle className="text-primary text-xl flex items-center font-mono">
                        <History className="w-6 h-6 mr-3 text-neon-purple" />
                        RECENT ACTIVITY
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {transactions.slice(0, 3).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 bg-surface rounded-lg border border-strong hover:border-neon-cyan transition-smooth cursor-pointer"
                          tabIndex={0}
                          role="button"
                          aria-label={`Transaction ${transaction.type} ${transaction.amount} naira`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === "received" ? "bg-neon-green shadow-neon-green" : "bg-neon-cyan shadow-neon-cyan"
                            }`}>
                              <transaction.icon className="w-5 h-5 text-black" />
                            </div>
                            <div>
                              <p className="text-primary font-semibold font-mono">
                                {transaction.type === "received" ? transaction.from : transaction.to}
                              </p>
                              <p className="text-secondary font-mono text-xs">{transaction.date}</p>
                            </div>
                          </div>
                          <div className={`text-lg font-bold font-mono ${
                            transaction.type === "received" ? "text-neon-green" : "text-neon-cyan"
                          }`}>
                            {transaction.type === "received" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="send" className="space-y-6">
                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary text-3xl flex items-center font-mono">
                      <Send className="w-8 h-8 mr-4 text-neon-green" />
                      SEND USDT
                    </CardTitle>
                    <CardDescription className="text-secondary font-mono">
                      Transfer USDT to another wallet address
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSendMoney} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="recipient-address" className="text-primary font-mono">
                          Recipient Wallet Address
                        </Label>
                        <Input
                          id="recipient-address"
                          placeholder="Enter USDT wallet address"
                          value={sendForm.recipientAddress}
                          onChange={(e) => setSendForm({...sendForm, recipientAddress: e.target.value})}
                          className="bg-surface border-border text-primary focus:border-neon-cyan font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recipient-name" className="text-primary font-mono">
                          Recipient Name (Optional)
                        </Label>
                        <Input
                          id="recipient-name"
                          placeholder="Enter recipient name"
                          value={sendForm.recipientName}
                          onChange={(e) => setSendForm({...sendForm, recipientName: e.target.value})}
                          className="bg-surface border-border text-primary focus:border-neon-green font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-primary font-mono">
                          Amount (Naira)
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount in Naira"
                          value={sendForm.amount}
                          onChange={(e) => setSendForm({...sendForm, amount: e.target.value})}
                          className="bg-surface border-border text-primary focus:border-neon-orange font-mono"
                          required
                          min="1"
                          max={balance}
                        />
                        <p className="text-xs text-secondary font-mono">
                          Available: ₦{balance.toLocaleString()} ({usdtBalance} USDT)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-primary font-mono">
                          Description (Optional)
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Enter transaction description"
                          value={sendForm.description}
                          onChange={(e) => setSendForm({...sendForm, description: e.target.value})}
                          className="bg-surface border-border text-primary focus:border-neon-purple font-mono"
                          rows={3}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full btn-neon-green text-lg py-4 font-mono"
                        disabled={!sendForm.recipientAddress || !sendForm.amount}
                      >
                        <Send className="w-5 h-5 mr-2" />
                        SEND USDT
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary text-3xl flex items-center font-mono">
                      <History className="w-8 h-8 mr-4 text-neon-purple" />
                      TRANSACTION HISTORY
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-surface rounded-lg border border-strong hover:border-neon-cyan transition-smooth cursor-pointer"
                        tabIndex={0}
                        role="button"
                        aria-label={`Transaction ${transaction.type} ${transaction.amount} naira on ${transaction.date}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            transaction.type === "received" ? "bg-neon-green shadow-neon-green" : "bg-neon-cyan shadow-neon-cyan"
                          }`}>
                            <transaction.icon className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <p className="text-primary font-semibold text-lg font-mono">
                              {transaction.type === "received" ? transaction.from : transaction.to}
                            </p>
                            <p className="text-secondary font-mono text-sm">{transaction.date}</p>
                            <p className="text-xs text-muted-foreground font-mono">Hash: {transaction.hash}</p>
                          </div>
                        </div>
                        <div className={`text-xl font-bold font-mono ${
                          transaction.type === "received" ? "text-neon-green" : "text-neon-cyan"
                        }`}>
                          {transaction.type === "received" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary text-2xl flex items-center font-mono">
                      <Accessibility className="w-6 h-6 mr-3 text-neon-green" />
                      ACCESSIBILITY SETTINGS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <Label htmlFor="voice-enabled" className="text-lg text-primary font-mono">Voice Control & TTS</Label>
                      <Switch 
                        id="voice-enabled" 
                        checked={voiceEnabled} 
                        onCheckedChange={setVoiceEnabled} 
                        className="data-[state=checked]:bg-neon-green"
                        aria-describedby="voice-help"
                      />
                    </div>
                    <p id="voice-help" className="text-xs text-secondary font-mono px-4">
                      Enable voice commands and text-to-speech feedback
                    </p>

                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <Label htmlFor="haptic-enabled" className="text-lg text-primary font-mono">Haptic Feedback</Label>
                      <Switch 
                        id="haptic-enabled" 
                        checked={hapticEnabled} 
                        onCheckedChange={setHapticEnabled} 
                        className="data-[state=checked]:bg-neon-green"
                        aria-describedby="haptic-help"
                      />
                    </div>
                    <p id="haptic-help" className="text-xs text-secondary font-mono px-4">
                      Enable vibration feedback for interactions
                    </p>

                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <Label htmlFor="subtitles-enabled" className="text-lg text-primary font-mono">Live Captions</Label>
                      <Switch 
                        id="subtitles-enabled" 
                        checked={subtitlesEnabled} 
                        onCheckedChange={setSubtitlesEnabled} 
                        className="data-[state=checked]:bg-neon-green"
                        aria-describedby="captions-help"
                      />
                    </div>
                    <p id="captions-help" className="text-xs text-secondary font-mono px-4">
                      Show visual captions for audio feedback
                    </p>

                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <Label htmlFor="contrast-enabled" className="text-lg text-primary font-mono">High Contrast Mode</Label>
                      <Switch 
                        id="contrast-enabled" 
                        checked={highContrastEnabled} 
                        onCheckedChange={setHighContrastEnabled} 
                        className="data-[state=checked]:bg-neon-green"
                        aria-describedby="contrast-help"
                      />
                    </div>
                    <p id="contrast-help" className="text-xs text-secondary font-mono px-4">
                      Increase contrast for better visibility
                    </p>

                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <Label htmlFor="voice-auth" className="text-lg text-primary font-mono">Voice Authentication</Label>
                      <Switch 
                        id="voice-auth" 
                        checked={voiceAuthEnabled} 
                        onCheckedChange={handleVoiceAuthToggle} 
                        className="data-[state=checked]:bg-neon-purple"
                        aria-describedby="voice-auth-help"
                      />
                    </div>
                    <p id="voice-auth-help" className="text-xs text-secondary font-mono px-4">
                      Enable biometric voice login for wallet access
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center font-mono">
                      <Terminal className="w-5 h-5 mr-2 text-neon-purple" />
                      SESSION MANAGEMENT
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono" 
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      LOGOUT CURRENT DEVICE
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full bg-error hover:bg-error/80 transition-smooth font-mono" 
                      onClick={handleLogoutAllDevices}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      LOGOUT ALL DEVICES
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}