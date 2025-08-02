"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Mail, Lock, ArrowLeft, Terminal, Cpu, ShieldCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
  const [countdown, setCountdown] = useState(3)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const { toast } = useToast()
  const router = useRouter()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleVoiceRecord = async () => {
    setVoiceBlob(null)
    audioChunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsRecording(true)
      toast({ title: "Listening...", description: "Please state your passphrase.", className: "card-futuristic border-neon-purple text-primary" })
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (event) => event.data.size > 0 && audioChunksRef.current.push(event.data)
      
      mediaRecorderRef.current.onstop = () => {
        const recordedBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setVoiceBlob(recordedBlob)
        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
        setCountdown(3)
        // Automatically trigger the demo submission flow
        handleVoiceSubmit(recordedBlob)
      }
      
      mediaRecorderRef.current.start()
      setCountdown(3)
      countdownIntervalRef.current = setInterval(() => setCountdown(prev => prev - 1), 1000)
      
      setTimeout(() => mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(), 3000)

    } catch (err) {
      toast({ title: "Microphone Access Required", description: "Please allow microphone access for voice login.", variant: "destructive" })
      setIsRecording(false)
    }
  }

  const handleTraditionalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    toast({ title: "Login Successful", description: "Welcome back! Redirecting to dashboard..." })
    setTimeout(() => router.push("/banking"), 1500)
  }

  const handleVoiceSubmit = (blob: Blob) => {
    if (!blob) {
      toast({ title: "Voice Sample Required", description: "Please record your voice first.", variant: "destructive" })
      return
    }

    setIsProcessing(true)

    toast({ title: "Voice Captured", description: "Processing encrypted voiceprint...", className: "card-futuristic border-neon-purple text-primary" })

    setTimeout(() => {
      toast({ title: "Analyzing Voice Pattern", description: "Matching against biometric key...", className: "card-futuristic border-neon-cyan text-primary" })
    }, 2000)

    setTimeout(() => {
      toast({ title: "Authentication Successful!", description: "Welcome back! Redirecting...", className: "card-futuristic border-neon-green text-primary" })
    }, 4000)

    setTimeout(() => {
      router.push("/dashboard")
    }, 5500)
  }

  return (
    <div className="min-h-screen bg-surface scan-lines flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-neon-cyan hover:text-primary transition-colors focus-visible:ring-accessible font-mono">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>BACK TO HOME</span>
          </Link>
        </div>

        <Card className="card-futuristic border-holographic">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Terminal className="w-6 h-6 text-neon-cyan" />
              <span className="text-neon-orange text-sm font-mono tracking-widest">USER AUTHENTICATION</span>
            </div>
            <CardTitle className="text-2xl text-primary font-mono">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">Choose your authentication method</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="traditional" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-surface-elevated border border-strong">
                <TabsTrigger value="traditional" className="data-[state=active]:bg-neon-orange data-[state=active]:text-black transition-smooth font-mono" disabled={isProcessing}>EMAIL & PASSWORD</TabsTrigger>
                <TabsTrigger value="voice" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black transition-smooth font-mono" disabled={isProcessing}>VOICE LOGIN</TabsTrigger>
              </TabsList>

              <TabsContent value="traditional" className="space-y-4 mt-6">
                <form onSubmit={handleTraditionalSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-primary font-mono">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-cyan" />
                      <Input id="email" type="email" placeholder="Enter your email" className="pl-10 bg-surface border-border text-primary focus:border-neon-cyan focus-visible:ring-neon-cyan" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={isProcessing} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-primary font-mono">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-orange" />
                      <Input id="password" type="password" placeholder="Enter your password" className="pl-10 bg-surface border-border text-primary focus:border-neon-orange focus-visible:ring-neon-orange" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required disabled={isProcessing} />
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Link href="#" className={`text-sm focus-visible:ring-accessible ${isProcessing ? 'text-muted pointer-events-none' : 'text-neon-cyan hover:text-primary'}`}>Forgot password?</Link>
                  </div>
                  <Button type="submit" className="w-full btn-neon-orange font-mono" disabled={isProcessing}>{isProcessing ? "AUTHENTICATING..." : "SIGN IN"}</Button>
                </form>
              </TabsContent>

              <TabsContent value="voice" className="space-y-4 mt-6 text-center">
                <Label className="text-primary font-mono">Voice Authentication</Label>
                <div className="p-10 border-2 border-dashed border-border rounded-lg bg-surface/50">
                  <Button
                    type="button"
                    onClick={handleVoiceRecord}
                    disabled={isRecording || isProcessing}
                    size="lg"
                    className={`w-40 h-40 rounded-full text-2xl transition-smooth font-mono ${
                      isProcessing ? 'bg-muted cursor-not-allowed' :
                      isRecording ? "bg-error text-white pulse-recording cursor-not-allowed" : "btn-neon-cyan"
                    }`}
                  >
                    {isRecording || isProcessing ? <MicOff className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    {isProcessing ? "Processing..." : isRecording ? `Listening... ${countdown}s` : "Tap to Speak"}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground pt-4">
                    Your session will be authenticated automatically after speaking.
                </p>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className={`font-medium focus-visible:ring-accessible transition-smooth ${isProcessing ? 'text-muted pointer-events-none' : 'text-neon-orange hover:text-primary'}`}>Sign Up</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}