"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Code,
  Zap,
  Shield,
  CheckCircle,
  Layers,
  Eye,
  Mic,
  Hand,
  Download,
  ExternalLink,
  Copy,
  Play,
  FileText,
  Accessibility,
  Brain,
  Volume2,
  Type,
  Gamepad2,
  Palette,
  Focus,
  Languages,
  Camera,
  Fingerprint,
  MousePointer,
  Headphones,
  ScanLine,
  Vibrate,
} from "lucide-react"

export default function DocsPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-surface scan-lines">
      {/* Header */}
      <header className="bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 shadow-neon-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center text-neon-cyan hover:text-neon-cyan-hover transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 p-2 rounded-lg font-mono"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">BACK</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Link href="/sdk">
              <Button
                variant="outline"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 touch-target-large bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono"
              >
                <Code className="w-4 h-4 mr-2" />
                SDK
              </Button>
            </Link>
            <Link href="/banking">
              <Button className="btn-neon-cyan touch-target-large transition-smooth font-mono">
                <Eye className="w-4 h-4 mr-2" />
                DEMO
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-6xl font-bold text-gradient font-mono">INKLUZIV DOCS</h1>
          </div>
          <p className="text-2xl text-secondary mb-8 font-mono">
            Complete documentation for building accessible banking applications
          </p>
          <div className="flex justify-center space-x-4">
            <Badge className="bg-neon-green text-black text-lg px-6 py-2 font-mono">v2.1.0</Badge>
            <Badge className="bg-neon-cyan text-black text-lg px-6 py-2 font-mono">WCAG 2.1 AA</Badge>
            <Badge className="bg-neon-orange text-black text-lg px-6 py-2 font-mono">React 18+</Badge>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="card-futuristic mb-12">
          <CardHeader>
            <CardTitle className="text-primary text-4xl font-mono flex items-center">
              <Zap className="w-8 h-8 mr-4 text-neon-green" />
              QUICK START
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-surface p-6 rounded-lg border border-strong">
                <h4 className="text-neon-cyan text-xl font-semibold mb-4 font-mono flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  INSTALLATION
                </h4>
                <div className="bg-surface-elevated p-4 rounded border border-strong mb-4">
                  <code className="text-primary text-lg font-mono">npm install @inkluziv/accessibility-sdk</code>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2 p-2 bg-transparent"
                    onClick={() => copyToClipboard("npm install @inkluziv/accessibility-sdk")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-secondary font-mono">Install the complete accessibility SDK with all features</p>
              </div>

              <div className="bg-surface p-6 rounded-lg border border-strong">
                <h4 className="text-neon-green text-xl font-semibold mb-4 font-mono flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  BASIC SETUP
                </h4>
                <div className="bg-surface-elevated p-4 rounded border border-strong mb-4">
                  <code className="text-primary text-sm font-mono whitespace-pre">
                    {`import { InkluzivProvider } from '@inkluziv/sdk'

<InkluzivProvider features="all">
  <YourApp />
</InkluzivProvider>`}
                  </code>
                </div>
                <p className="text-secondary font-mono">Wrap your app to enable all accessibility features</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Categories */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Voice & Audio Features */}
          <Card className="card-futuristic">
            <CardHeader>
              <CardTitle className="text-primary text-3xl font-mono flex items-center">
                <Mic className="w-8 h-8 mr-4 text-neon-cyan" />
                VOICE & AUDIO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Mic className="w-5 h-5 text-neon-cyan mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Voice Control</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">Complete voice navigation system</p>
                </div>
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Type className="w-5 h-5 text-neon-orange mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Text-to-Speech</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">Real-time audio feedback</p>
                </div>
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Volume2 className="w-5 h-5 text-neon-purple mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Live Captions</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">Real-time subtitles</p>
                </div>
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Headphones className="w-5 h-5 text-neon-green mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Audio Descriptions</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">Detailed audio descriptions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Features */}
          <Card className="card-futuristic">
            <CardHeader>
              <CardTitle className="text-primary text-3xl font-mono flex items-center">
                <Eye className="w-8 h-8 mr-4 text-neon-green" />
                VISUAL ACCESSIBILITY
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Eye className="w-5 h-5 text-neon-cyan mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Screen Reader</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">NVDA, JAWS, VoiceOver support</p>
                </div>
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Palette className="w-5 h-5 text-neon-orange mr-2" />
                    <h5 className="text-primary font-semibold font-mono">High Contrast</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">Enhanced visual contrast</p>
                </div>
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Focus className="w-5 h-5 text-neon-purple mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Focus Indicators</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">Clear visual focus</p>
                </div>
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <ScanLine className="w-5 h-5 text-neon-green mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Magnification</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">Screen magnification support</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motor & Input Features */}
          <Card className="card-futuristic">
            <CardHeader>
              <CardTitle className="text-primary text-3xl font-mono flex items-center">
                <Hand className="w-8 h-8 mr-4 text-neon-orange" />
                MOTOR & INPUT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Hand className="w-5 h-5 text-neon-cyan mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Large Targets</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">WCAG 2.1 AA compliant</p>
                </div>
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Gamepad2 className="w-5 h-5 text-neon-orange mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Keyboard Nav</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">Full keyboard support</p>
                </div>
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <MousePointer className="w-5 h-5 text-neon-purple mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Switch Control</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">Assistive device support</p>
                </div>
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Vibrate className="w-5 h-5 text-neon-green mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Haptic Feedback</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">Tactile responses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Features */}
          <Card className="card-futuristic">
            <CardHeader>
              <CardTitle className="text-primary text-3xl font-mono flex items-center">
                <Brain className="w-8 h-8 mr-4 text-neon-purple" />
                ADVANCED FEATURES
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Brain className="w-5 h-5 text-neon-cyan mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Cognitive Support</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">Simplified interfaces</p>
                </div>
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Languages className="w-5 h-5 text-neon-orange mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Multi-Language</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">50+ languages supported</p>
                </div>
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Camera className="w-5 h-5 text-neon-purple mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Computer Vision</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">AI-powered analysis</p>
                </div>
                <div className="bg-surface p-4 rounded border border-strong">
                  <div className="flex items-center mb-2">
                    <Fingerprint className="w-5 h-5 text-neon-green mr-2" />
                    <h5 className="text-primary font-semibold font-mono">Biometric Auth</h5>
                  </div>
                  <p className="text-secondary text-sm font-mono">Accessible authentication</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Reference */}
        <Card className="card-futuristic mb-12">
          <CardHeader>
            <CardTitle className="text-primary text-4xl font-mono flex items-center">
              <Code className="w-8 h-8 mr-4 text-neon-cyan" />
              API REFERENCE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Core Provider */}
            <div className="bg-surface p-6 rounded-lg border border-strong">
              <h4 className="text-neon-cyan text-2xl font-semibold mb-4 font-mono">InkluzivProvider</h4>
              <p className="text-secondary font-mono mb-4">
                Main provider component that wraps your application and enables accessibility features.
              </p>
              <div className="bg-surface-elevated p-4 rounded border border-strong mb-4">
                <code className="text-primary text-sm font-mono whitespace-pre">
                  {`<InkluzivProvider
  features={['voice', 'tts', 'captions', 'haptic', 'contrast']}
  theme="futuristic"
  locale="en-US"
  wcagLevel="AA"
  cognitiveSupport={true}
  mobileOptimized={true}
>
  {children}
</InkluzivProvider>`}
                </code>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-neon-green font-semibold mb-2 font-mono">Props:</h5>
                  <ul className="text-secondary text-sm font-mono space-y-1">
                    <li>• features: string[] - Features to enable</li>
                    <li>• theme: 'futuristic' | 'dark' | 'light'</li>
                    <li>• locale: string - Language locale</li>
                    <li>• wcagLevel: 'A' | 'AA' | 'AAA'</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-neon-orange font-semibold mb-2 font-mono">Features:</h5>
                  <ul className="text-secondary text-sm font-mono space-y-1">
                    <li>• voice - Voice control system</li>
                    <li>• tts - Text-to-speech</li>
                    <li>• captions - Live captions</li>
                    <li>• haptic - Haptic feedback</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Hooks */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface p-6 rounded-lg border border-strong">
                <h4 className="text-neon-green text-xl font-semibold mb-4 font-mono">useSpeechRecognition</h4>
                <div className="bg-surface-elevated p-4 rounded border border-strong mb-4">
                  <code className="text-primary text-sm font-mono whitespace-pre">
                    {`const {
  isListening,
  transcript,
  startListening,
  stopListening,
  error
} = useSpeechRecognition()`}
                  </code>
                </div>
                <p className="text-secondary text-sm font-mono">Hook for voice recognition functionality</p>
              </div>

              <div className="bg-surface p-6 rounded-lg border border-strong">
                <h4 className="text-neon-orange text-xl font-semibold mb-4 font-mono">useSpeechSynthesis</h4>
                <div className="bg-surface-elevated p-4 rounded border border-strong mb-4">
                  <code className="text-primary text-sm font-mono whitespace-pre">
                    {`const {
  speak,
  cancel,
  isSpeaking,
  voices
} = useSpeechSynthesis()`}
                  </code>
                </div>
                <p className="text-secondary text-sm font-mono">Hook for text-to-speech functionality</p>
              </div>

              <div className="bg-surface p-6 rounded-lg border border-strong">
                <h4 className="text-neon-purple text-xl font-semibold mb-4 font-mono">useAccessibility</h4>
                <div className="bg-surface-elevated p-4 rounded border border-strong mb-4">
                  <code className="text-primary text-sm font-mono whitespace-pre">
                    {`const {
  highContrast,
  fontSize,
  reducedMotion,
  toggleFeature
} = useAccessibility()`}
                  </code>
                </div>
                <p className="text-secondary text-sm font-mono">Hook for accessibility preferences</p>
              </div>

              <div className="bg-surface p-6 rounded-lg border border-strong">
                <h4 className="text-neon-cyan text-xl font-semibold mb-4 font-mono">useHapticFeedback</h4>
                <div className="bg-surface-elevated p-4 rounded border border-strong mb-4">
                  <code className="text-primary text-sm font-mono whitespace-pre">
                    {`const {
  vibrate,
  createPattern,
  isSupported
} = useHapticFeedback()`}
                  </code>
                </div>
                <p className="text-secondary text-sm font-mono">Hook for haptic feedback control</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card className="card-futuristic mb-12">
          <CardHeader>
            <CardTitle className="text-primary text-4xl font-mono flex items-center">
              <Layers className="w-8 h-8 mr-4 text-neon-green" />
              IMPLEMENTATION EXAMPLES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="bg-surface p-6 rounded-lg border border-strong">
              <h4 className="text-neon-cyan text-2xl font-semibold mb-4 font-mono">Voice-Controlled Wallet</h4>
              <div className="bg-surface-elevated p-4 rounded border border-strong mb-4">
                <code className="text-primary text-sm font-mono whitespace-pre">
                  {`import { useSpeechRecognition, useSpeechSynthesis, useHapticFeedback } from '@inkluziv/sdk'

function VoiceWallet() {
  const { startListening, transcript } = useSpeechRecognition()
  const { speak } = useSpeechSynthesis()
  const { vibrate } = useHapticFeedback()
  
  useEffect(() => {
    if (transcript.includes('check balance')) {
      speak(\`Your balance is \${balance} ETH\`)
      vibrate(100)
    }
    if (transcript.includes('send')) {
      const amount = extractAmount(transcript)
      speak(\`Preparing to send \${amount} ETH\`)
      vibrate([100, 50, 100])
    }
  }, [transcript])
  
  return (
    <AccessibleButton 
      onClick={startListening}
      ariaLabel="Start voice command"
      hapticFeedback={true}
    >
      🎤 Voice Commands
    </AccessibleButton>
  )
}`}
                </code>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-lg border border-strong">
              <h4 className="text-neon-green text-2xl font-semibold mb-4 font-mono">Accessible Token Swap Interface</h4>
              <div className="bg-surface-elevated p-4 rounded border border-strong mb-4">
                <code className="text-primary text-sm font-mono whitespace-pre">
                  {`import { AccessibleCard, useAccessibility, useCaptions } from '@inkluziv/sdk'

function TokenSwap() {
  const { highContrast, fontSize } = useAccessibility()
  const { showCaption } = useCaptions()
  
  const handleSwap = async () => {
    showCaption('Initiating token swap...')
    
    try {
      await executeSwap()
      showCaption('Swap completed successfully!')
      vibrate([100, 50, 100, 50, 100])
    } catch (error) {
      showCaption('Swap failed. Please try again.')
      vibrate(200)
    }
  }
  
  return (
    <AccessibleCard
      highContrast={highContrast}
      fontSize={fontSize}
      role="region"
      ariaLabel="Token swap interface"
    >
      <LargeButton
        onClick={handleSwap}
        minTouchTarget="44px"
        focusIndicator="enhanced"
      >
        Swap Tokens
      </LargeButton>
    </AccessibleCard>
  )
}`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="card-futuristic mb-12">
          <CardHeader>
            <CardTitle className="text-primary text-4xl font-mono flex items-center">
              <Shield className="w-8 h-8 mr-4 text-neon-orange" />
              BEST PRACTICES & GUIDELINES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-neon-cyan/10 border border-neon-cyan/30 p-6 rounded-lg">
                  <h4 className="text-neon-cyan text-xl font-semibold mb-4 font-mono">VOICE ACCESSIBILITY</h4>
                  <ul className="space-y-2 text-secondary font-mono">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-cyan mr-2 mt-0.5 flex-shrink-0" />
                      Use clear, simple command phrases
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-cyan mr-2 mt-0.5 flex-shrink-0" />
                      Provide voice feedback for all actions
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-cyan mr-2 mt-0.5 flex-shrink-0" />
                      Support multiple languages and accents
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-cyan mr-2 mt-0.5 flex-shrink-0" />
                      Allow command cancellation and correction
                    </li>
                  </ul>
                </div>

                <div className="bg-neon-green/10 border border-neon-green/30 p-6 rounded-lg">
                  <h4 className="text-neon-green text-xl font-semibold mb-4 font-mono">VISUAL ACCESSIBILITY</h4>
                  <ul className="space-y-2 text-secondary font-mono">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                      Maintain 4.5:1 contrast ratio minimum
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                      Use semantic HTML elements
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                      Provide alternative text for images
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                      Support screen magnification up to 200%
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-neon-orange/10 border border-neon-orange/30 p-6 rounded-lg">
                  <h4 className="text-neon-orange text-xl font-semibold mb-4 font-mono">MOTOR ACCESSIBILITY</h4>
                  <ul className="space-y-2 text-secondary font-mono">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-orange mr-2 mt-0.5 flex-shrink-0" />
                      Make touch targets at least 44px
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-orange mr-2 mt-0.5 flex-shrink-0" />
                      Provide adequate spacing between elements
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-orange mr-2 mt-0.5 flex-shrink-0" />
                      Support both mouse and keyboard interaction
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-orange mr-2 mt-0.5 flex-shrink-0" />
                      Allow sufficient time for interactions
                    </li>
                  </ul>
                </div>

                <div className="bg-neon-purple/10 border border-neon-purple/30 p-6 rounded-lg">
                  <h4 className="text-neon-purple text-xl font-semibold mb-4 font-mono">COGNITIVE ACCESSIBILITY</h4>
                  <ul className="space-y-2 text-secondary font-mono">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-purple mr-2 mt-0.5 flex-shrink-0" />
                      Use simple, clear language
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-purple mr-2 mt-0.5 flex-shrink-0" />
                      Provide consistent navigation
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-purple mr-2 mt-0.5 flex-shrink-0" />
                      Offer help and error recovery
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neon-purple mr-2 mt-0.5 flex-shrink-0" />
                      Minimize cognitive load
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="card-futuristic mb-12">
          <CardHeader>
            <CardTitle className="text-primary text-4xl font-mono flex items-center">
              <FileText className="w-8 h-8 mr-4 text-neon-purple" />
              RESOURCES & LINKS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-surface p-6 rounded-lg border border-strong">
                <h4 className="text-neon-cyan text-xl font-semibold mb-4 font-mono">DOCUMENTATION</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-secondary hover:text-neon-cyan transition-smooth font-mono flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-secondary hover:text-neon-cyan transition-smooth font-mono flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Component Library
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-secondary hover:text-neon-cyan transition-smooth font-mono flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Migration Guide
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-surface p-6 rounded-lg border border-strong">
                <h4 className="text-neon-green text-xl font-semibold mb-4 font-mono">EXAMPLES</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-secondary hover:text-neon-green transition-smooth font-mono flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Banking Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-secondary hover:text-neon-green transition-smooth font-mono flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Trading Interface
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-secondary hover:text-neon-green transition-smooth font-mono flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Wallet Integration
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-surface p-6 rounded-lg border border-strong">
                <h4 className="text-neon-orange text-xl font-semibold mb-4 font-mono">COMMUNITY</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-secondary hover:text-neon-orange transition-smooth font-mono flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      GitHub Repository
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-secondary hover:text-neon-orange transition-smooth font-mono flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Discord Community
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-secondary hover:text-neon-orange transition-smooth font-mono flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Support Forum
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer CTA */}
        <div className="text-center py-12">
          <p className="text-secondary text-lg font-mono mb-4">Ready to make your banking app accessible?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sdk">
              <Button className="btn-neon-cyan text-lg px-8 py-4 font-mono">DOWNLOAD SDK</Button>
            </Link>
            <Link href="/banking">
              <Button
                variant="outline"
                className="text-lg px-8 py-4 bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono"
              >
                TRY DEMO
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
