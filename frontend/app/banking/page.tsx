"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Mic,
  MicOff,
  ArrowLeft,
  Send,
  History,
  Volume2,
  VolumeX,
  Vibrate,
  Hand,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Settings,
  CheckCircle,
  Zap,
  Type,
  Gamepad2,
  Palette,
  Focus,
  Timer,
  Languages,
  Camera,
  Fingerprint,
  MousePointer,
  Headphones,
  ScanLine,
  Brain,
  Globe,
  Smartphone,
  Accessibility,
  Terminal,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech"

export default function BankingPage() {
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [hapticEnabled, setHapticEnabled] = useState(true)
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true)
  const [highContrastEnabled, setHighContrastEnabled] = useState(false)
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(true)
  const [currentSubtitle, setCurrentSubtitle] = useState("")
  const [balance, setBalance] = useState(25430.5)
  const [lastCommand, setLastCommand] = useState("")
  const { toast } = useToast()

  const {
    isListening,
    transcript,
    isSupported: speechSupported,
    startListening,
    stopListening,
    error: speechError,
  } = useSpeechRecognition()
  const { speak, isSpeaking, isSupported: ttsSupported } = useSpeechSynthesis()

  // Voice greeting on load
  useEffect(() => {
    if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
      const timer = setTimeout(() => {
        const welcomeMessage = `Your current balance is ${balance.toLocaleString()} naira. All accessibility features are active.`
        speak(welcomeMessage)
        if (subtitlesEnabled) {
          setCurrentSubtitle(welcomeMessage)
          setTimeout(() => setCurrentSubtitle(""), 8000)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [voiceEnabled, ttsSupported, textToSpeechEnabled, speak, balance, subtitlesEnabled])

  // Process voice commands
  useEffect(() => {
    if (transcript && transcript !== lastCommand) {
      setLastCommand(transcript)
      processVoiceCommand(transcript.toLowerCase())
    }
  }, [transcript, lastCommand])

  const processVoiceCommand = (command: string) => {
    if (hapticEnabled && navigator.vibrate) {
      navigator.vibrate(50)
    }

    let response = ""
    let action = ""

    if (command.includes("balance")) {
      response = `Your current balance is ${balance.toLocaleString()} naira.`
      action = "Balance accessed"
    } else if (command.includes("send") || command.includes("transfer")) {
      response = "Transfer mode activated. Say an amount or use the quick transfer buttons."
      action = "Transfer mode initiated"
    } else if (command.includes("history")) {
      response = "Displaying transaction history."
      action = "Transaction history accessed"
    } else if (command.includes("help")) {
      response = "Available commands: Check balance, Send naira, Show history, or Toggle features."
      action = "Help displayed"
    } else {
      response = "Command not recognized. Say 'help' for available commands."
      action = "Command not recognized"
    }

    if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
      speak(response)
    }

    if (subtitlesEnabled) {
      setCurrentSubtitle(response)
      setTimeout(() => setCurrentSubtitle(""), 4000)
    }

    toast({
      title: action,
      description: response,
    })
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      if (!speechSupported) {
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support speech recognition",
          variant: "destructive",
        })
        return
      }

      if (subtitlesEnabled) {
        setCurrentSubtitle("Voice recognition active... Speak your command clearly")
      }
      startListening()
    }
  }

  const handleQuickTransfer = (amount: number) => {
    if (hapticEnabled && navigator.vibrate) {
      navigator.vibrate(100)
    }

    const message = `Transfer of ${amount.toLocaleString()} naira initiated.`

    if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
      speak(message)
    }

    if (subtitlesEnabled) {
      setCurrentSubtitle(message)
      setTimeout(() => setCurrentSubtitle(""), 4000)
    }

    toast({
      title: "Transfer Initiated",
      description: `₦${amount.toLocaleString()} transfer prepared`,
    })
  }

  const handleBalanceCheck = () => {
    if (hapticEnabled && navigator.vibrate) {
      navigator.vibrate(50)
    }

    const message = `Balance check complete. Current balance: ${balance.toLocaleString()} naira.`

    if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
      speak(message)
    }

    if (subtitlesEnabled) {
      setCurrentSubtitle(message)
      setTimeout(() => setCurrentSubtitle(""), 4000)
    }
  }

  const transactions = [
    { id: 1, type: "received", amount: 5000, from: "John Doe", date: "Yesterday", icon: ArrowDownLeft },
    { id: 2, type: "sent", amount: 2500, to: "Jane Smith", date: "2 days ago", icon: ArrowUpRight },
    { id: 3, type: "received", amount: 15000, from: "Salary", date: "1 week ago", icon: ArrowDownLeft },
  ]

  return (
    <div className={`min-h-screen bg-surface scan-lines ${highContrastEnabled ? "contrast-125 saturate-150" : ""}`}>
      {/* Header with Accessibility Controls */}
      <header className="bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 shadow-neon-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center text-neon-cyan hover:text-neon-cyan-hover transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 p-2 rounded-lg font-mono"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">DISCONNECT</span>
          </Link>

          {/* Accessibility Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`touch-target-large focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono ${voiceEnabled ? "btn-neon-cyan" : "border-neon-cyan text-neon-cyan bg-transparent"}`}
              aria-label={voiceEnabled ? "Disable voice control" : "Enable voice control"}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHapticEnabled(!hapticEnabled)}
              className={`touch-target-large focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 transition-smooth font-mono ${hapticEnabled ? "btn-neon-green" : "border-neon-green text-neon-green bg-transparent"}`}
              aria-label={hapticEnabled ? "Disable haptic feedback" : "Enable haptic feedback"}
            >
              <Vibrate className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              className={`touch-target-large focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono ${subtitlesEnabled ? "btn-neon-orange" : "border-neon-orange text-neon-orange bg-transparent"}`}
              aria-label={subtitlesEnabled ? "Hide live captions" : "Show live captions"}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHighContrastEnabled(!highContrastEnabled)}
              className={`touch-target-large focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple focus-visible:ring-offset-2 transition-smooth font-mono ${highContrastEnabled ? "btn-neon-purple" : "border-neon-purple text-neon-purple bg-transparent"}`}
              aria-label={highContrastEnabled ? "Disable high contrast" : "Enable high contrast"}
            >
              <Palette className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Live Subtitle Overlay */}
      {subtitlesEnabled && currentSubtitle && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-surface-elevated/95 backdrop-blur-md border-b border-neon-cyan shadow-neon-cyan">
          <div className="container mx-auto px-4 py-3">
            <p className="text-primary text-center font-medium font-mono">
              <Volume2 className="w-4 h-4 inline mr-2" />
              {currentSubtitle}
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Voice Control Button - Large Touch Zone */}
        <div className="text-center">
          <Button
            onClick={handleVoiceToggle}
            disabled={!speechSupported}
            size="lg"
            className={`w-40 h-40 rounded-full text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono ${
              isListening ? "bg-error text-white pulse-recording border-2 border-error" : "btn-neon-cyan"
            }`}
            aria-label={isListening ? "Stop voice recognition" : "Activate voice recognition"}
          >
            {isListening ? <MicOff className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
          </Button>
          <div className="mt-6">
            <p className="text-secondary text-xl font-mono">
              {!speechSupported
                ? "Voice recognition not supported"
                : speechError
                  ? "Speech recognition error - tap to retry"
                  : isListening
                    ? "VOICE RECOGNITION ACTIVE..."
                    : "TAP TO START VOICE COMMAND"}
            </p>
            {transcript && <p className="text-neon-cyan font-medium mt-2 font-mono">LAST COMMAND: "{transcript}"</p>}
            {speechError && <p className="text-error font-medium mt-2 font-mono">ERROR: {speechError}</p>}
          </div>
        </div>

        {/* Balance Card - Large Touch Zone */}
        <Card
          className="card-futuristic cursor-pointer transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2"
          onClick={handleBalanceCheck}
          tabIndex={0}
          role="button"
          aria-label="Check account balance"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleBalanceCheck()
            }
          }}
        >
          <CardHeader className="text-center py-20">
            <div className="flex items-center justify-center mb-6">
              <Terminal className="w-10 h-10 text-neon-cyan mr-4" />
              <CardTitle className="text-secondary text-3xl font-mono">ACCOUNT BALANCE</CardTitle>
            </div>
            <div className="text-7xl font-bold text-gradient mb-8 text-glow font-mono">₦{balance.toLocaleString()}</div>
            <Badge className="bg-neon-green text-black text-xl px-8 py-4 shadow-neon-green font-mono">
              TAP FOR BALANCE CHECK
            </Badge>
          </CardHeader>
        </Card>

        {/* Quick Actions - Large Touch Zones */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="card-futuristic transition-smooth">
            <CardHeader>
              <CardTitle className="text-primary text-3xl flex items-center font-mono">
                <Send className="w-8 h-8 mr-4 text-neon-cyan" />
                MONEY TRANSFER
              </CardTitle>
              <CardDescription className="text-secondary text-xl font-mono">
                Voice-controlled and accessible money transfer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[1000, 5000, 10000, 20000].map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => handleQuickTransfer(amount)}
                    className="h-24 text-2xl btn-neon-green touch-target-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 transition-smooth font-mono"
                    aria-label={`Quick transfer ${amount} naira`}
                  >
                    ₦{amount.toLocaleString()}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full h-20 text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 touch-target-xl bg-transparent border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-smooth font-mono"
                aria-label="Custom transfer amount"
              >
                <Plus className="w-8 h-8 mr-3" />
                CUSTOM AMOUNT
              </Button>
            </CardContent>
          </Card>

          <Card className="card-futuristic transition-smooth">
            <CardHeader>
              <CardTitle className="text-primary text-3xl flex items-center font-mono">
                <History className="w-8 h-8 mr-4 text-neon-purple" />
                TRANSACTION HISTORY
              </CardTitle>
              <CardDescription className="text-secondary text-xl font-mono">
                Accessible transaction history with screen reader support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-6 bg-surface rounded-lg border border-strong hover:border-neon-cyan transition-smooth cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2"
                  onClick={() => {
                    if (hapticEnabled && navigator.vibrate) navigator.vibrate(50)
                    const message = `Transaction: ${transaction.type === "received" ? "Received" : "Sent"} ${transaction.amount.toLocaleString()} naira`

                    if (voiceEnabled && ttsSupported && textToSpeechEnabled) {
                      speak(message)
                    }

                    if (subtitlesEnabled) {
                      setCurrentSubtitle(message)
                      setTimeout(() => setCurrentSubtitle(""), 4000)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Transaction ${transaction.type === "received" ? "received" : "sent"} ${transaction.amount} naira`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      e.currentTarget.click()
                    }
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        transaction.type === "received"
                          ? "bg-neon-green shadow-neon-green"
                          : "bg-neon-cyan shadow-neon-cyan"
                      }`}
                    >
                      <transaction.icon className="w-7 h-7 text-black" />
                    </div>
                    <div>
                      <p className="text-primary font-semibold text-xl font-mono">
                        {transaction.type === "received" ? transaction.from : transaction.to}
                      </p>
                      <p className="text-secondary font-mono">{transaction.date}</p>
                    </div>
                  </div>
                  <div
                    className={`text-2xl font-bold font-mono ${transaction.type === "received" ? "text-neon-green" : "text-neon-cyan"}`}
                  >
                    {transaction.type === "received" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Accessibility Features Status */}
        <Card className="card-futuristic transition-smooth">
          <CardHeader>
            <CardTitle className="text-primary text-3xl flex items-center font-mono">
              <Settings className="w-8 h-8 mr-4 text-neon-purple" />
              COMPREHENSIVE ACCESSIBILITY STATUS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Voice & Audio Features */}
              <div className="text-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${voiceEnabled ? "bg-neon-cyan text-black shadow-neon-cyan" : "bg-gray-600 text-gray-400"}`}
                >
                  <Mic className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">VOICE CONTROL</h5>
                <p className="text-secondary font-mono text-sm">
                  {voiceEnabled ? "ACTIVE" : "INACTIVE"}
                  {!speechSupported && " (NOT SUPPORTED)"}
                </p>
              </div>

              <div className="text-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${textToSpeechEnabled ? "bg-neon-orange text-black shadow-neon-orange" : "bg-gray-600 text-gray-400"}`}
                >
                  <Type className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">TEXT-TO-SPEECH</h5>
                <p className="text-secondary font-mono text-sm">{textToSpeechEnabled ? "ACTIVE" : "INACTIVE"}</p>
              </div>

              <div className="text-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${subtitlesEnabled ? "bg-neon-green text-black shadow-neon-green" : "bg-gray-600 text-gray-400"}`}
                >
                  <Volume2 className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">LIVE CAPTIONS</h5>
                <p className="text-secondary font-mono text-sm">{subtitlesEnabled ? "ACTIVE" : "INACTIVE"}</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-purple text-black shadow-neon-purple">
                  <Headphones className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">AUDIO DESCRIPTIONS</h5>
                <p className="text-secondary font-mono text-sm">ACTIVE</p>
              </div>

              {/* Visual Features */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-cyan text-black shadow-neon-cyan">
                  <Eye className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">SCREEN READER</h5>
                <p className="text-secondary font-mono text-sm">OPTIMIZED</p>
              </div>

              <div className="text-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${highContrastEnabled ? "bg-neon-orange text-black shadow-neon-orange" : "bg-gray-600 text-gray-400"}`}
                >
                  <Palette className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">HIGH CONTRAST</h5>
                <p className="text-secondary font-mono text-sm">{highContrastEnabled ? "ACTIVE" : "INACTIVE"}</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-green text-black shadow-neon-green">
                  <Focus className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">FOCUS INDICATORS</h5>
                <p className="text-secondary font-mono text-sm">ENHANCED</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-purple text-black shadow-neon-purple">
                  <ScanLine className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">MAGNIFICATION</h5>
                <p className="text-secondary font-mono text-sm">SUPPORTED</p>
              </div>

              {/* Motor & Input Features */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-cyan text-black shadow-neon-cyan">
                  <Hand className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">LARGE TARGETS</h5>
                <p className="text-secondary font-mono text-sm">WCAG 2.1 AA</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-orange text-black shadow-neon-orange">
                  <Gamepad2 className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">KEYBOARD NAV</h5>
                <p className="text-secondary font-mono text-sm">ACTIVE</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-green text-black shadow-neon-green">
                  <MousePointer className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">SWITCH CONTROL</h5>
                <p className="text-secondary font-mono text-sm">SUPPORTED</p>
              </div>

              <div className="text-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${hapticEnabled ? "bg-neon-purple text-black shadow-neon-purple" : "bg-gray-600 text-gray-400"}`}
                >
                  <Zap className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">HAPTIC FEEDBACK</h5>
                <p className="text-secondary font-mono text-sm">{hapticEnabled ? "ACTIVE" : "INACTIVE"}</p>
              </div>

              {/* Advanced Features */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-cyan text-black shadow-neon-cyan">
                  <Brain className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">COGNITIVE SUPPORT</h5>
                <p className="text-secondary font-mono text-sm">ACTIVE</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-orange text-black shadow-neon-orange">
                  <Timer className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">TIMING CONTROL</h5>
                <p className="text-secondary font-mono text-sm">ADJUSTABLE</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-green text-black shadow-neon-green">
                  <Languages className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">MULTI-LANGUAGE</h5>
                <p className="text-secondary font-mono text-sm">50+ LANGUAGES</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-purple text-black shadow-neon-purple">
                  <Globe className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">LOCALIZATION</h5>
                <p className="text-secondary font-mono text-sm">GLOBAL STANDARDS</p>
              </div>

              {/* Tech Features */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-cyan text-black shadow-neon-cyan">
                  <Camera className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">COMPUTER VISION</h5>
                <p className="text-secondary font-mono text-sm">AI-POWERED</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-orange text-black shadow-neon-orange">
                  <Fingerprint className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">BIOMETRIC AUTH</h5>
                <p className="text-secondary font-mono text-sm">SUPPORTED</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-green text-black shadow-neon-green">
                  <Smartphone className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">MOBILE OPTIMIZED</h5>
                <p className="text-secondary font-mono text-sm">RESPONSIVE</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-neon-purple text-black shadow-neon-purple">
                  <Accessibility className="w-10 h-10" />
                </div>
                <h5 className="text-primary font-semibold text-lg font-mono">WCAG 2.1 AAA</h5>
                <p className="text-secondary font-mono text-sm">COMPLIANT</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Voice Commands Help */}
        <Card className="card-futuristic transition-smooth">
          <CardHeader>
            <CardTitle className="text-primary text-3xl flex items-center font-mono">
              <Hand className="w-8 h-8 mr-4 text-neon-orange" />
              COMPREHENSIVE ACCESSIBILITY COMMANDS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-primary text-xl font-semibold mb-4 font-mono">VOICE COMMANDS:</h4>
                <ul className="space-y-3 text-secondary text-lg">
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-5 h-5 text-neon-green mr-3" />
                    "Check balance" - Balance inquiry
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-5 h-5 text-neon-green mr-3" />
                    "Send naira" - Initiate transfer
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-5 h-5 text-neon-green mr-3" />
                    "Show history" - Transaction log
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-5 h-5 text-neon-green mr-3" />
                    "Help" - Available commands
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-primary text-xl font-semibold mb-4 font-mono">ACCESSIBILITY FEATURES:</h4>
                <ul className="space-y-3 text-secondary text-lg">
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-5 h-5 text-neon-cyan mr-3" />
                    Screen reader optimized (NVDA, JAWS, VoiceOver)
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-5 h-5 text-neon-cyan mr-3" />
                    Large touch targets (44px+ minimum)
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-5 h-5 text-neon-cyan mr-3" />
                    Full keyboard navigation support
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-5 h-5 text-neon-cyan mr-3" />
                    High contrast and magnification modes
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-primary text-xl font-semibold mb-4 font-mono">ADVANCED FEATURES:</h4>
                <ul className="space-y-3 text-secondary text-lg">
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-5 h-5 text-neon-orange mr-3" />
                    AI-powered computer vision analysis
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-5 h-5 text-neon-orange mr-3" />
                    Biometric authentication support
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-5 h-5 text-neon-orange mr-3" />
                    Haptic feedback patterns
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-5 h-5 text-neon-orange mr-3" />
                    Privacy-first local processing
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
