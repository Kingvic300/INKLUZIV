"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Mic,
  Eye,
  Hand,
  Ear,
  Code,
  ArrowRight,
  Shield,
  Cpu,
  Wifi,
  Brain,
  Gamepad2,
  Type,
  Volume2,
  MousePointer,
  Smartphone,
  Globe,
  Languages,
  Timer,
  Accessibility,
  Focus,
  Palette,
  ScanLine,
  Headphones,
  Vibrate,
  Camera,
  Fingerprint,
  Book,
  MicOff,
  VolumeX,
  Play,
  Pause,
} from "lucide-react"

export default function HomePage() {
  const [isListening, setIsListening] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentSection, setCurrentSection] = useState("")
  const router = useRouter()
  const speechSynthesis = useRef<SpeechSynthesis | null>(null)
  const recognition = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis
    }

    // Initialize speech recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognition.current = new SpeechRecognition()
      recognition.current.continuous = true
      recognition.current.interimResults = false
      recognition.current.lang = 'en-US'

      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim()
        console.log('Voice command:', transcript)
        handleVoiceCommand(transcript)
      }

      recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.current.onend = () => {
        if (isListening) {
          // Restart if we're still supposed to be listening
          recognition.current?.start()
        }
      }
    }

    // Welcome message
    setTimeout(() => {
      speak("Welcome to INKLUZIV. Breaking barriers in digital finance. Say 'help' for voice commands or navigate with Tab key.")
    }, 1500)

    return () => {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel()
      }
      if (recognition.current) {
        recognition.current.abort()
      }
    }
  }, [])

  const speak = (text: string) => {
    if (!speechEnabled || !speechSynthesis.current) return
    
    speechSynthesis.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    
    speechSynthesis.current.speak(utterance)
  }

  const handleVoiceCommand = (command: string) => {
    console.log('Processing command:', command)
    
    if (command.includes('experience demo') || command.includes('try demo') || command.includes('demo')) {
      speak("Navigating to experience demo")
      router.push('/register')
    } else if (command.includes('banking') || command.includes('banking demo')) {
      speak("Opening banking demo")
      router.push('/banking')
    } else if (command.includes('documentation') || command.includes('docs') || command.includes('view docs')) {
      speak("Opening documentation")
      router.push('/docs')
    } else if (command.includes('sdk') || command.includes('access sdk')) {
      speak("Opening SDK")
      router.push('/sdk')
    } else if (command.includes('register') || command.includes('sign up')) {
      speak("Opening registration")
      router.push('/register')
    } else if (command.includes('help') || command.includes('commands')) {
      speak("Available voice commands: Say 'experience demo' to try the demo, 'banking demo' for banking, 'docs' for documentation, 'SDK' for the software development kit, or 'help' to repeat this message.")
    } else if (command.includes('read page') || command.includes('read content')) {
      readPageContent()
    } else if (command.includes('stop') || command.includes('quiet')) {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel()
      }
    } else {
      // If command not recognized, provide helpful feedback
      if (command.length > 2) { // Only for substantial input
        speak("Command not recognized. Say 'help' for available commands or 'experience demo' to try the demo.")
      }
    }
  }

  const toggleVoiceListening = () => {
    if (!recognition.current) {
      speak("Voice recognition not supported in this browser")
      return
    }

    if (isListening) {
      recognition.current.stop()
      setIsListening(false)
      speak("Voice commands disabled")
    } else {
      recognition.current.start()
      setIsListening(true)
      speak("Voice commands enabled. Say 'experience demo' to try the demo or 'help' for more commands.")
    }
  }

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled)
    if (speechSynthesis.current && isSpeaking) {
      speechSynthesis.current.cancel()
    }
    // Don't announce the toggle to avoid confusion
  }

  const readPageContent = () => {
    const content = `
      INKLUZIV homepage. No limits, just access. 
      This page showcases our accessibility SDK for financial applications.
      
      Main sections include:
      The Challenge: Digital finance excludes millions with disabilities
      The Solution: A comprehensive accessibility SDK
      Features: Voice control, screen reader support, high contrast modes, and more
      
      Use the navigation buttons to experience our demo, view documentation, or access the SDK.
      Say 'experience demo' to try our accessible financial interface.
    `
    speak(content)
  }

  const announceSection = (sectionName: string) => {
    if (currentSection !== sectionName) {
      setCurrentSection(sectionName)
      speak(`Entering ${sectionName} section`)
    }
  }

  return (
    <div className="min-h-screen bg-surface scan-lines">
      {/* Accessibility Controls Bar */}
      <div className="bg-surface-elevated/90 border-b border-neon-cyan/20 px-4 py-2 flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-neon-cyan font-mono">ACCESSIBILITY CONTROLS:</span>
          <Button
            onClick={toggleVoiceListening}
            size="sm"
            variant="outline"
            className={`border-neon-cyan text-xs font-mono ${
              isListening 
                ? "bg-neon-cyan text-black animate-pulse" 
                : "text-neon-cyan hover:bg-neon-cyan hover:text-black"
            }`}
            aria-label={isListening ? "Disable voice commands" : "Enable voice commands"}
          >
            {isListening ? <MicOff className="w-3 h-3 mr-1" /> : <Mic className="w-3 h-3 mr-1" />}
            {isListening ? "LISTENING" : "VOICE"}
          </Button>
          
          <Button
            onClick={readPageContent}
            size="sm"
            variant="outline"
            className="border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black text-xs font-mono"
            aria-label="Read page content aloud"
          >
            <Play className="w-3 h-3 mr-1" />
            READ
          </Button>
          
          <Button
            onClick={toggleSpeech}
            size="sm"
            variant="outline"
            className={`border-neon-purple text-xs font-mono ${
              speechEnabled 
                ? "text-neon-purple hover:bg-neon-purple hover:text-black" 
                : "text-muted-foreground border-muted-foreground"
            }`}
            aria-label={speechEnabled ? "Disable speech" : "Enable speech"}
          >
            {speechEnabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
            {speechEnabled ? "AUDIO ON" : "AUDIO OFF"}
          </Button>
        </div>
        
        <div className="text-neon-green font-mono text-xs">
          {isListening && "🎤 SAY 'EXPERIENCE DEMO' TO START"}
        </div>
      </div>

      {/* Header */}
      <header 
        className="bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 sticky top-0 z-50 shadow-neon-cyan/20"
        onFocus={() => announceSection("header navigation")}
        tabIndex={0}
        role="banner"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neon-orange rounded-lg flex items-center justify-center shimmer">
              <Accessibility className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient text-glow font-mono">INKLUZIV</h1>
              <p className="text-sm text-neon-cyan font-mono animate-pulse">No limits. Just access.</p>
            </div>
          </div>
          <nav className="flex space-x-3" role="navigation" aria-label="Main navigation">
            <Link href="/register">
              <Button 
                className="btn-neon-orange touch-target-large transition-smooth font-mono"
                onFocus={() => speak("Experience Demo button")}
                aria-describedby="demo-description"
              >
                <Wifi className="w-4 h-4 mr-2" />
                Experience Demo
              </Button>
            </Link>
            <Link href="/banking">
              <Button
                variant="outline"
                className="px-12 py-6 border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
                onFocus={() => speak("Banking Demo button")}
              >
                <Cpu className="w-4 h-4 mr-2" />
                Banking Demo
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                variant="outline"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 touch-target-large bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono"
                onFocus={() => speak("Documentation button")}
              >
                <Book className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            </Link>
            <Link href="/sdk">
              <Button 
                className="btn-neon-cyan touch-target-large transition-smooth font-mono"
                onFocus={() => speak("Access SDK button")}
              >
                Access SDK
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="py-24 px-4 relative overflow-hidden"
        onFocus={() => announceSection("hero")}
        tabIndex={0}
        role="main"
        aria-labelledby="hero-title"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-grid-move"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <span 
              className="text-neon-orange text-sm bg-neon-orange/10 border border-neon-orange/30 px-4 py-2 rounded-lg backdrop-blur-sm font-mono tracking-widest"
              role="banner"
            >
              NO LIMITS. JUST ACCESS.
            </span>
          </div>
          <h2 
            id="hero-title"
            className="text-6xl md:text-8xl font-bold text-primary mb-8 leading-tight float"
            tabIndex={0}
            onFocus={() => speak("Main heading: Accessibility Redefined")}
          >
            ACCESSIBILITY
            <br />
            <span className="text-gradient text-glow">REDEFINED</span>
          </h2>
          <p 
            className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
            tabIndex={0}
            onFocus={() => speak("Breaking barriers in digital finance. Making DeFi accessible for everyone. INKLUZIV empowers universal access.")}
          >
            Breaking barriers in digital finance. Making DeFi accessible for everyone.
            <br />
            <strong className="text-neon-cyan text-glow">INKLUZIV empowers universal access.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center" role="group" aria-label="Call to action buttons">
            <Link href="/register">
              <Button
                size="lg"
                className="btn-neon-cyan text-xl px-12 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono"
                onFocus={() => speak("Experience Demo - Try our accessible financial interface")}
                aria-describedby="demo-description"
              >
                <Wifi className="w-6 h-6 mr-3" />
                EXPERIENCE DEMO
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-12 py-6 border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
                onFocus={() => speak("View Documentation - Access our technical guides")}
              >
                <Code className="w-6 h-6 mr-3" />
                VIEW DOCS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section 
        className="py-24 px-4 bg-surface-elevated/50"
        onFocus={() => announceSection("the challenge")}
        tabIndex={0}
        aria-labelledby="challenge-title"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 
              id="challenge-title"
              className="text-5xl font-bold text-primary mb-6"
              tabIndex={0}
              onFocus={() => speak("The Challenge section: Digital finance excludes millions of users with disabilities")}
            >
              THE CHALLENGE
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Digital finance excludes millions of users with disabilities
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8" role="group" aria-label="Accessibility challenges">
            <Card 
              className="card-futuristic border-holographic"
              tabIndex={0}
              onFocus={() => speak("Visual Barriers: Complex interfaces without proper screen reader support or visual accessibility features")}
            >
              <CardHeader>
                <div className="w-16 h-16 bg-neon-orange rounded-lg flex items-center justify-center mb-6 shadow-neon-orange">
                  <Eye className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="text-2xl text-primary">VISUAL BARRIERS</CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Complex interfaces without proper screen reader support or visual accessibility features
                </CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className="card-futuristic border-holographic"
              tabIndex={0}
              onFocus={() => speak("Audio Limitations: Missing captions, audio descriptions, and alternative audio formats for financial content")}
            >
              <CardHeader>
                <div className="w-16 h-16 bg-neon-cyan rounded-lg flex items-center justify-center mb-6 shadow-neon-cyan">
                  <Ear className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="text-2xl text-primary">AUDIO LIMITATIONS</CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Missing captions, audio descriptions, and alternative audio formats for financial content
                </CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className="card-futuristic border-holographic"
              tabIndex={0}
              onFocus={() => speak("Motor Challenges: Small touch targets and complex gestures that exclude users with motor disabilities")}
            >
              <CardHeader>
                <div className="w-16 h-16 bg-neon-purple rounded-lg flex items-center justify-center mb-6 shadow-neon-purple">
                  <Hand className="w-8 h-8 text-black" />
                </div>
                <CardTitle className="text-2xl text-primary">MOTOR CHALLENGES</CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Small touch targets and complex gestures that exclude users with motor disabilities
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section 
        className="py-24 px-4 relative"
        onFocus={() => announceSection("the solution")}
        tabIndex={0}
        aria-labelledby="solution-title"
      >
        <div className="container mx-auto text-center relative z-10">
          <h3 
            id="solution-title"
            className="text-5xl font-bold text-primary mb-8"
            tabIndex={0}
            onFocus={() => speak("The Solution: A comprehensive accessibility SDK for financial applications")}
          >
            THE SOLUTION
          </h3>
          <div className="max-w-5xl mx-auto mb-16">
            <p className="text-xl text-muted-foreground mb-12">
              A <strong className="text-neon-cyan text-glow">comprehensive accessibility SDK</strong> for financial
              applications
            </p>
            <div className="card-futuristic p-12 rounded-lg border-holographic">
              <h4 
                className="text-3xl font-bold text-primary mb-12"
                tabIndex={0}
                onFocus={() => speak("INKLUZIV SDK enables access for: Visual, Motor, Hearing, and Cognitive disabilities")}
              >
                INKLUZIV SDK ENABLES ACCESS FOR:
              </h4>
              <div className="grid md:grid-cols-4 gap-12" role="group" aria-label="Supported disability types">
                <div 
                  className="text-center float" 
                  style={{ animationDelay: "0s" }}
                  tabIndex={0}
                  onFocus={() => speak("Visual accessibility support")}
                >
                  <div className="w-24 h-24 bg-neon-cyan rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-cyan pulse-glow">
                    <Eye className="w-12 h-12 text-black" />
                  </div>
                  <h5 className="text-xl font-semibold text-primary">VISUAL</h5>
                </div>
                <div 
                  className="text-center float" 
                  style={{ animationDelay: "1.5s" }}
                  tabIndex={0}
                  onFocus={() => speak("Motor accessibility support")}
                >
                  <div className="w-24 h-24 bg-neon-orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-orange pulse-glow">
                    <Hand className="w-12 h-12 text-black" />
                  </div>
                  <h5 className="text-xl font-semibold text-primary">MOTOR</h5>
                </div>
                <div 
                  className="text-center float" 
                  style={{ animationDelay: "3s" }}
                  tabIndex={0}
                  onFocus={() => speak("Hearing accessibility support")}
                >
                  <div className="w-24 h-24 bg-neon-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-purple pulse-glow">
                    <Ear className="w-12 h-12 text-black" />
                  </div>
                  <h5 className="text-xl font-semibold text-primary">HEARING</h5>
                </div>
                <div 
                  className="text-center float" 
                  style={{ animationDelay: "4.5s" }}
                  tabIndex={0}
                  onFocus={() => speak("Cognitive accessibility support")}
                >
                  <div className="w-24 h-24 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-green pulse-glow">
                    <Brain className="w-12 h-12 text-black" />
                  </div>
                  <h5 className="text-xl font-semibold text-primary">COGNITIVE</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Features */}
      <section 
        className="py-24 px-4 bg-surface-elevated/50"
        onFocus={() => announceSection("comprehensive features")}
        tabIndex={0}
        aria-labelledby="features-title"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 
              id="features-title"
              className="text-5xl font-bold text-primary mb-6"
              tabIndex={0}
              onFocus={() => speak("Comprehensive Features: Complete accessibility solution for financial apps")}
            >
              COMPREHENSIVE FEATURES
            </h3>
            <p className="text-xl text-muted-foreground">Complete accessibility solution for financial apps</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" role="grid" aria-label="Feature grid">
            {[
              { icon: Mic, title: 'VOICE CONTROL', description: 'Complete voice navigation and command system', color: 'cyan' },
              { icon: Type, title: 'TEXT-TO-SPEECH', description: 'Real-time audio feedback for all elements', color: 'orange' },
              { icon: Volume2, title: 'LIVE CAPTIONS', description: 'Real-time subtitles for all audio content', color: 'purple' },
              { icon: Headphones, title: 'AUDIO DESCRIPTIONS', description: 'Detailed audio descriptions for visual content', color: 'green' },
              { icon: Eye, title: 'SCREEN READER', description: 'NVDA, JAWS, VoiceOver optimization', color: 'cyan' },
              { icon: Palette, title: 'HIGH CONTRAST', description: 'Enhanced visual contrast modes', color: 'orange' },
              { icon: Focus, title: 'FOCUS INDICATORS', description: 'Clear visual focus indicators', color: 'purple' },
              { icon: ScanLine, title: 'MAGNIFICATION', description: 'Built-in screen magnification support', color: 'green' },
              { icon: Hand, title: 'LARGE TARGETS', description: 'WCAG 2.1 AA compliant touch zones', color: 'cyan' },
              { icon: Gamepad2, title: 'KEYBOARD NAV', description: 'Full keyboard navigation support', color: 'orange' },
              { icon: MousePointer, title: 'SWITCH CONTROL', description: 'Switch and assistive device support', color: 'purple' },
              { icon: Vibrate, title: 'HAPTIC FEEDBACK', description: 'Tactile responses and vibration patterns', color: 'green' },
              { icon: Brain, title: 'COGNITIVE SUPPORT', description: 'Simplified interfaces and clear language', color: 'cyan' },
              { icon: Timer, title: 'TIMING CONTROL', description: 'Adjustable timeouts and session management', color: 'orange' },
              { icon: Languages, title: 'MULTI-LANGUAGE', description: 'Support for 50+ languages and RTL', color: 'purple' },
              { icon: Globe, title: 'LOCALIZATION', description: 'Cultural and regional accessibility standards', color: 'green' },
              { icon: Camera, title: 'COMPUTER VISION', description: 'AI-powered visual content analysis', color: 'cyan' },
              { icon: Fingerprint, title: 'BIOMETRIC AUTH', description: 'Accessible biometric authentication', color: 'orange' },
              { icon: Smartphone, title: 'MOBILE FIRST', description: 'Mobile accessibility optimization', color: 'purple' },
              { icon: Shield, title: 'PRIVACY FIRST', description: 'Local processing, zero data collection', color: 'green' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              const colorClass = `neon-${feature.color}`;
              return (
                <Card 
                  key={index} 
                  className="card-futuristic p-6"
                  tabIndex={0}
                  onFocus={() => speak(`${feature.title}: ${feature.description}`)}
                  role="gridcell"
                >
                  <CardContent className="p-0">
                    <div className={`w-14 h-14 bg-${colorClass} rounded-lg flex items-center justify-center mb-4 shadow-${colorClass}`}>
                      <Icon className="w-7 h-7 text-black" />
                    </div>
                    <CardTitle className="text-lg text-primary mb-3">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-24 px-4 relative overflow-hidden"
        onFocus={() => announceSection("call to action")}
        tabIndex={0}
        aria-labelledby="cta-title"
      >
        <div className="container mx-auto text-center relative z-10">
          <h3 
            id="cta-title"
            className="text-5xl font-bold text-primary mb-6"
            tabIndex={0}
            onFocus={() => speak("Ready to build accessible? Join the accessibility revolution.")}
          >
            READY TO BUILD ACCESSIBLE?
          </h3>
          <p 
            className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto"
            tabIndex={0}
            onFocus={() => speak("Join the accessibility revolution. Experience the future of inclusive financial interfaces.")}
          >
            Join the accessibility revolution. Experience the future of inclusive financial interfaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center" role="group" aria-label="Final call to action">
            <Link href="/register">
              <Button
                size="lg"
                className="btn-neon-orange text-xl px-16 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
                onFocus={() => speak("Try Demo - Experience our accessible platform now")}
              >
                TRY DEMO
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-16 py-8 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono"
                onFocus={() => speak("View Documentation - Access our technical guides and API documentation")}
              >
                <Code className="w-6 h-6 mr-4" />
                VIEW DOCS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="bg-surface-elevated/80 border-t border-neon-cyan/30 py-12 px-4"
        onFocus={() => announceSection("footer")}
        tabIndex={0}
        role="contentinfo"
      >
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-neon-orange rounded-lg flex items-center justify-center shimmer">
              <Accessibility className="w-5 h-5 text-black" />
            </div>
            <span className="text-muted-foreground text-lg">© 2025 INKLUZIV</span>
          </div>
          <p className="text-secondary text-matrix">Making digital finance accessible for everyone</p>
        </div>
      </footer>

      {/* Hidden elements for screen readers */}
      <div className="sr-only" aria-live="polite" id="announcements">
        {isSpeaking && "Content is being read aloud"}
        {isListening && "Voice commands are active - say 'experience demo' to try the demo"}
      </div>

      {/* Hidden descriptions */}
      <div id="demo-description" className="sr-only">
        Try our accessible financial interface with voice control, screen reader support, and inclusive design
      </div>
    </div>
  )
}