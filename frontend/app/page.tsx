import Link from "next/link"
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
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface scan-lines">
      {/* Header */}
      <header className="bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 sticky top-0 z-50 shadow-neon-cyan/20">
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
          <div className="flex space-x-3">
            <Link href="/banking">
              <Button className="btn-neon-orange touch-target-large transition-smooth font-mono">
                <Wifi className="w-4 h-4 mr-2" />
                Experience Demo
              </Button>
            </Link>
            <Link href="/banking">
              <Button
                variant="outline"
                className="px-12 py-6 border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
              >
                <Cpu className="w-4 h-4 mr-2" />
                Banking Demo
              </Button>
            </Link>
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-grid-move"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="text-neon-orange text-sm bg-neon-orange/10 border border-neon-orange/30 px-4 py-2 rounded-lg backdrop-blur-sm font-mono tracking-widest">
              NO LIMITS. JUST ACCESS.
            </span>
          </div>
          <h2 className="text-6xl md:text-8xl font-bold text-primary mb-8 leading-tight float">
            ACCESSIBILITY
            <br />
            <span className="text-gradient text-glow">REDEFINED</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Breaking barriers in digital finance. Making DeFi accessible for everyone.
            <br />
            <strong className="text-neon-cyan text-glow">INKLUZIV empowers universal access.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="btn-neon-cyan text-xl px-12 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono"
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
              >
                <Code className="w-6 h-6 mr-3" />
                VIEW DOCS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-24 px-4 bg-surface-elevated/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-primary mb-6">THE CHALLENGE</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Digital finance excludes millions of users with disabilities
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-futuristic border-holographic">
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
            <Card className="card-futuristic border-holographic">
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
            <Card className="card-futuristic border-holographic">
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
      <section className="py-24 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <h3 className="text-5xl font-bold text-primary mb-8">THE SOLUTION</h3>
          <div className="max-w-5xl mx-auto mb-16">
            <p className="text-xl text-muted-foreground mb-12">
              A <strong className="text-neon-cyan text-glow">comprehensive accessibility SDK</strong> for financial
              applications
            </p>
            <div className="card-futuristic p-12 rounded-lg border-holographic">
              <h4 className="text-3xl font-bold text-primary mb-12">INKLUZIV SDK ENABLES ACCESS FOR:</h4>
              <div className="grid md:grid-cols-4 gap-12">
                <div className="text-center float" style={{ animationDelay: "0s" }}>
                  <div className="w-24 h-24 bg-neon-cyan rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-cyan pulse-glow">
                    <Eye className="w-12 h-12 text-black" />
                  </div>
                  <h5 className="text-xl font-semibold text-primary">VISUAL</h5>
                </div>
                <div className="text-center float" style={{ animationDelay: "1.5s" }}>
                  <div className="w-24 h-24 bg-neon-orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-orange pulse-glow">
                    <Hand className="w-12 h-12 text-black" />
                  </div>
                  <h5 className="text-xl font-semibold text-primary">MOTOR</h5>
                </div>
                <div className="text-center float" style={{ animationDelay: "3s" }}>
                  <div className="w-24 h-24 bg-neon-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-purple pulse-glow">
                    <Ear className="w-12 h-12 text-black" />
                  </div>
                  <h5 className="text-xl font-semibold text-primary">HEARING</h5>
                </div>
                <div className="text-center float" style={{ animationDelay: "4.5s" }}>
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
      <section className="py-24 px-4 bg-surface-elevated/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-primary mb-6">COMPREHENSIVE FEATURES</h3>
            <p className="text-xl text-muted-foreground">Complete accessibility solution for financial apps</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <Card key={index} className="card-futuristic p-6">
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
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <h3 className="text-5xl font-bold text-primary mb-6">READY TO BUILD ACCESSIBLE?</h3>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Join the accessibility revolution. Experience the future of inclusive financial interfaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="btn-neon-orange text-xl px-16 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
              >
                TRY DEMO
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-16 py-8 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono"
              >
                <Code className="w-6 h-6 mr-4" />
                VIEW DOCS
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
          <p className="text-secondary text-matrix">Making digital finance accessible for everyone</p>
        </div>
      </footer>
    </div>
  )
}