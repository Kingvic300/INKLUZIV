"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Code, Zap, Shield, CheckCircle, Layers, Eye, Mic, Hand, Download,
  ExternalLink, Copy, Play, FileText, Accessibility, Brain, Volume2, Type,
  Gamepad2, Palette, Focus, Languages, Camera, Fingerprint, MousePointer,
  Headphones, ScanLine, Vibrate,
} from "lucide-react"

const featureCategories = [
  { title: "VOICE & AUDIO", icon: Mic, color: "cyan", features: [{ icon: Mic, title: 'Voice Control', desc: 'Complete voice navigation', color: 'cyan' }, { icon: Type, title: 'Text-to-Speech', desc: 'Real-time audio feedback', color: 'orange' }, { icon: Volume2, title: 'Live Captions', desc: 'Real-time subtitles', color: 'purple' }, { icon: Headphones, title: 'Audio Descriptions', desc: 'Detailed audio descriptions', color: 'green' }] },
  { title: "VISUAL ACCESSIBILITY", icon: Eye, color: "green", features: [{ icon: Eye, title: 'Screen Reader', desc: 'NVDA, JAWS, VoiceOver', color: 'cyan' }, { icon: Palette, title: 'High Contrast', desc: 'Enhanced visual contrast', color: 'orange' }, { icon: Focus, title: 'Focus Indicators', desc: 'Clear visual focus', color: 'purple' }, { icon: ScanLine, title: 'Magnification', desc: 'Magnification support', color: 'green' }] },
  { title: "MOTOR & INPUT", icon: Hand, color: "orange", features: [{ icon: Hand, title: 'Large Targets', desc: 'WCAG 2.1 AA compliant', color: 'cyan' }, { icon: Gamepad2, title: 'Keyboard Nav', desc: 'Full keyboard support', color: 'orange' }, { icon: MousePointer, title: 'Switch Control', desc: 'Assistive device support', color: 'purple' }, { icon: Vibrate, title: 'Haptic Feedback', desc: 'Tactile responses', color: 'green' }] },
  { title: "ADVANCED FEATURES", icon: Brain, color: "purple", features: [{ icon: Brain, title: 'Cognitive Support', desc: 'Simplified interfaces', color: 'cyan' }, { icon: Languages, title: 'Multi-Language', desc: '50+ languages supported', color: 'orange' }, { icon: Camera, title: 'Computer Vision', desc: 'AI-powered analysis', color: 'purple' }, { icon: Fingerprint, title: 'Biometric Auth', desc: 'Accessible authentication', color: 'green' }] }
];

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
          <Link href="/" className="inline-flex items-center text-neon-cyan hover:text-neon-cyan-hover transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 p-2 rounded-lg font-mono">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium hidden sm:inline">BACK</span>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/sdk"><Button variant="outline" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 touch-target-large bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono text-sm px-3 sm:px-4"><Code className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">SDK</span></Button></Link>
            <Link href="/banking"><Button className="btn-neon-cyan touch-target-large transition-smooth font-mono text-sm px-3 sm:px-4"><Eye className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">DEMO</span></Button></Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gradient font-mono mb-6">INKLUZIV DOCS</h1>
          <p className="text-xl md:text-2xl text-secondary mb-8 font-mono">Complete documentation for accessible banking</p>
          <div className="flex justify-center flex-wrap gap-3">
            <Badge className="bg-neon-green text-black text-base md:text-lg px-4 py-1.5 font-mono">v2.1.0</Badge>
            <Badge className="bg-neon-cyan text-black text-base md:text-lg px-4 py-1.5 font-mono">WCAG 2.1 AA</Badge>
            <Badge className="bg-neon-orange text-black text-base md:text-lg px-4 py-1.5 font-mono">React 18+</Badge>
          </div>
        </section>

        {/* --- FIXED QUICK START SECTION --- */}
        <section className="mb-12 md:mb-16">
          <Card className="card-futuristic">
            <CardHeader>
              <CardTitle className="text-primary text-3xl sm:text-4xl font-mono flex items-center">
                <Zap className="w-7 sm:w-8 h-7 sm:h-8 mr-4 text-neon-green" />
                QUICK START
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Installation Card */}
                <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong">
                  <h4 className="text-neon-cyan text-xl font-semibold mb-4 font-mono flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    INSTALLATION
                  </h4>
                  <div className="bg-surface-elevated p-4 rounded border border-strong mb-4 overflow-x-auto">
                    <div className="flex items-center justify-between gap-4">
                      <code className="text-primary text-sm sm:text-base font-mono whitespace-nowrap">
                        npm install @inkluziv/sdk
                      </code>
                      <Button size="icon" variant="ghost" className="p-2 flex-shrink-0 text-secondary hover:text-primary" onClick={() => copyToClipboard("npm install @inkluziv/sdk")}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-secondary text-sm font-mono">Install the complete accessibility SDK.</p>
                </div>
                {/* Basic Setup Card */}
                <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong">
                  <h4 className="text-neon-green text-xl font-semibold mb-4 font-mono flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    BASIC SETUP
                  </h4>
                  <div className="bg-surface-elevated p-4 rounded border border-strong overflow-x-auto">
                    <code className="text-primary text-xs sm:text-sm font-mono whitespace-pre">
                      {`import { InkluzivProvider } from '@inkluziv/sdk';\n\n<InkluzivProvider features="all">\n  <YourApp />\n</InkluzivProvider>`}
                    </code>
                  </div>
                   <p className="text-secondary text-sm font-mono mt-4">Wrap your app to enable all features.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Feature Categories */}
        <section className="mb-12 md:mb-16">
          <div className="grid lg:grid-cols-2 gap-8">
            {featureCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <Card key={category.title} className="card-futuristic">
                  <CardHeader>
                    <CardTitle className={`text-primary text-2xl md:text-3xl font-mono flex items-center text-neon-${category.color}`}>
                      <CategoryIcon className="w-7 md:w-8 h-7 md:h-8 mr-4" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {category.features.map(feature => {
                        const FeatureIcon = feature.icon;
                        return (
                          <div key={feature.title} className="bg-surface p-4 rounded border border-strong h-full">
                            <div className="flex items-center mb-2">
                              <FeatureIcon className={`w-5 h-5 text-neon-${feature.color} mr-2`} />
                              <h5 className="text-primary font-semibold font-mono">{feature.title}</h5>
                            </div>
                            <p className="text-secondary text-sm font-mono">{feature.desc}</p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-12 md:mb-16">
            <Card className="card-futuristic">
                <CardHeader><CardTitle className="text-primary text-3xl md:text-4xl font-mono flex items-center"><Code className="w-8 h-8 mr-4 text-neon-cyan" />API REFERENCE</CardTitle></CardHeader>
                <CardContent className="space-y-8">
                    <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong overflow-x-auto">
                        <h4 className="text-neon-cyan text-xl md:text-2xl font-semibold mb-4 font-mono">InkluzivProvider</h4>
                        <div className="bg-surface-elevated p-4 rounded border border-strong mb-4"><code className="text-primary text-sm font-mono whitespace-pre">{`<InkluzivProvider\n  features={['voice', 'tts', 'captions']}\n  theme="futuristic"\n>\n  {children}\n</InkluzivProvider>`}</code></div>
                    </div>
                </CardContent>
            </Card>
        </section>

        {/* --- IMPLEMENTATION EXAMPLES SECTION HAS BEEN REMOVED --- */}

        {/* Best Practices */}
        <section className="mb-12 md:mb-16">
            <Card className="card-futuristic">
                <CardHeader><CardTitle className="text-primary text-3xl md:text-4xl font-mono flex items-center"><Shield className="w-8 h-8 mr-4 text-neon-orange" />BEST PRACTICES</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-neon-cyan/10 border border-neon-cyan/30 p-4 md:p-6 rounded-lg">
                            <h4 className="text-neon-cyan text-xl font-semibold mb-4 font-mono">VOICE</h4>
                            <ul className="space-y-2 text-secondary font-mono"><li className="flex items-start"><CheckCircle className="w-5 h-5 text-neon-cyan mr-2 mt-0.5 flex-shrink-0" />Use clear, simple command phrases</li><li className="flex items-start"><CheckCircle className="w-5 h-5 text-neon-cyan mr-2 mt-0.5 flex-shrink-0" />Provide voice feedback for all actions</li></ul>
                        </div>
                        <div className="bg-neon-green/10 border border-neon-green/30 p-4 md:p-6 rounded-lg">
                            <h4 className="text-neon-green text-xl font-semibold mb-4 font-mono">VISUAL</h4>
                            <ul className="space-y-2 text-secondary font-mono"><li className="flex items-start"><CheckCircle className="w-5 h-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />Maintain 4.5:1 contrast ratio</li><li className="flex items-start"><CheckCircle className="w-5 h-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />Use semantic HTML elements</li></ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>

        {/* Resources */}
        <section className="mb-12 md:mb-16">
            <Card className="card-futuristic">
                <CardHeader><CardTitle className="text-primary text-3xl md:text-4xl font-mono flex items-center"><FileText className="w-8 h-8 mr-4 text-neon-purple" />RESOURCES & LINKS</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong"><h4 className="text-neon-cyan text-xl font-semibold mb-4 font-mono">DOCUMENTATION</h4><ul className="space-y-3"><li><a href="#" className="text-secondary hover:text-neon-cyan transition-smooth font-mono flex items-center"><ExternalLink className="w-4 h-4 mr-2" />API Reference</a></li><li><a href="#" className="text-secondary hover:text-neon-cyan transition-smooth font-mono flex items-center"><ExternalLink className="w-4 h-4 mr-2" />Component Library</a></li></ul></div>
                        <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong"><h4 className="text-neon-green text-xl font-semibold mb-4 font-mono">EXAMPLES</h4><ul className="space-y-3"><li><a href="#" className="text-secondary hover:text-neon-green transition-smooth font-mono flex items-center"><ExternalLink className="w-4 h-4 mr-2" />Banking Dashboard</a></li><li><a href="#" className="text-secondary hover:text-neon-green transition-smooth font-mono flex items-center"><ExternalLink className="w-4 h-4 mr-2" />Wallet Integration</a></li></ul></div>
                        <div className="bg-surface p-4 md:p-6 rounded-lg border border-strong"><h4 className="text-neon-orange text-xl font-semibold mb-4 font-mono">COMMUNITY</h4><ul className="space-y-3"><li><a href="#" className="text-secondary hover:text-neon-orange transition-smooth font-mono flex items-center"><ExternalLink className="w-4 h-4 mr-2" />GitHub Repository</a></li><li><a href="#" className="text-secondary hover:text-neon-orange transition-smooth font-mono flex items-center"><ExternalLink className="w-4 h-4 mr-2" />Discord Community</a></li></ul></div>
                    </div>
                </CardContent>
            </Card>
        </section>
        
        {/* Footer CTA */}
        <footer className="text-center py-12">
          <p className="text-secondary text-lg font-mono mb-4">Ready to build an accessible future?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sdk"><Button className="btn-neon-cyan text-lg px-8 py-4 font-mono w-full sm:w-auto">DOWNLOAD SDK</Button></Link>
            <Link href="/banking"><Button variant="outline" className="text-lg px-8 py-4 bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-smooth font-mono w-full sm:w-auto">TRY DEMO</Button></Link>
          </div>
        </footer>
      </main>
    </div>
  )
}