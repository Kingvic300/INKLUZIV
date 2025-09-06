'use client'; 

import { useState, useEffect } from 'react'; 
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Mic, Eye, Hand, Ear, Code, Shield, Brain, Wifi, Book, Accessibility, Gamepad2, MousePointer,
  Vibrate, Palette, Focus, ScanLine, Headphones, Type, Volume2, Timer, Languages, Camera,
  Fingerprint, Smartphone, Globe, Menu, X
} from "lucide-react"
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  
  const { toast } = useToast()
  const { isListening, transcript, isSupported: speechSupported, startListening, stopListening } = useSpeechRecognition()
  const { speak, isSupported: ttsSupported } = useSpeechSynthesis()

  useEffect(() => {
    if (voiceEnabled && ttsSupported) {
      const timer = setTimeout(() => {
        const welcomeMessage = "Welcome to INKLUZIV - the future of accessible blockchain finance. Navigate with voice commands or explore our USDT wallet demo."
        speak(welcomeMessage)
        setCurrentSubtitle(welcomeMessage)
        setTimeout(() => setCurrentSubtitle(""), 8000)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [voiceEnabled, ttsSupported])

  useEffect(() => {
    if (transcript) {
      processVoiceCommand(transcript.toLowerCase())
    }
  }, [transcript])

  const processVoiceCommand = (command: string) => {
    let response = ""
    
    if (command.includes("wallet") || command.includes("demo")) {
      response = "Redirecting to wallet demo. You'll need to authenticate first."
      window.location.href = "/login"
    } else if (command.includes("docs") || command.includes("documentation")) {
      response = "Opening documentation."
      window.location.href = "/docs"
    } else if (command.includes("sdk")) {
      response = "Opening SDK page."
      window.location.href = "/sdk"
    } else if (command.includes("help")) {
      response = "Available commands: Try wallet demo, View docs, Access SDK, or say help for this menu."
    } else {
      response = "Command not recognized. Say 'help' for available commands."
    }

    if (voiceEnabled && ttsSupported && response) {
      speak(response)
      setCurrentSubtitle(response)
      setTimeout(() => setCurrentSubtitle(""), 4000)
    }
    
    if (response) {
      toast({ title: "Voice Command", description: response })
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
      setCurrentSubtitle("Voice recognition active... Say your command")
      startListening()
    }
  }

  return (
    <div className="min-h-screen bg-surface scan-lines">
      {/* Voice Control Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleVoiceToggle}
          disabled={!speechSupported}
          size="lg"
          className={`w-16 h-16 rounded-full transition-smooth font-mono ${
            isListening
              ? "bg-error text-white pulse-recording border-2 border-error"
              : "btn-neon-cyan"
          }`}
          aria-label={isListening ? "Stop voice recognition" : "Activate voice recognition"}
        >
          <Mic className="w-8 h-8" />
        </Button>
      </div>

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

      {/* Header */}
      <header className="bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 sticky top-0 z-50 shadow-neon-cyan/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neon-orange rounded-lg flex items-center justify-center shimmer">
              <Accessibility className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient text-glow font-mono">INKLUZIV</h1>
              <p className="text-sm text-neon-cyan font-mono animate-pulse hidden sm:block">Blockchain accessibility for all.</p>
            </div>
          </Link>

          {/* Desktop Navigation with "Experience Demo" removed */}
          <div className="hidden md:flex space-x-3">
            <Link href="/docs">
              <Button
                variant="outline"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 touch-target-large bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono"
              >
                <Book className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            </Link>
            <Link href="/sdk">
              <Button className="btn-neon-cyan touch-target-large transition-smooth font-mono">
                Access SDK
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-primary hover:bg-surface-elevated">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Flyout with "Experience Demo" removed */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-surface-elevated/95 backdrop-blur-lg border-t border-neon-cyan/30">
            <div className="container mx-auto px-4 py-8 flex flex-col space-y-4">
              <Link href="/docs" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center border-neon-green text-neon-green hover:bg-neon-green hover:text-black">
                  <Book className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
              </Link>
              <Link href="/sdk" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full justify-center btn-neon-cyan">
                  Access SDK
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-grid-move"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="text-neon-orange text-sm bg-neon-orange/10 border border-neon-orange/30 px-4 py-2 rounded-lg backdrop-blur-sm font-mono tracking-widest">
              BLOCKCHAIN FOR EVERYONE
            </span>
          </div>
          {/* KEY FIX: More aggressive responsive font scaling for the main heading */}
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-8 leading-tight float">
            BLOCKCHAIN
            <br />
            <span className="text-gradient text-glow">ACCESSIBILITY</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Revolutionary USDT wallet with voice control. Send, receive, and manage cryptocurrency with complete accessibility.
            <br />
            <strong className="text-neon-cyan text-glow">INKLUZIV - Your voice-controlled crypto wallet.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login">
              <Button size="lg" className="btn-neon-cyan text-lg md:text-xl px-10 md:px-12 py-5 md:py-6 transition-smooth font-mono">
                <Wifi className="w-5 md:w-6 h-5 md:h-6 mr-3" />
                TRY USDT WALLET
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="text-lg md:text-xl px-10 md:px-12 py-5 md:py-6 border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black bg-transparent transition-smooth font-mono">
                <Code className="w-5 md:w-6 h-5 md:h-6 mr-3" />
                VIEW DOCS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 md:py-24 px-4 bg-surface-elevated/50">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6">THE CHALLENGE</h3>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Cryptocurrency wallets exclude millions of users with disabilities</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-futuristic border-holographic"><CardHeader><div className="w-16 h-16 bg-neon-orange rounded-lg flex items-center justify-center mb-6 shadow-neon-orange"><Eye className="w-8 h-8 text-black" /></div><CardTitle className="text-2xl text-primary">VISUAL BARRIERS</CardTitle><CardDescription className="text-muted-foreground text-lg">Complex crypto interfaces without screen reader support</CardDescription></CardHeader></Card>
            <Card className="card-futuristic border-holographic"><CardHeader><div className="w-16 h-16 bg-neon-cyan rounded-lg flex items-center justify-center mb-6 shadow-neon-cyan"><Ear className="w-8 h-8 text-black" /></div><CardTitle className="text-2xl text-primary">AUDIO LIMITATIONS</CardTitle><CardDescription className="text-muted-foreground text-lg">No voice control for blockchain transactions</CardDescription></CardHeader></Card>
            <Card className="card-futuristic border-holographic"><CardHeader><div className="w-16 h-16 bg-neon-purple rounded-lg flex items-center justify-center mb-6 shadow-neon-purple"><Hand className="w-8 h-8 text-black" /></div><CardTitle className="text-2xl text-primary">MOTOR CHALLENGES</CardTitle><CardDescription className="text-muted-foreground text-lg">Complex wallet operations require precise input</CardDescription></CardHeader></Card>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 md:py-24 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold text-primary mb-8">THE SOLUTION</h3>
          <div className="max-w-5xl mx-auto mb-12 md:mb-16">
            <p className="text-lg md:text-xl text-muted-foreground mb-12">A <strong className="text-neon-cyan text-glow">voice-controlled USDT wallet</strong> with complete accessibility</p>
            <div className="card-futuristic p-8 md:p-12 rounded-lg border-holographic">
              <h4 className="text-2xl md:text-3xl font-bold text-primary mb-12">INKLUZIV WALLET ENABLES CRYPTO ACCESS FOR:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <div className="text-center float" style={{ animationDelay: "0s" }}><div className="w-20 h-20 md:w-24 md:h-24 bg-neon-cyan rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-cyan pulse-glow"><Eye className="w-10 h-10 md:w-12 md:h-12 text-black" /></div><h5 className="text-lg md:text-xl font-semibold text-primary">VISUAL</h5></div>
                <div className="text-center float" style={{ animationDelay: "1.5s" }}><div className="w-20 h-20 md:w-24 md:h-24 bg-neon-orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-orange pulse-glow"><Hand className="w-10 h-10 md:w-12 md:h-12 text-black" /></div><h5 className="text-lg md:text-xl font-semibold text-primary">MOTOR</h5></div>
                <div className="text-center float" style={{ animationDelay: "3s" }}><div className="w-20 h-20 md:w-24 md:h-24 bg-neon-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-purple pulse-glow"><Ear className="w-10 h-10 md:w-12 md:h-12 text-black" /></div><h5 className="text-lg md:text-xl font-semibold text-primary">HEARING</h5></div>
                <div className="text-center float" style={{ animationDelay: "4.5s" }}><div className="w-20 h-20 md:w-24 md:h-24 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-green pulse-glow"><Brain className="w-10 h-10 md:w-12 md:h-12 text-black" /></div><h5 className="text-lg md:text-xl font-semibold text-primary">COGNITIVE</h5></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Features */}
      <section className="py-20 md:py-24 px-4 bg-surface-elevated/50">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6">COMPREHENSIVE FEATURES</h3>
            <p className="text-lg md:text-xl text-muted-foreground">Complete accessibility solution for cryptocurrency wallets</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[ { icon: Mic, title: 'VOICE TRANSACTIONS', description: 'Send USDT using voice commands only', color: 'cyan' }, { icon: Type, title: 'WALLET TTS', description: 'Audio feedback for all wallet operations', color: 'orange' }, { icon: Volume2, title: 'CRYPTO CAPTIONS', description: 'Live subtitles for blockchain interactions', color: 'purple' }, { icon: Headphones, title: 'TRANSACTION AUDIO', description: 'Audio descriptions for all crypto operations', color: 'green' }, { icon: Eye, title: 'WALLET READER', description: 'Screen reader optimized for crypto wallets', color: 'cyan' }, { icon: Palette, title: 'CRYPTO CONTRAST', description: 'High contrast mode for wallet interfaces', color: 'orange' }, { icon: Focus, title: 'WALLET FOCUS', description: 'Clear focus indicators for crypto forms', color: 'purple' }, { icon: ScanLine, title: 'ADDRESS ZOOM', description: 'Magnification for wallet addresses', color: 'green' }, { icon: Hand, title: 'CRYPTO TARGETS', description: 'Large touch zones for wallet buttons', color: 'cyan' }, { icon: Gamepad2, title: 'WALLET KEYBOARD', description: 'Full keyboard control for transactions', color: 'orange' }, { icon: MousePointer, title: 'CRYPTO SWITCH', description: 'Switch control for blockchain operations', color: 'purple' }, { icon: Vibrate, title: 'TRANSACTION HAPTIC', description: 'Tactile feedback for crypto confirmations', color: 'green' }, { icon: Brain, title: 'SIMPLE CRYPTO', description: 'Simplified blockchain terminology', color: 'cyan' }, { icon: Timer, title: 'TRANSACTION TIME', description: 'Extended timeouts for crypto operations', color: 'orange' }, { icon: Languages, title: 'GLOBAL CRYPTO', description: 'Multi-language blockchain support', color: 'purple' }, { icon: Globe, title: 'CRYPTO REGIONS', description: 'Regional cryptocurrency standards', color: 'green' }, { icon: Camera, title: 'QR SCANNING', description: 'Voice-guided QR code wallet scanning', color: 'cyan' }, { icon: Fingerprint, title: 'CRYPTO BIOMETRIC', description: 'Voice authentication for wallet access', color: 'orange' }, { icon: Smartphone, title: 'MOBILE WALLET', description: 'Mobile-first cryptocurrency interface', color: 'purple' }, { icon: Shield, title: 'SECURE CRYPTO', description: 'Private key protection with accessibility', color: 'green' }].map((feature, index) => {const Icon = feature.icon; const colorClass = `neon-${feature.color}`; return (<Card key={index} className="card-futuristic p-6"><CardContent className="p-0"><div className={`w-14 h-14 bg-${colorClass} rounded-lg flex items-center justify-center mb-4 shadow-${colorClass}`}><Icon className="w-7 h-7 text-black" /></div><CardTitle className="text-lg text-primary mb-3">{feature.title}</CardTitle><CardDescription className="text-muted-foreground text-sm">{feature.description}</CardDescription></CardContent></Card>)})}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6">READY TO BUILD ACCESSIBLE?</h3>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">Join the crypto accessibility revolution. Experience voice-controlled USDT transactions.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login"><Button size="lg" className="btn-neon-orange text-lg md:text-xl px-12 md:px-16 py-6 md:py-8 transition-smooth font-mono">TRY USDT WALLET</Button></Link>
            <Link href="/docs"><Button size="lg" variant="outline" className="text-lg md:text-xl px-12 md:px-16 py-6 md:py-8 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black bg-transparent transition-smooth font-mono"><Code className="w-5 md:w-6 h-5 md:h-6 mr-4" />VIEW DOCS</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-elevated/80 border-t border-neon-cyan/30 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-neon-orange rounded-lg flex items-center justify-center shimmer"><Accessibility className="w-5 h-5 text-black" /></div>
            <span className="text-muted-foreground text-lg">© 2025 INKLUZIV</span>
          </div>
          <p className="text-secondary text-matrix">Making cryptocurrency accessible for everyone</p>
        </div>
      </footer>
    </div>
  )
}