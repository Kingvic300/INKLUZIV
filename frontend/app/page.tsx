'use client'; 

import { useState, useEffect } from 'react'; 
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Mic, Eye, Hand, Ear, Shield, Brain, Wifi, Accessibility, 
  Vibrate, Palette, Focus, ScanLine, Headphones, Type, Volume2, 
  Timer, Languages, Camera, Fingerprint, Smartphone, Globe, Menu, X,
  Coins, TrendingUp, Lock, Award
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
        const welcomeMessage = "Welcome to INKLUZIV - Your voice-powered DeFi gateway. Earn yield on your USDT through simple voice commands."
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
    
    if (command.includes("wallet") || command.includes("defi") || command.includes("save")) {
      response = "Redirecting to your DeFi wallet. Start earning yield on your USDT today."
      window.location.href = "/login"
    } else if (command.includes("passport") || command.includes("trust")) {
      response = "Learn about building your on-chain trust passport through consistent savings."
      window.location.href = "/login"
    } else if (command.includes("help")) {
      response = "Available commands: Try DeFi wallet, Build trust passport, or say help for this menu."
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
              <p className="text-sm text-neon-cyan font-mono animate-pulse hidden sm:block">Voice-powered DeFi for everyone</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-3">
            <Link href="/login">
              <Button className="btn-neon-cyan touch-target-large transition-smooth font-mono">
                <Coins className="w-4 h-4 mr-2" />
                Launch DeFi
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-surface-elevated/95 backdrop-blur-lg border-t border-neon-cyan/30">
            <div className="container mx-auto px-4 py-8 flex flex-col space-y-4">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full justify-center btn-neon-cyan">
                  <Coins className="w-4 h-4 mr-2" />
                  Launch DeFi
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
              VOICE-POWERED DEFI GATEWAY
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-8 leading-tight float">
            EARN YIELD
            <br />
            <span className="text-gradient text-glow">WITH YOUR VOICE</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Put your USDT to work in high-yield DeFi protocols using simple voice commands. 
            Build your on-chain trust passport and unlock premium financial services.
            <br />
            <strong className="text-neon-cyan text-glow">Say "Save 50 USDT" and watch your money grow.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login">
              <Button size="lg" className="btn-neon-cyan text-lg md:text-xl px-10 md:px-12 py-5 md:py-6 transition-smooth font-mono">
                <TrendingUp className="w-5 md:w-6 h-5 md:h-6 mr-3" />
                START EARNING YIELD
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg md:text-xl px-10 md:px-12 py-5 md:py-6 border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black bg-transparent transition-smooth font-mono">
                <Award className="w-5 md:w-6 h-5 md:h-6 mr-3" />
                BUILD TRUST PASSPORT
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* DeFi Features */}
      <section className="py-20 md:py-24 px-4 bg-surface-elevated/50">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6">VOICE-CONTROLLED DEFI</h3>
            <p className="text-lg md:text-xl text-muted-foreground">Earn yield on your USDT through simple voice commands</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-futuristic border-holographic">
              <CardHeader>
                <div className="w-16 h-16 bg-neon-cyan rounded-lg flex items-center justify-center mb-6 shadow-neon-cyan">
                  <Mic className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="text-2xl text-primary">VOICE DEPOSITS</CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  "Save 100 USDT" - Instantly deposit into high-yield protocols
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-futuristic border-holographic">
              <CardHeader>
                <div className="w-16 h-16 bg-neon-green rounded-lg flex items-center justify-center mb-6 shadow-neon-green">
                  <TrendingUp className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="text-2xl text-primary">AUTO YIELD</CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Earn stable returns on Celo Mento and other DeFi protocols
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-futuristic border-holographic">
              <CardHeader>
                <div className="w-16 h-16 bg-neon-orange rounded-lg flex items-center justify-center mb-6 shadow-neon-orange">
                  <Award className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="text-2xl text-primary">TRUST PASSPORT</CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Build on-chain reputation to unlock loans and premium services
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-24 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold text-primary mb-8">HOW IT WORKS</h3>
          <div className="max-w-5xl mx-auto mb-12 md:mb-16">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="card-futuristic p-8 md:p-12 rounded-lg border-holographic">
                <h4 className="text-2xl md:text-3xl font-bold text-neon-cyan mb-8">VOICE DEFI GATEWAY</h4>
                <div className="space-y-6 text-left">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center text-black font-bold">1</div>
                    <div>
                      <h5 className="text-lg font-semibold text-primary mb-2">Speak Your Intent</h5>
                      <p className="text-secondary">"Save 50 USDT" or "Check my yield"</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center text-black font-bold">2</div>
                    <div>
                      <h5 className="text-lg font-semibold text-primary mb-2">AI Understands</h5>
                      <p className="text-secondary">OpenAI processes your command into DeFi actions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center text-black font-bold">3</div>
                    <div>
                      <h5 className="text-lg font-semibold text-primary mb-2">Secure Execution</h5>
                      <p className="text-secondary">Confirm with voice passphrase, earn yield automatically</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-futuristic p-8 md:p-12 rounded-lg border-holographic">
                <h4 className="text-2xl md:text-3xl font-bold text-neon-orange mb-8">TRUST PASSPORT</h4>
                <div className="space-y-6 text-left">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-neon-orange rounded-full flex items-center justify-center text-black font-bold">1</div>
                    <div>
                      <h5 className="text-lg font-semibold text-primary mb-2">Save Consistently</h5>
                      <p className="text-secondary">Make regular deposits to build your reputation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-neon-orange rounded-full flex items-center justify-center text-black font-bold">2</div>
                    <div>
                      <h5 className="text-lg font-semibold text-primary mb-2">Earn Passport</h5>
                      <p className="text-secondary">Get a Soulbound Token proving your reliability</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-neon-orange rounded-full flex items-center justify-center text-black font-bold">3</div>
                    <div>
                      <h5 className="text-lg font-semibold text-primary mb-2">Unlock Loans</h5>
                      <p className="text-secondary">Access micro-loans and premium DeFi services</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="py-20 md:py-24 px-4 bg-surface-elevated/50">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6">ACCESSIBLE DEFI FOR ALL</h3>
            <p className="text-lg md:text-xl text-muted-foreground">Complete accessibility solution for DeFi participation</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[ 
              { icon: Mic, title: 'VOICE DEFI', description: 'Control DeFi protocols with voice commands', color: 'cyan' }, 
              { icon: Type, title: 'YIELD TTS', description: 'Audio feedback for all DeFi operations', color: 'orange' }, 
              { icon: Volume2, title: 'DEFI CAPTIONS', description: 'Live subtitles for yield farming', color: 'purple' }, 
              { icon: Headphones, title: 'PROTOCOL AUDIO', description: 'Audio descriptions for DeFi protocols', color: 'green' }, 
              { icon: Eye, title: 'DEFI READER', description: 'Screen reader optimized for DeFi', color: 'cyan' }, 
              { icon: Palette, title: 'YIELD CONTRAST', description: 'High contrast mode for yield interfaces', color: 'orange' }, 
              { icon: Focus, title: 'DEFI FOCUS', description: 'Clear focus indicators for DeFi forms', color: 'purple' }, 
              { icon: ScanLine, title: 'PROTOCOL ZOOM', description: 'Magnification for DeFi protocols', color: 'green' }, 
              { icon: Hand, title: 'DEFI TARGETS', description: 'Large touch zones for DeFi buttons', color: 'cyan' }, 
              { icon: Vibrate, title: 'YIELD HAPTIC', description: 'Tactile feedback for yield confirmations', color: 'orange' }, 
              { icon: Brain, title: 'SIMPLE DEFI', description: 'Simplified DeFi terminology', color: 'purple' }, 
              { icon: Timer, title: 'YIELD TIME', description: 'Extended timeouts for DeFi operations', color: 'green' }, 
              { icon: Languages, title: 'GLOBAL DEFI', description: 'Multi-language DeFi support', color: 'cyan' }, 
              { icon: Camera, title: 'QR DEFI', description: 'Voice-guided QR code DeFi scanning', color: 'orange' }, 
              { icon: Fingerprint, title: 'DEFI BIOMETRIC', description: 'Voice authentication for DeFi access', color: 'purple' }, 
              { icon: Shield, title: 'SECURE DEFI', description: 'Private key protection with accessibility', color: 'green' }
            ].map((feature, index) => {
              const Icon = feature.icon; 
              const colorClass = `neon-${feature.color}`; 
              return (
                <Card key={index} className="card-futuristic p-6">
                  <CardContent className="p-0">
                    <div className={`w-14 h-14 bg-${colorClass} rounded-lg flex items-center justify-center mb-4 shadow-${colorClass}`}>
                      <Icon className="w-7 h-7 text-black" />
                    </div>
                    <CardTitle className="text-lg text-primary mb-3">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6">READY TO EARN YIELD?</h3>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Join the voice-powered DeFi revolution. Start earning yield on your USDT with simple voice commands.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login">
              <Button size="lg" className="btn-neon-orange text-lg md:text-xl px-12 md:px-16 py-6 md:py-8 transition-smooth font-mono">
                <TrendingUp className="w-5 md:w-6 h-5 md:h-6 mr-3" />
                START EARNING NOW
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg md:text-xl px-12 md:px-16 py-6 md:py-8 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black bg-transparent transition-smooth font-mono">
                <Award className="w-5 md:w-6 h-5 md:h-6 mr-3" />
                BUILD TRUST PASSPORT
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-elevated/80 border-t border-neon-cyan/30 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-neon-orange rounded-lg flex items-center justify-center shimmer">
              <Accessibility className="w-5 h-5 text-black" />
            </div>
            <span className="text-muted-foreground text-lg">© 2025 INKLUZIV</span>
          </div>
          <p className="text-secondary text-matrix">Voice-powered DeFi for everyone</p>
        </div>
      </footer>
    </div>
  )
}