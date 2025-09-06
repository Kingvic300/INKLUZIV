"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Code, Zap, Shield, CheckCircle, Layers, Eye, Mic, Hand, Download,
  ExternalLink, Copy, Play, FileText, Brain, Volume2, Type, Gamepad2, Palette, Focus,
  Languages, Camera, Fingerprint, MousePointer, Headphones, ScanLine, Vibrate,
} from "lucide-react"

export default function DocsPage() {
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  return (
    <div className="min-h-screen bg-surface scan-lines">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 shadow-neon-cyan/20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center text-neon-cyan hover:text-neon-cyan-hover transition-smooth p-2 rounded-lg font-mono">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium hidden sm:inline">BACK</span>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/sdk"><Button variant="outline" className="bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black font-mono text-sm px-3 sm:px-4"><Code className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">SDK</span></Button></Link>
            <Link href="/banking"><Button className="btn-neon-cyan font-mono text-sm px-3 sm:px-4"><Eye className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">DEMO</span></Button></Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gradient font-mono mb-6">INKLUZIV DOCS</h1>
          <p className="text-xl md:text-2xl text-secondary mb-8 font-mono">
            Complete documentation for accessible blockchain wallets
          </p>
          <div className="flex justify-center flex-wrap gap-3">
            <Badge className="bg-neon-green text-black text-base px-4 py-1.5 font-mono">v1.0.0</Badge>
            <Badge className="bg-neon-cyan text-black text-base px-4 py-1.5 font-mono">WCAG 2.1 AA</Badge>
            <Badge className="bg-neon-orange text-black text-base px-4 py-1.5 font-mono">React 18+</Badge>
          </div>
        </section>

        {/* --- DEFINITIVELY FIXED QUICK START SECTION --- */}
        <section className="mb-12 md:mb-16">
          <Card className="card-futuristic">
            <CardHeader>
              <CardTitle className="text-primary text-3xl md:text-4xl font-mono flex items-center">
                <Zap className="w-7 md:w-8 h-7 md:h-8 mr-4 text-neon-green" />
                QUICK START
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Installation Card */}
                <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong flex flex-col min-w-0">
                  <h4 className="text-neon-cyan text-xl font-semibold mb-4 font-mono flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    WALLET SDK INSTALLATION
                  </h4>
                  <div className="bg-surface-elevated p-4 rounded border border-strong mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <code className="text-primary text-sm sm:text-base font-mono overflow-x-auto whitespace-nowrap pb-2 sm:pb-0">
                        npm install @inkluziv/wallet-sdk
                      </code>
                      <Button size="sm" variant="outline" className="p-2 flex-shrink-0 w-full sm:w-auto justify-center bg-surface hover:bg-surface-elevated border-strong" onClick={() => copyToClipboard("npm install @inkluziv/sdk")}>
                        <Copy className="w-4 h-4 mr-2 sm:mr-0" /> <span className="sm:hidden">Copy Command</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-secondary font-mono text-sm mt-auto">
                    Install the complete blockchain wallet SDK.
                  </p>
                </div>
                {/* Basic Setup Card */}
                <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong flex flex-col min-w-0">
                  <h4 className="text-neon-green text-xl font-semibold mb-4 font-mono flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    BASIC SETUP
                  </h4>
                  <div className="bg-surface-elevated p-4 rounded border border-strong overflow-x-auto">
                    <code className="text-primary text-xs sm:text-sm font-mono whitespace-pre">
                      {`import { InkluzivWalletProvider } from '@inkluziv/wallet-sdk';\n\n<InkluzivWalletProvider features="voice,tts,crypto">\n  <YourWalletApp />\n</InkluzivWalletProvider>`}
                    </code>
                  </div>
                   <p className="text-secondary font-mono text-sm mt-auto pt-4">
                     Wrap your app to enable voice-controlled crypto features.
                   </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Feature Categories */}
        <section className="mb-12 md:mb-16">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* These cards contain content that wraps naturally, so they don't need the min-w-0 fix. */}
            <Card className="card-futuristic">
              <CardHeader><CardTitle className="text-primary text-2xl md:text-3xl font-mono flex items-center"><Mic className="w-7 md:w-8 h-7 md:h-8 mr-4 text-neon-cyan" />VOICE CRYPTO CONTROL</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface p-4 rounded border border-strong h-full"><div className="flex items-center mb-2"><Mic className="w-5 h-5 text-neon-cyan mr-2" /><h5 className="text-primary font-semibold font-mono">Voice Transactions</h5></div><p className="text-secondary text-sm font-mono">Send USDT with voice commands</p></div>
                  <div className="bg-surface p-4 rounded border border-strong h-full"><div className="flex items-center mb-2"><Type className="w-5 h-5 text-neon-orange mr-2" /><h5 className="text-primary font-semibold font-mono">Wallet TTS</h5></div><p className="text-secondary text-sm font-mono">Audio feedback for crypto operations</p></div>
                  <div className="bg-surface p-4 rounded border border-strong h-full"><div className="flex items-center mb-2"><Volume2 className="w-5 h-5 text-neon-purple mr-2" /><h5 className="text-primary font-semibold font-mono">Crypto Captions</h5></div><p className="text-secondary text-sm font-mono">Live subtitles for blockchain</p></div>
                  <div className="bg-surface p-4 rounded border border-strong h-full"><div className="flex items-center mb-2"><Headphones className="w-5 h-5 text-neon-green mr-2" /><h5 className="text-primary font-semibold font-mono">Transaction Audio</h5></div><p className="text-secondary text-sm font-mono">Audio descriptions for crypto</p></div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-futuristic">
              <CardHeader><CardTitle className="text-primary text-2xl md:text-3xl font-mono flex items-center"><Eye className="w-7 md:w-8 h-7 md:h-8 mr-4 text-neon-green" />CRYPTO VISUAL ACCESS</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-surface p-4 rounded border border-strong h-full"><div className="flex items-center mb-2"><Eye className="w-5 h-5 text-neon-cyan mr-2" /><h5 className="text-primary font-semibold font-mono">Wallet Reader</h5></div><p className="text-secondary text-sm font-mono">Screen reader for crypto wallets</p></div>
                    <div className="bg-surface p-4 rounded border border-strong h-full"><div className="flex items-center mb-2"><Palette className="w-5 h-5 text-neon-orange mr-2" /><h5 className="text-primary font-semibold font-mono">Crypto Contrast</h5></div><p className="text-secondary text-sm font-mono">High contrast for blockchain</p></div>
                    <div className="bg-surface p-4 rounded border border-strong h-full"><div className="flex items-center mb-2"><Focus className="w-5 h-5 text-neon-purple mr-2" /><h5 className="text-primary font-semibold font-mono">Wallet Focus</h5></div><p className="text-secondary text-sm font-mono">Clear focus for crypto forms</p></div>
                    <div className="bg-surface p-4 rounded border border-strong h-full"><div className="flex items-center mb-2"><ScanLine className="w-5 h-5 text-neon-green mr-2" /><h5 className="text-primary font-semibold font-mono">Address Zoom</h5></div><p className="text-secondary text-sm font-mono">Magnify wallet addresses</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* API Reference with restored content and responsive fixes */}
        <section className="mb-12 md:mb-16">
          <Card className="card-futuristic">
            <CardHeader>
              <CardTitle className="text-primary text-3xl md:text-4xl font-mono flex items-center">
                <Code className="w-8 h-8 mr-4 text-neon-cyan" />
                API REFERENCE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong min-w-0">
                <h4 className="text-neon-cyan text-xl md:text-2xl font-semibold mb-4 font-mono">InkluzivProvider</h4>
                <p className="text-secondary font-mono mb-4 text-sm md:text-base">Main wallet provider component.</p>
                <div className="bg-surface-elevated p-4 rounded border border-strong mb-4 overflow-x-auto">
                  <code className="text-primary text-sm font-mono whitespace-pre">{`<InkluzivWalletProvider\n  features={['voice', 'tts', 'crypto', 'usdt']}\n  theme="blockchain"\n  locale="en-US"\n  wcagLevel="AA"\n  voiceTransactions={true}\n  cryptoSupport={true}\n>\n  {children}\n</InkluzivWalletProvider>`}</code>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><h5 className="text-neon-green font-semibold mb-2 font-mono">Props:</h5><ul className="text-secondary text-sm font-mono space-y-1"><li>• features: string[]</li><li>• theme: 'futuristic' | 'dark'</li><li>• locale: string</li><li>• wcagLevel: 'A' | 'AA' | 'AAA'</li></ul></div>
                  <div><h5 className="text-neon-orange font-semibold mb-2 font-mono">Features:</h5><ul className="text-secondary text-sm font-mono space-y-1"><li>• voice - Voice crypto control</li><li>• tts - Wallet text-to-speech</li><li>• crypto - Blockchain integration</li><li>• usdt - USDT transactions</li></ul></div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong min-w-0"><h4 className="text-neon-green text-xl font-semibold mb-4 font-mono">useVoiceCrypto</h4><div className="bg-surface-elevated p-4 rounded border border-strong mb-4 overflow-x-auto"><code className="text-primary text-xs sm:text-sm font-mono whitespace-pre">{`const {\n  isListening,\n  transcript,\n  startListening,\n  stopListening,\n  sendUSDT\n} = useVoiceCrypto()`}</code></div></div>
                <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong min-w-0"><h4 className="text-neon-orange text-xl font-semibold mb-4 font-mono">useWalletTTS</h4><div className="bg-surface-elevated p-4 rounded border border-strong mb-4 overflow-x-auto"><code className="text-primary text-xs sm:text-sm font-mono whitespace-pre">{`const {\n  speak,\n  cancel,\n  isSpeaking,\n  announceBalance\n} = useWalletTTS()`}</code></div></div>
                <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong min-w-0"><h4 className="text-neon-purple text-xl font-semibold mb-4 font-mono">useCryptoAccess</h4><div className="bg-surface-elevated p-4 rounded border border-strong mb-4 overflow-x-auto"><code className="text-primary text-xs sm:text-sm font-mono whitespace-pre">{`const {\n  highContrast,\n  voiceEnabled,\n  cryptoMode,\n  toggleFeature\n} = useCryptoAccess()`}</code></div></div>
                <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong min-w-0"><h4 className="text-neon-cyan text-xl font-semibold mb-4 font-mono">useBlockchainFeedback</h4><div className="bg-surface-elevated p-4 rounded border border-strong mb-4 overflow-x-auto"><code className="text-primary text-xs sm:text-sm font-mono whitespace-pre">{`const {\n  vibrate,\n  confirmTransaction,\n  isSupported\n} = useBlockchainFeedback()`}</code></div></div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Best Practices & Resources sections */}
        <section className="mb-12 md:mb-16">
            <Card className="card-futuristic">
                <CardHeader><CardTitle className="text-primary text-3xl md:text-4xl font-mono flex items-center"><Shield className="w-8 h-8 mr-4 text-neon-orange" />CRYPTO WALLET BEST PRACTICES</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-neon-cyan/10 border border-neon-cyan/30 p-4 md:p-6 rounded-lg"><h4 className="text-neon-cyan text-xl font-semibold mb-4 font-mono">VOICE CRYPTO</h4><ul className="space-y-2 text-secondary font-mono"><li className="flex items-start"><CheckCircle className="w-5 h-5 text-neon-cyan mr-2 mt-0.5 flex-shrink-0" />Use clear crypto command phrases</li><li className="flex items-start"><CheckCircle className="w-5 h-5 text-neon-cyan mr-2 mt-0.5 flex-shrink-0" />Confirm all blockchain transactions</li></ul></div>
                        <div className="bg-neon-green/10 border border-neon-green/30 p-4 md:p-6 rounded-lg"><h4 className="text-neon-green text-xl font-semibold mb-4 font-mono">WALLET VISUAL</h4><ul className="space-y-2 text-secondary font-mono"><li className="flex items-start"><CheckCircle className="w-5 h-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />High contrast for wallet addresses</li><li className="flex items-start"><CheckCircle className="w-5 h-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />Clear focus for crypto forms</li></ul></div>
                    </div>
                </CardContent>
            </Card>
        </section>
        <section className="mb-12 md:mb-16">
            <Card className="card-futuristic">
                <CardHeader><CardTitle className="text-primary text-3xl md:text-4xl font-mono flex items-center"><FileText className="w-8 h-8 mr-4 text-neon-purple" />BLOCKCHAIN RESOURCES</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong"><h4 className="text-neon-cyan text-xl font-semibold mb-4 font-mono">WALLET DOCS</h4><ul className="space-y-3"><li><a href="#" className="text-secondary hover:text-neon-cyan transition-smooth font-mono flex items-center"><ExternalLink className="w-4 h-4 mr-2" />Wallet API Reference</a></li><li><a href="#" className="text-secondary hover:text-neon-cyan transition-smooth font-mono flex items-center"><ExternalLink className="w-4 h-4 mr-2" />Crypto Components</a></li></ul></div>
                        <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong"><h4 className="text-neon-green text-xl font-semibold mb-4 font-mono">CRYPTO EXAMPLES</h4><ul className="space-y-3"><li><a href="#" className="text-secondary hover:text-neon-green transition-smooth font-mono flex items-center"><ExternalLink className="w-4 h-4 mr-2" />USDT Wallet Demo</a></li><li><a href="#" className="text-secondary hover:text-neon-green transition-smooth font-mono flex items-center"><ExternalLink className="w-4 h-4 mr-2" />Voice Transactions</a></li></ul></div>
                        <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong"><h4 className="text-neon-orange text-xl font-semibold mb-4 font-mono">BLOCKCHAIN COMMUNITY</h4><ul className="space-y-3"><li><a href="#" className="text-secondary hover:text-neon-orange transition-smooth font-mono flex items-center"><ExternalLink className="w-4 h-4 mr-2" />GitHub Repository</a></li><li><a href="#" className="text-secondary hover:text-neon-orange transition-smooth font-mono flex items-center"><ExternalLink className="w-4 h-4 mr-2" />Crypto Discord</a></li></ul></div>
                    </div>
                </CardContent>
            </Card>
        </section>
        
        {/* Footer CTA */}
        <footer className="text-center py-12">
          <p className="text-secondary text-lg font-mono mb-4">Ready to build accessible crypto wallets?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sdk"><Button className="btn-neon-cyan text-lg px-8 py-4 font-mono w-full sm:w-auto">DOWNLOAD WALLET SDK</Button></Link>
            <Link href="/login"><Button variant="outline" className="text-lg px-8 py-4 bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono w-full sm:w-auto">TRY USDT WALLET</Button></Link>
          </div>
        </footer>
      </main>
    </div>
  )
}