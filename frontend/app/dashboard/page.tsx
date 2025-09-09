"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech"
import { useAccessibility } from "@/components/AccessibilityWrapper"
import Link from "next/link"
import { Wallet } from "lucide-react"

// Initial Transaction Data
const initialTransactions = [
  { id: 1, type: "received", amount: 5000, from: "Divine Obinali", date: "Yesterday", icon: ArrowDownLeft },
  { id: 2, type: "sent", amount: 2500, to: "Farid Abubakr", date: "2 days ago", icon: ArrowUpRight },
  { id: 3, type: "received", amount: 15000, from: "Salary", date: "1 week ago", icon: ArrowDownLeft },
]

export default function UnifiedDashboardPage() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("banking")
  const [balance, setBalance] = useState(25430.5)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [lastCommand, setLastCommand] = useState("")

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
  const { announce } = useAccessibility()

  // --- HOOKS ---
  const { isListening, transcript, isSupported: speechSupported, startListening, stopListening } = useSpeechRecognition()
  const { speak, isSupported: ttsSupported } = useSpeechSynthesis()

  // --- EFFECTS ---
  useEffect(() => {
    if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
      const timer = setTimeout(() => {
        const welcomeMessage = `Welcome to your Inkluziv dashboard. Your current balance is ${balance.toLocaleString()} naira.`
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
      processVoiceCommand(lowerCaseTranscript)
    }
  }, [transcript])

  // --- HANDLERS ---

  // Original Voice Command Implementation
  const processVoiceCommand = (command: string) => {
    if (hapticEnabled && navigator.vibrate) navigator.vibrate(50)
    let response = ""
    let action = ""

    if (command.includes("balance")) {
      response = `Your current balance is ${balance.toLocaleString()} naira.`
      action = "Balance Accessed"
    } else if (command.includes("send") || command.includes("transfer")) {
      response = "Transfer mode activated. Say an amount or use the quick transfer buttons."
      action = "Transfer Mode Initiated"
      setActiveTab("banking")
    } else if (command.includes("history")) {
      response = "Displaying transaction history."
      action = "Transaction History Accessed"
      setActiveTab("banking")
    } else if (command.includes("security")) {
      response = "Navigating to the security tab."
      action = "Security Tab"
      setActiveTab("security")
    } else if (command.includes("settings")) {
      response = "Navigating to the settings tab."
      action = "Settings Tab"
      setActiveTab("settings")
    } else if (command.includes("help")) {
      response = "Available commands: Check balance, Send naira, Show history, or Toggle features."
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
    }
    setTransactions((prevTransactions) => [newTransaction, ...prevTransactions])

    const message = `Transfer of ${amount.toLocaleString()} naira successful.`
    if (voiceEnabled && ttsSupported && textToSpeechEnabled) speak(message)
    if (subtitlesEnabled) {
      setCurrentSubtitle(message)
      setTimeout(() => setCurrentSubtitle(""), 4000)
    }
    toast({ title: "Transfer Successful!", description: `₦${amount.toLocaleString()} has been sent.` })
  }

  const handleBalanceCheck = () => {
    if (hapticEnabled && navigator.vibrate) navigator.vibrate(50)
    const message = `Balance check complete. Current balance: ${balance.toLocaleString()} naira.`
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
    toast({ title: enabled ? "Voice Authentication Enabled" : "Voice Authentication Disabled" })
  }

  const handleLogout = () => {
    announce("Logging out of dashboard")
    toast({ title: "Logged Out Successfully" })
    router.push("/")
  }

  const handleLogoutAllDevices = () => {
    announce("Logging out from all devices")
    toast({ title: "Logged Out from All Devices", description: "All active sessions have been terminated." })
    router.push("/")
  }

  const handleEditProfile = () => {
    setActiveTab("settings")
    toast({ title: "Navigating to Settings", description: "You can now edit your user preferences." })
  }

  const handleChangePassword = () => {
    setActiveTab("security")
    toast({ title: "Navigating to Security", description: "You can now manage your authentication methods." })
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
            <span className="text-secondary text-sm font-mono">Dashboard</span>
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

      <div className="container mx-auto px-4 py-8">
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
                  <Badge className={`font-mono ${voiceAuthEnabled ? "bg-neon-green text-black shadow-neon-green" : "bg-gray-600 text-gray-400"}`}>{voiceAuthEnabled ? "VOICE ACTIVE" : "VOICE INACTIVE"}</Badge>
                </div>
              </CardHeader>
            </Card>
            <Card className="mt-4 card-futuristic transition-smooth">
              <CardHeader><CardTitle className="text-lg text-primary font-mono">QUICK ACTIONS</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={handleEditProfile} variant="outline" className="w-full justify-start bg-transparent border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-smooth font-mono"><User className="w-4 h-4 mr-2" />EDIT PROFILE</Button>
                <Button onClick={handleChangePassword} variant="outline" className="w-full justify-start bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono"><Key className="w-4 h-4 mr-2" />CHANGE PASSWORD</Button>
                <Link href="/banking">
                  <Button variant="outline" className="w-full justify-start bg-transparent border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black transition-smooth font-mono">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    ACCESS DEFI GATEWAY
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-surface-elevated border border-strong">
                <TabsTrigger value="banking" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black transition-smooth font-mono">BANKING</TabsTrigger>
                <TabsTrigger value="accessibility" className="data-[state=active]:bg-neon-green data-[state=active]:text-black transition-smooth font-mono">ACCESSIBILITY</TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-neon-purple data-[state=active]:text-black transition-smooth font-mono">SECURITY</TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-neon-orange data-[state=active]:text-black transition-smooth font-mono">SETTINGS</TabsTrigger>
              </TabsList>

              <TabsContent value="banking" className="space-y-8">
                <div className="text-center">
                  <Button onClick={handleVoiceToggle} disabled={!speechSupported} size="lg" className={`w-40 h-40 rounded-full text-2xl transition-smooth font-mono ${isListening ? "bg-error text-white pulse-recording border-2 border-error" : "btn-neon-cyan"}`} aria-label={isListening ? "Stop voice recognition" : "Activate voice recognition"}>
                    {isListening ? <MicOff className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
                  </Button>
                  <div className="mt-6">
                    <p className="text-secondary text-xl font-mono">{isListening ? "VOICE RECOGNITION ACTIVE..." : "TAP TO START VOICE COMMAND"}</p>
                    {transcript && <p className="text-neon-cyan font-medium mt-2 font-mono">LAST COMMAND: "{transcript}"</p>}
                  </div>
                </div>
                <Card onClick={handleBalanceCheck} tabIndex={0} role="button" aria-label="Check account balance" className="card-futuristic cursor-pointer transition-smooth">
                  <CardHeader className="text-center py-20">
                    <CardTitle className="text-secondary text-3xl font-mono">ACCOUNT BALANCE</CardTitle>
                    <div className="text-7xl font-bold text-gradient my-4 text-glow font-mono">₦{balance.toLocaleString()}</div>
                    <Badge className="bg-neon-green text-black text-xl px-8 py-4 shadow-neon-green font-mono">TAP OR SAY "CHECK BALANCE"</Badge>
                  </CardHeader>
                </Card>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="card-futuristic transition-smooth">
                    <CardHeader><CardTitle className="text-primary text-3xl flex items-center font-mono"><Send className="w-8 h-8 mr-4 text-neon-cyan" />MONEY TRANSFER</CardTitle></CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        {[1000, 5000, 10000, 20000].map((amount) => (
                          <Button key={amount} onClick={() => handleQuickTransfer(amount)} className="h-24 text-2xl btn-neon-green touch-target-xl transition-smooth font-mono" aria-label={`Quick transfer ${amount} naira`}>₦{amount.toLocaleString()}</Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="card-futuristic transition-smooth">
                    <CardHeader><CardTitle className="text-primary text-3xl flex items-center font-mono"><History className="w-8 h-8 mr-4 text-neon-purple" />TRANSACTION HISTORY</CardTitle></CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      {transactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-strong hover:border-neon-cyan transition-smooth cursor-pointer" tabIndex={0} role="button" aria-label={`Transaction ${transaction.type} ${transaction.amount} naira`}>
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === "received" ? "bg-neon-green shadow-neon-green" : "bg-neon-cyan shadow-neon-cyan"}`}>
                              <transaction.icon className="w-6 h-6 text-black" />
                            </div>
                            <div>
                              <p className="text-primary font-semibold text-lg font-mono">{transaction.type === "received" ? transaction.from : transaction.to}</p>
                              <p className="text-secondary font-mono text-sm">{transaction.date}</p>
                            </div>
                          </div>
                          <div className={`text-xl font-bold font-mono ${transaction.type === "received" ? "text-neon-green" : "text-neon-cyan"}`}>{transaction.type === "received" ? "+" : "-"}₦{transaction.amount.toLocaleString()}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="accessibility" className="space-y-6">
                <Card className="card-futuristic transition-smooth">
                  <CardHeader><CardTitle className="text-primary text-3xl flex items-center font-mono"><Accessibility className="w-8 h-8 mr-4 text-neon-green" />ACCESSIBILITY CONTROLS</CardTitle></CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg"><Label htmlFor="voice-enabled" className="text-lg text-primary font-mono">Voice Control & TTS</Label><Switch id="voice-enabled" checked={voiceEnabled} onCheckedChange={setVoiceEnabled} className="data-[state=checked]:bg-neon-green" /></div>
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg"><Label htmlFor="haptic-enabled" className="text-lg text-primary font-mono">Haptic Feedback</Label><Switch id="haptic-enabled" checked={hapticEnabled} onCheckedChange={setHapticEnabled} className="data-[state=checked]:bg-neon-green" /></div>
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg"><Label htmlFor="subtitles-enabled" className="text-lg text-primary font-mono">Live Captions</Label><Switch id="subtitles-enabled" checked={subtitlesEnabled} onCheckedChange={setSubtitlesEnabled} className="data-[state=checked]:bg-neon-green" /></div>
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg"><Label htmlFor="contrast-enabled" className="text-lg text-primary font-mono">High Contrast Mode</Label><Switch id="contrast-enabled" checked={highContrastEnabled} onCheckedChange={setHighContrastEnabled} className="data-[state=checked]:bg-neon-green" /></div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card className="card-futuristic transition-smooth">
                  <CardHeader><CardTitle className="text-primary flex items-center font-mono"><Mic className="w-5 h-5 mr-2 text-neon-purple" />VOICE AUTHENTICATION</CardTitle><CardDescription className="text-secondary font-mono">Manage your voice login settings</CardDescription></CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg"><Label htmlFor="voice-auth" className="text-lg text-primary font-mono">Enable Voice Login</Label><Switch id="voice-auth" checked={voiceAuthEnabled} onCheckedChange={handleVoiceAuthToggle} className="data-[state=checked]:bg-neon-purple" /></div>
                    {voiceAuthEnabled && (<div className="p-4 bg-neon-green/10 rounded-lg border border-neon-green/30"><div className="flex items-center space-x-2"><Shield className="w-5 h-5 text-neon-green" /><span className="text-sm font-medium text-neon-green font-mono">VOICE AUTHENTICATION ACTIVE</span></div></div>)}
                  </CardContent>
                </Card>
                <Card className="card-futuristic transition-smooth">
                  <CardHeader><CardTitle className="text-primary flex items-center font-mono"><Terminal className="w-5 h-5 mr-2 text-neon-purple" />SESSION MANAGEMENT</CardTitle><CardDescription className="text-secondary font-mono">Control your active sessions</CardDescription></CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <Button variant="outline" className="w-full bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />LOGOUT CURRENT DEVICE</Button>
                    <Button variant="destructive" className="w-full bg-error hover:bg-error/80 transition-smooth font-mono" onClick={handleLogoutAllDevices}><LogOut className="w-4 h-4 mr-2" />LOGOUT ALL DEVICES</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="card-futuristic transition-smooth">
                  <CardHeader><CardTitle className="text-primary flex items-center font-mono"><Zap className="w-5 h-5 mr-2 text-neon-orange" />USER PREFERENCES</CardTitle><CardDescription className="text-secondary font-mono">Customize your account notifications</CardDescription></CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg"><Label htmlFor="email-notifications" className="text-lg text-primary font-mono">Email Notifications</Label><Switch id="email-notifications" checked={notifications} onCheckedChange={setNotifications} className="data-[state=checked]:bg-neon-orange" /></div>
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg"><Label htmlFor="sms-notifications" className="text-lg text-primary font-mono">SMS Notifications</Label><Switch id="sms-notifications" defaultChecked className="data-[state=checked]:bg-neon-orange" /></div>
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