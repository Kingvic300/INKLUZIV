'use client';
import { useState } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Mic, Eye, Hand, Ear, Code, ArrowRight, Shield, Cpu, Wifi, Brain, Gamepad2, Type, Volume2, MousePointer,
  Smartphone, Globe, Languages, Timer, Accessibility, Focus, Palette, ScanLine, Headphones, Vibrate,
  Camera, Fingerprint, Book,
  Menu, X
} from "lucide-react"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface scan-lines">
      {/* Header */}
      <header className="bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 sticky top-0 z-50 shadow-neon-cyan/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neon-orange rounded-lg flex items-center justify-center shimmer">
              <Accessibility className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient text-glow font-mono">INKLUZIV</h1>
              <p className="text-sm text-neon-cyan font-mono animate-pulse hidden sm:block">No limits. Just access.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-3">
            <Link href="/register">
              <Button
                variant="outline"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 touch-target-large bg-transparent border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black transition-smooth font-mono"
              >
                <Wifi className="w-4 h-4 mr-2" />
                Experience Demo
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary hover:bg-surface-elevated"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Flyout */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-surface-elevated/95 backdrop-blur-lg border-t border-neon-cyan/30">
            <div className="container mx-auto px-4 py-8 flex flex-col space-y-4">
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black">
                  <Wifi className="w-4 h-4 mr-2" />
                  Experience Demo
                </Button>
              </Link>
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
              NO LIMITS. JUST ACCESS.
            </span>
          </div>
          {/* Responsive Font Size */}
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold text-primary mb-8 leading-tight float">
            ACCESSIBILITY
            <br />
            <span className="text-gradient text-glow">REDEFINED</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Breaking barriers in finance. Making finance accessible for everyone.
            <br />
            <strong className="text-neon-cyan text-glow">INKLUZIV empowers universal access.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="btn-neon-cyan text-lg md:text-xl px-10 md:px-12 py-5 md:py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono"
              >
                <Wifi className="w-5 md:w-6 h-5 md:h-6 mr-3" />
                EXPERIENCE DEMO
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                size="lg"
                variant="outline"
                className="text-lg md:text-xl px-10 md:px-12 py-5 md:py-6 border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
              >
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
            {/* Responsive Font Size */}
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6">THE CHALLENGE</h3>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Digital finance excludes millions of users with disabilities
            </p>
          </div>
          {/* Grid already responsive, stacks automatically on mobile */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cards remain the same */}
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

      {/* Solution Section */}
      <section className="py-20 md:py-24 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold text-primary mb-8">THE SOLUTION</h3>
          <div className="max-w-5xl mx-auto mb-12 md:mb-16">
            <p className="text-lg md:text-xl text-muted-foreground mb-12">
              A <strong className="text-neon-cyan text-glow">comprehensive accessibility SDK</strong> for financial
              applications
            </p>
            <div className="card-futuristic p-8 md:p-12 rounded-lg border-holographic">
              <h4 className="text-2xl md:text-3xl font-bold text-primary mb-12">INKLUZIV SDK ENABLES ACCESS FOR:</h4>
              {/* Responsive Grid for Solution Icons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <div className="text-center float" style={{ animationDelay: "0s" }}>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-neon-cyan rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-cyan pulse-glow">
                    <Eye className="w-10 h-10 md:w-12 md:h-12 text-black" />
                  </div>
                  <h5 className="text-lg md:text-xl font-semibold text-primary">VISUAL</h5>
                </div>
                <div className="text-center float" style={{ animationDelay: "1.5s" }}>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-neon-orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-orange pulse-glow">
                    <Hand className="w-10 h-10 md:w-12 md:h-12 text-black" />
                  </div>
                  <h5 className="text-lg md:text-xl font-semibold text-primary">MOTOR</h5>
                </div>
                <div className="text-center float" style={{ animationDelay: "3s" }}>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-neon-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-purple pulse-glow">
                    <Ear className="w-10 h-10 md:w-12 md:h-12 text-black" />
                  </div>
                  <h5 className="text-lg md:text-xl font-semibold text-primary">HEARING</h5>
                </div>
                <div className="text-center float" style={{ animationDelay: "4.5s" }}>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-green pulse-glow">
                    <Brain className="w-10 h-10 md:w-12 md:h-12 text-black" />
                  </div>
                  <h5 className="text-lg md:text-xl font-semibold text-primary">COGNITIVE</h5>
                </div>
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
            <p className="text-lg md:text-xl text-muted-foreground">Complete accessibility solution for financial apps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Mic, title: 'VOICE CONTROL', description: 'Complete voice navigation and command system', color: 'cyan' },
              { icon: Type, title: 'TEXT-TO-SPEECH', description: 'Real-time audio feedback for all elements', color: 'orange' },
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
          <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6">READY TO BUILD ACCESSIBLE?</h3>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Join the accessibility revolution. Experience the future of inclusive financial interfaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="btn-neon-orange text-lg md:text-xl px-12 md:px-16 py-6 md:py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
              >
                TRY DEMO
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                size="lg"
                variant="outline"
                className="text-lg md:text-xl px-12 md:px-16 py-6 md:py-8 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono"
              >
                <Code className="w-5 md:w-6 h-5 md:h-6 mr-4" />
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