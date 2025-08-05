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
import { Mic, MicOff, User, Mail, Lock, ArrowLeft, Terminal, Cpu, ShieldCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
  const [countdown, setCountdown] = useState(5)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [voiceFormData, setVoiceFormData] = useState({
    name: "",
    email: "",
  })

  const router = useRouter()
  const { toast } = useToast()

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

  const startRecording = async () => {
    setVoiceBlob(null)
    audioChunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsRecording(true)
      toast({ title: "Recording Voice...", description: "Speak clearly. The recording will stop automatically.", className: "card-futuristic border-neon-purple text-primary" })
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      mediaRecorderRef.current.onstop = () => {
        const recordedBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setVoiceBlob(recordedBlob)
        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
        setCountdown(5)
        toast({ title: "Voice Sample Captured", description: "Your unique voice pattern has been successfully recorded.", className: "card-futuristic border-neon-green text-primary" })
      }
      mediaRecorderRef.current.start()
      setCountdown(5)
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop()
        }
      }, 5000)
    } catch (err) {
      toast({ title: "Microphone Access Required", description: "Please allow microphone access to use voice registration.", variant: "destructive" })
      setIsRecording(false)
    }
  }

  const handleTraditionalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Password Mismatch", description: "Please ensure your passwords match.", variant: "destructive" })
      return
    }
    toast({ title: "Account Created Successfully", description: "Redirecting to your dashboard..." })
    router.push("/banking")
  }

  const handleVoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!voiceBlob) {
      toast({ title: "Voice Sample Required", description: "Please record your voice sample before registering.", variant: "destructive" })
      return
    }

    setIsProcessing(true)

    toast({ title: "Registration Initiated", description: "Uploading encrypted voiceprint...", className: "card-futuristic border-neon-purple text-primary" })

    setTimeout(() => {
      toast({ title: "Analyzing Voice Pattern", description: "Creating secure biometric key...", className: "card-futuristic border-neon-cyan text-primary" })
    }, 2000)

    setTimeout(() => {
      toast({ title: "Authentication Successful!", description: "Your account is secured. Redirecting...", className: "card-futuristic border-neon-green text-primary" })
    }, 4500)

    setTimeout(() => {
      router.push("/dashboard")
    }, 6000)
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
              <Terminal className="w-6 h-6 text-neon-orange" />
              <span className="text-neon-cyan text-sm font-mono tracking-widest">USER REGISTRATION</span>
            </div>
            <CardTitle className="text-2xl text-primary font-mono">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Choose your preferred registration method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="traditional" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-surface-elevated border border-strong">
                <TabsTrigger value="traditional" className="data-[state=active]:bg-neon-orange data-[state=active]:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono" disabled={isProcessing}>
                  STANDARD
                </TabsTrigger>
                <TabsTrigger value="voice" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono" disabled={isProcessing}>
                  VOICE SETUP
                </TabsTrigger>
              </TabsList>

              <TabsContent value="traditional" className="space-y-4 mt-6">
                <form onSubmit={handleTraditionalSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-primary font-mono">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-orange" />
                      <Input id="name" placeholder="Enter your full name" className="pl-10 bg-surface border-border text-primary focus:border-neon-orange focus-visible:ring-neon-orange" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required disabled={isProcessing} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-primary font-mono">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-cyan" />
                      <Input id="email" type="email" placeholder="Enter your email" className="pl-10 bg-surface border-border text-primary focus:border-neon-cyan focus-visible:ring-neon-cyan" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={isProcessing} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-primary font-mono">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-orange" />
                      <Input id="password" type="password" placeholder="Create a secure password" className="pl-10 bg-surface border-border text-primary focus:border-neon-orange focus-visible:ring-neon-orange" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required disabled={isProcessing} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-primary font-mono">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-cyan" />
                      <Input id="confirmPassword" type="password" placeholder="Confirm your password" className="pl-10 bg-surface border-border text-primary focus:border-neon-cyan focus-visible:ring-neon-cyan" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required disabled={isProcessing} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full btn-neon-orange focus-visible:ring-accessible font-mono" disabled={isProcessing}>
                    {isProcessing ? "PROCESSING..." : "CREATE ACCOUNT"}
                  </Button>
                </form>
              </TabsContent>

             <TabsContent value="voice" className="space-y-4 mt-6">
  <form onSubmit={handleVoiceSubmit} className="space-y-4">
    <div className="space-y-1">
      <Label className="text-primary font-mono text-lg">Voice SignUp</Label>
      <p className="text-sm text-muted-foreground">
        Say your full name and email address
      </p>
    </div>

    <div className="text-center p-8 border-2 border-dashed border-border rounded-lg bg-surface/50">
      <Button
        type="button"
        onClick={startRecording}
        disabled={isRecording || isProcessing}
        className={`w-full text-lg py-4 transition-smooth font-mono ${
          isProcessing
            ? "cursor-not-allowed bg-muted"
            : isRecording
            ? "bg-error text-primary pulse-recording cursor-not-allowed"
            : voiceBlob
            ? "btn-neon-green"
            : "btn-neon-purple"
        }`}
      >
        {isRecording ? (
          <>
            <MicOff className="w-5 h-5 mr-2" />
            RECORDING... {countdown}s
          </>
        ) : (
          <>
            <Mic className="w-5 h-5 mr-2" />
            {voiceBlob ? "RECORD AGAIN" : "RECORD VOICE"}
          </>
        )}
      </Button>

      {voiceBlob && (
        <p className="text-sm text-neon-green mt-3 text-glow">
          Voice captured successfully.
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-3">
        Speak clearly for 5 seconds to capture your voice pattern.
      </p>
    </div>

    <Button
      type="submit"
      className="w-full btn-neon-cyan focus-visible:ring-accessible font-mono"
      disabled={isProcessing}
    >
      {isProcessing ? "PROCESSING..." : "REGISTER WITH VOICE"}
    </Button>
  </form>
</TabsContent>

            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className={`font-medium focus-visible:ring-accessible transition-smooth ${isProcessing ? "text-muted pointer-events-none" : "text-neon-orange hover:text-primary"}`}>
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
