import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Code, Download, Book, Zap, Shield, CheckCircle, Layers, Cpu } from "lucide-react"

export default function SDKPage() {
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
            <Button
              variant="outline"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 touch-target-large bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono"
            >
              <Book className="w-4 h-4 mr-2" />
              DOCUMENTATION
            </Button>
            <Button className="btn-neon-cyan touch-target-large transition-smooth font-mono">
              <Download className="w-4 h-4 mr-2" />
              DOWNLOAD SDK
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 space-y-20">
        {/* Hero Section */}
        <div className="text-center">
         <h1 className="text-6xl font-bold text-gradient font-mono">INKLUZIV SDK</h1>
          <p className="text-2xl text-secondary mb-12 max-w-5xl mx-auto leading-relaxed font-mono">
            A plug-and-play accessibility SDK for financial interfaces. Built with React and Next.js, featuring TTS,
            OCR, voice input, and secure on-device processing for maximum security.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="btn-neon-cyan text-2xl px-16 py-8 touch-target-xl transition-smooth font-mono">
              <Download className="w-8 h-8 mr-4" />
              INITIATE DOWNLOAD
            </Button>
             <Link href="/docs">
         
            <Button
              size="lg"
              variant="outline"
              className="text-2xl px-16 py-8 touch-target-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono"
            >
              <Code className="w-8 h-8 mr-4" />
              ACCESS DOCS
            </Button>    
            </Link>
          </div>
        </div>

        {/* Technical Architecture */}
        <section>
          <h2 className="text-5xl font-bold text-primary mb-12 text-center font-mono">TECHNICAL ARCHITECTURE</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-futuristic p-10 transition-smooth">
              <CardHeader>
                <div className="w-20 h-20 bg-neon-cyan rounded-lg flex items-center justify-center mb-6 shadow-neon-cyan shimmer">
                  <Code className="w-10 h-10 text-black" />
                </div>
                <CardTitle className="text-primary text-2xl font-mono">REACT & NEXT.JS</CardTitle>
                <CardDescription className="text-secondary text-lg font-mono">
                  Built on modern web technologies for seamless integration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-futuristic p-10 transition-smooth">
              <CardHeader>
                <div className="w-20 h-20 bg-neon-green rounded-lg flex items-center justify-center mb-6 shadow-neon-green shimmer">
                  <Zap className="w-10 h-10 text-black" />
                </div>
                <CardTitle className="text-primary text-2xl font-mono">TTS & VOICE INPUT</CardTitle>
                <CardDescription className="text-secondary text-lg font-mono">
                  Text-to-speech and voice recognition for hands-free financial operations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-futuristic p-10 transition-smooth">
              <CardHeader>
                <div className="w-20 h-20 bg-neon-orange rounded-lg flex items-center justify-center mb-6 shadow-neon-orange shimmer">
                  <Shield className="w-10 h-10 text-black" />
                </div>
                <CardTitle className="text-primary text-2xl font-mono">SECURE PROCESSING</CardTitle>
                <CardDescription className="text-secondary text-lg font-mono">
                  Privacy-first approach with secure local data processing
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Integration Guide */}
        <section>
          <h2 className="text-5xl font-bold text-primary mb-12 text-center font-mono">EASY INTEGRATION</h2>
          <Card className="card-futuristic max-w-5xl mx-auto border-holographic">
            <CardHeader>
              <CardTitle className="text-primary text-4xl text-center font-mono">QUICK SETUP</CardTitle>
              <CardDescription className="text-secondary text-2xl text-center font-mono">
                Initialize Inkluziv SDK in just a few steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-10">
                <div className="bg-surface p-10 rounded-2xl border border-strong">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-neon-cyan text-black rounded-full flex items-center justify-center text-2xl font-bold mr-6 shadow-neon-cyan font-mono">
                      01
                    </div>
                    <h4 className="text-neon-cyan text-3xl font-semibold font-mono">INSTALL SDK</h4>
                  </div>
                  <code className="text-primary bg-surface-elevated px-8 py-6 rounded-lg text-2xl block font-mono border border-strong">
                    npm install @inkluziv/accessibility-sdk
                  </code>
                </div>

                <div className="bg-surface p-10 rounded-2xl border border-strong">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-neon-green text-black rounded-full flex items-center justify-center text-2xl font-bold mr-6 shadow-neon-green font-mono">
                      02
                    </div>
                    <h4 className="text-neon-green text-3xl font-semibold font-mono">IMPORT COMPONENTS</h4>
                  </div>
                  <code className="text-primary bg-surface-elevated px-8 py-6 rounded-lg text-2xl block font-mono border border-strong">
                    {`import { InkluzivProvider } from '@inkluziv/accessibility-sdk'`}
                  </code>
                </div>

                <div className="bg-surface p-10 rounded-2xl border border-strong">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-neon-orange text-black rounded-full flex items-center justify-center text-2xl font-bold mr-6 shadow-neon-orange font-mono">
                      03
                    </div>
                    <h4 className="text-neon-orange text-3xl font-semibold font-mono">WRAP YOUR APP</h4>
                  </div>
                  <code className="text-primary bg-surface-elevated px-8 py-6 rounded-lg text-2xl block font-mono border border-strong">
                    {`<InkluzivProvider features={['voice', 'haptic', 'tts', 'quantum']}>`}
                    <br />
                    {`  <YourBankingApp />`}
                    <br />
                    {`</InkluzivProvider>`}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features for Developers */}
        <section>
          <h2 className="text-5xl font-bold text-primary mb-12 text-center font-mono">DEVELOPER FEATURES</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="card-futuristic p-8 transition-smooth">
              <CardHeader>
                <div className="w-20 h-20 bg-neon-cyan rounded-2xl flex items-center justify-center mb-6 shadow-neon-cyan shimmer">
                  <Layers className="w-10 h-10 text-black" />
                </div>
                <CardTitle className="text-primary text-2xl font-mono">ACCESSIBILITY APIs</CardTitle>
                <CardDescription className="text-secondary text-lg mb-6 font-mono">
                  Comprehensive APIs for managing accessibility in Web3 and Banking applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-secondary text-lg">
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-6 h-6 text-neon-cyan mr-4" />
                    Voice command registration for financial operations
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-6 h-6 text-neon-cyan mr-4" />
                    Transaction confirmation patterns
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-6 h-6 text-neon-cyan mr-4" />
                    Quantum wallet connection accessibility
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-6 h-6 text-neon-cyan mr-4" />
                    Haptic feedback protocols
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-futuristic p-8 transition-smooth">
              <CardHeader>
                <div className="w-20 h-20 bg-neon-green rounded-2xl flex items-center justify-center mb-6 shadow-neon-green shimmer">
                  <Cpu className="w-10 h-10 text-black" />
                </div>
                <CardTitle className="text-primary text-2xl font-mono">PRIVACY & SECURITY</CardTitle>
                <CardDescription className="text-secondary text-lg mb-6 font-mono">
                  Built-in secure encryption with local processing and financial security standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-secondary text-lg">
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-6 h-6 text-neon-green mr-4" />
                    Secure voice processing
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-6 h-6 text-neon-green mr-4" />
                    No data transmitted to external servers
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-6 h-6 text-neon-green mr-4" />
                    Web3 privacy standards compliant
                  </li>
                  <li className="flex items-center font-mono">
                    <CheckCircle className="w-6 h-6 text-neon-green mr-4" />
                    Encrypted local storage
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-holographic opacity-30 rounded-3xl"></div>
          <div className="absolute inset-0 bg-surface-elevated/80 rounded-3xl"></div>
          <div className="relative z-10 p-24">
            <h2 className="text-5xl font-bold text-primary mb-8 font-mono">READY TO JOIN IN?</h2>
            <p className="text-2xl text-secondary mb-16 max-w-4xl mx-auto font-mono">
              Join the accessibility revolution. Download the SDK and start building accessible financial interfaces for the
              future.
            </p>
            <Button
              size="lg"
              className="btn-neon-green text-2xl px-16 py-8 touch-target-xl transition-smooth font-mono"
            >
              <Download className="w-8 h-8 mr-4" />
              DOWNLOAD INKLUZIV SDK
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
