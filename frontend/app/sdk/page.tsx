import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Code, Download, Book, Zap, Shield, CheckCircle, Layers, Cpu } from "lucide-react"

export default function SDKPage() {
  return (
    <div className="min-h-screen bg-surface scan-lines">
      {/* Header */}
      <header className="bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 shadow-neon-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center text-neon-cyan hover:text-neon-cyan-hover transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 p-2 rounded-lg font-mono"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium hidden sm:inline">BACK</span>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/docs">
              <Button
                variant="outline"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 touch-target-large bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono text-sm px-3 sm:px-4"
              >
                <Book className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">DOCS</span>
              </Button>
            </Link>
            <Button className="btn-neon-cyan touch-target-large transition-smooth font-mono text-sm px-3 sm:px-4">
              <Download className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">DOWNLOAD</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 space-y-16 md:space-y-20">
        {/* Hero Section */}
        <section className="text-center">
         <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gradient font-mono">INKLUZIV SDK</h1>
          <p className="text-lg md:text-2xl text-secondary my-8 max-w-5xl mx-auto leading-relaxed font-mono">
            A plug-and-play accessibility SDK for financial interfaces. Built with React and Next.js, featuring TTS,
            OCR, voice input, and secure on-device processing.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            
            {/* --- KEY FIX STARTS HERE --- */}
            {/* The first button is now also wrapped in a <Link> for structural parity */}
            <Link href="/#"> {/* Using a placeholder link */}
              <Button 
                size="lg" 
                className="btn-neon-cyan text-lg sm:text-2xl px-10 py-5 sm:px-16 sm:py-8 touch-target-xl transition-smooth font-mono w-full"
              >
                <Download className="w-6 sm:w-8 h-6 sm:h-8 mr-4" />
                INITIATE DOWNLOAD
              </Button>
            </Link>
            {/* --- KEY FIX ENDS HERE --- */}

             <Link href="/docs">
               <Button
                size="lg"
                variant="outline"
                className="text-lg sm:text-2xl px-10 py-5 sm:px-16 sm:py-8 touch-target-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono w-full"
              >
                <Code className="w-6 sm:w-8 h-6 sm:h-8 mr-4" />
                ACCESS DOCS
              </Button>    
            </Link>
          </div>
        </section>

        {/* Technical Architecture */}
        <section>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center font-mono">TECHNICAL ARCHITECTURE</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-futuristic p-6 md:p-10 transition-smooth">
              <CardHeader className="p-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-neon-cyan rounded-lg flex items-center justify-center mb-6 shadow-neon-cyan shimmer">
                  <Code className="w-8 md:w-10 h-8 md:h-10 text-black" />
                </div>
                <CardTitle className="text-primary text-xl md:text-2xl font-mono">REACT & NEXT.JS</CardTitle>
                <CardDescription className="text-secondary text-base md:text-lg font-mono mt-2">
                  Built on modern web technologies for seamless integration.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-futuristic p-6 md:p-10 transition-smooth">
              <CardHeader className="p-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-neon-green rounded-lg flex items-center justify-center mb-6 shadow-neon-green shimmer">
                  <Zap className="w-8 md:w-10 h-8 md:h-10 text-black" />
                </div>
                <CardTitle className="text-primary text-xl md:text-2xl font-mono">TTS & VOICE INPUT</CardTitle>
                <CardDescription className="text-secondary text-base md:text-lg font-mono mt-2">
                  Text-to-speech and voice recognition for hands-free operations.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-futuristic p-6 md:p-10 transition-smooth">
              <CardHeader className="p-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-neon-orange rounded-lg flex items-center justify-center mb-6 shadow-neon-orange shimmer">
                  <Shield className="w-8 md:w-10 h-8 md:h-10 text-black" />
                </div>
                <CardTitle className="text-primary text-xl md:text-2xl font-mono">SECURE PROCESSING</CardTitle>
                <CardDescription className="text-secondary text-base md:text-lg font-mono mt-2">
                  Privacy-first approach with secure local data processing.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Integration Guide */}
        <section>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center font-mono">EASY INTEGRATION</h2>
          <Card className="card-futuristic max-w-5xl mx-auto border-holographic">
            <CardHeader>
              <CardTitle className="text-primary text-3xl md:text-4xl text-center font-mono">QUICK SETUP</CardTitle>
              <CardDescription className="text-secondary text-xl md:text-2xl text-center font-mono">
                Initialize Inkluziv SDK in 3 steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="bg-surface p-4 sm:p-6 md:p-8 rounded-2xl border border-strong">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                    <div className="w-12 h-12 bg-neon-cyan text-black rounded-full flex items-center justify-center text-xl font-bold mr-6 mb-4 sm:mb-0 flex-shrink-0">01</div>
                    <h4 className="text-neon-cyan text-2xl md:text-3xl font-semibold font-mono">INSTALL SDK</h4>
                  </div>
                  <div className="bg-surface-elevated p-4 rounded-lg border border-strong overflow-x-auto">
                    <code className="text-primary text-base sm:text-lg font-mono whitespace-nowrap">
                      npm install @inkluziv/sdk
                    </code>
                  </div>
                </div>
                <div className="bg-surface p-4 sm:p-6 md:p-8 rounded-2xl border border-strong">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                    <div className="w-12 h-12 bg-neon-green text-black rounded-full flex items-center justify-center text-xl font-bold mr-6 mb-4 sm:mb-0 flex-shrink-0">02</div>
                    <h4 className="text-neon-green text-2xl md:text-3xl font-semibold font-mono">IMPORT</h4>
                  </div>
                   <div className="bg-surface-elevated p-4 rounded-lg border border-strong overflow-x-auto">
                    <code className="text-primary text-base sm:text-lg font-mono whitespace-nowrap">
                      {`import { InkluzivProvider } from '@inkluziv/sdk'`}
                    </code>
                  </div>
                </div>
                <div className="bg-surface p-4 sm:p-6 md:p-8 rounded-2xl border border-strong">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                    <div className="w-12 h-12 bg-neon-orange text-black rounded-full flex items-center justify-center text-xl font-bold mr-6 mb-4 sm:mb-0 flex-shrink-0">03</div>
                    <h4 className="text-neon-orange text-2xl md:text-3xl font-semibold font-mono">WRAP APP</h4>
                  </div>
                  <div className="bg-surface-elevated p-4 rounded-lg border border-strong overflow-x-auto">
                    <code className="text-primary text-sm sm:text-base font-mono whitespace-pre">
                      {`<InkluzivProvider>\n  <YourApp />\n</InkluzivProvider>`}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Developer Features */}
        <section>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center font-mono">DEVELOPER FEATURES</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="card-futuristic p-6 md:p-8 transition-smooth">
              <CardHeader className="p-0"><div className="w-16 h-16 md:w-20 md:h-20 bg-neon-cyan rounded-2xl flex items-center justify-center mb-6 shadow-neon-cyan shimmer"><Layers className="w-8 md:w-10 h-8 md:h-10 text-black" /></div><CardTitle className="text-primary text-xl md:text-2xl font-mono">ACCESSIBILITY APIs</CardTitle><CardDescription className="text-secondary text-base md:text-lg mt-2 mb-6 font-mono">Comprehensive APIs for managing accessibility.</CardDescription></CardHeader>
              <CardContent className="p-0"><ul className="space-y-4 text-secondary text-base md:text-lg"><li className="flex items-start font-mono"><CheckCircle className="w-5 h-5 text-neon-cyan mr-4 mt-1 flex-shrink-0" />Voice command registration</li><li className="flex items-start font-mono"><CheckCircle className="w-5 h-5 text-neon-cyan mr-4 mt-1 flex-shrink-0" />Transaction confirmation patterns</li><li className="flex items-start font-mono"><CheckCircle className="w-5 h-5 text-neon-cyan mr-4 mt-1 flex-shrink-0" />Haptic feedback protocols</li></ul></CardContent>
            </Card>
            <Card className="card-futuristic p-6 md:p-8 transition-smooth">
              <CardHeader className="p-0"><div className="w-16 h-16 md:w-20 md:h-20 bg-neon-green rounded-2xl flex items-center justify-center mb-6 shadow-neon-green shimmer"><Cpu className="w-8 md:w-10 h-8 md:h-10 text-black" /></div><CardTitle className="text-primary text-xl md:text-2xl font-mono">PRIVACY & SECURITY</CardTitle><CardDescription className="text-secondary text-base md:text-lg mt-2 mb-6 font-mono">Built-in secure encryption and local processing.</CardDescription></CardHeader>
              <CardContent className="p-0"><ul className="space-y-4 text-secondary text-base md:text-lg"><li className="flex items-start font-mono"><CheckCircle className="w-5 h-5 text-neon-green mr-4 mt-1 flex-shrink-0" />Secure on-device voice processing</li><li className="flex items-start font-mono"><CheckCircle className="w-5 h-5 text-neon-green mr-4 mt-1 flex-shrink-0" />No data transmitted to external servers</li><li className="flex items-start font-mono"><CheckCircle className="w-5 h-5 text-neon-green mr-4 mt-1 flex-shrink-0" />Encrypted local storage</li></ul></CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-holographic opacity-30"></div>
          <div className="absolute inset-0 bg-surface-elevated/80"></div>
          <div className="relative z-10 p-8 sm:p-16 md:p-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-8 font-mono">READY TO JOIN IN?</h2>
            <p className="text-lg md:text-2xl text-secondary mb-12 md:mb-16 max-w-4xl mx-auto font-mono">
              Download the SDK and start building accessible financial interfaces for the future.
            </p>
            <Button size="lg" className="btn-neon-green text-lg md:text-2xl px-10 py-5 md:px-16 md:py-8 touch-target-xl transition-smooth font-mono">
              <Download className="w-6 md:w-8 h-6 md:h-8 mr-4" />
              DOWNLOAD INKLUZIV SDK
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}