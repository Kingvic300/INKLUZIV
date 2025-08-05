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
import { Mic, MicOff, User, Mail, Lock, ArrowLeft, Terminal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// a11y: simple sr-only utility if not present globally (Tailwind users often have this)
const SrOnly = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
)

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
  const [voiceFormData] = useState({
    name: "",
    email: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // a11y: refs to focus back on buttons after async actions
  const recordButtonRef = useRef<HTMLButtonElement | null>(null)
  const submitVoiceButtonRef = useRef<HTMLButtonElement | null>(null)
  const submitStdButtonRef = useRef<HTMLButtonElement | null>(null)

  // a11y: live regions for updates (status + assertive)
  const [liveStatus, setLiveStatus] = useState<string>("")
  const [liveAssertive, setLiveAssertive] = useState<string>("")

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
      setLiveStatus("Recording started. Speak your full name and email address.")
      toast({
        title: "Recording Voice...",
        description: "Speak clearly. The recording will stop automatically.",
        className: "card-futuristic border-neon-purple text-primary",
      })

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
        setLiveAssertive("Voice sample captured successfully.")
        toast({
          title: "Voice Sample Captured",
          description: "Your unique voice pattern has been successfully recorded.",
          className: "card-futuristic border-neon-green text-primary",
        })
        // a11y: return focus to Record button
        recordButtonRef.current?.focus()
      }
      mediaRecorderRef.current.start()
      setCountdown(5)
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          const next = prev - 1
          // a11y: announce last 3 seconds more assertively
          if (next > 0 && next <= 3) {
            setLiveStatus(`Recording… ${next} seconds remaining.`)
          }
          return next
        })
      }, 1000)
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop()
        }
      }, 5000)
    } catch {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice registration.",
        variant: "destructive",
      })
      setLiveAssertive("Microphone access is required for voice registration.")
      setIsRecording(false)
      recordButtonRef.current?.focus()
    }
  }

  const handleTraditionalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure your passwords match.",
        variant: "destructive",
      })
      setLiveAssertive("Passwords do not match. Please ensure both passwords are the same.")
      return
    }
    toast({ title: "Account Created Successfully", description: "Redirecting to your dashboard..." })
    setLiveStatus("Account created successfully. Redirecting to your dashboard.")
    router.push("/banking")
    // a11y note: if staying on page, we could focus a confirmation heading here
  }

  const handleVoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!voiceBlob) {
      toast({
        title: "Voice Sample Required",
        description: "Please record your voice sample before registering.",
        variant: "destructive",
      })
      setLiveAssertive("Voice sample required. Please record your voice before registering.")
      recordButtonRef.current?.focus()
      return
    }

    setIsProcessing(true)
    setLiveStatus("Registration initiated. Uploading encrypted voiceprint.")

    toast({
      title: "Registration Initiated",
      description: "Uploading encrypted voiceprint...",
      className: "card-futuristic border-neon-purple text-primary",
    })

    setTimeout(() => {
      setLiveStatus("Analyzing voice pattern. Creating secure biometric key.")
      toast({
        title: "Analyzing Voice Pattern",
        description: "Creating secure biometric key...",
        className: "card-futuristic border-neon-cyan text-primary",
      })
    }, 2000)

    setTimeout(() => {
      setLiveStatus("Authentication successful. Redirecting shortly.")
      toast({
        title: "Authentication Successful!",
        description: "Your account is secured. Redirecting...",
        className: "card-futuristic border-neon-green text-primary",
      })
    }, 4500)

    setTimeout(() => {
      router.push("/dashboard")
      // a11y: if staying, you could focus a success heading here
    }, 6000)
  }

  return (
    <div className="min-h-screen bg-surface scan-lines flex items-center justify-center p-4">
      {/* a11y live regions (invisible) */}
      <div aria-live="polite" role="status" className="sr-only">
        {liveStatus}
      </div>
      <div aria-live="assertive" role="alert" className="sr-only">
        {liveAssertive}
      </div>

      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-neon-cyan hover:text-primary transition-colors focus-visible:ring-accessible font-mono"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            <span>BACK</span>
          </Link>
        </div>

        <Card className="card-futuristic border-holographic" role="region" aria-labelledby="create-account-title">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4" aria-hidden="true">
              <Terminal className="w-6 h-6 text-neon-orange" />
              <span className="text-neon-cyan text-sm font-mono tracking-widest">USER REGISTRATION</span>
            </div>
            <CardTitle id="create-account-title" className="text-2xl text-primary font-mono">
              Create Account
            </CardTitle>
            <CardDescription id="registration-method-desc" className="text-muted-foreground">
              Choose your preferred registration method
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Tabs already use proper roles via shadcn/ui; add aria-describedby for clarity */}
            <Tabs defaultValue="traditional" className="w-full" aria-describedby="registration-method-desc">
              <TabsList className="grid w-full grid-cols-2 bg-surface-elevated border border-strong" role="tablist">
                <TabsTrigger
                  value="traditional"
                  className="data-[state=active]:bg-neon-orange data-[state=active]:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
                  disabled={isProcessing}
                  aria-controls="tab-traditional"
                >
                  STANDARD
                </TabsTrigger>
                <TabsTrigger
                  value="voice"
                  className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono"
                  disabled={isProcessing}
                  aria-controls="tab-voice"
                >
                  VOICE SETUP
                </TabsTrigger>
              </TabsList>

              {/* --- STANDARD TAB --- */}
              <TabsContent value="traditional" className="space-y-4 mt-6" id="tab-traditional" role="tabpanel" aria-labelledby="standard-tab">
                <form onSubmit={handleTraditionalSubmit} className="space-y-4" aria-busy={isProcessing ? "true" : "false"} aria-describedby="std-form-help">
                  <SrOnly>
                    <div id="std-form-help">All fields marked required must be completed.</div>
                  </SrOnly>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-primary font-mono">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-orange" aria-hidden="true" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        className="pl-10 bg-surface border-border text-primary focus:border-neon-orange focus-visible:ring-neon-orange"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={isProcessing}
                        autoComplete="name"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-primary font-mono">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-cyan" aria-hidden="true" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-surface border-border text-primary focus:border-neon-cyan focus-visible:ring-neon-cyan"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isProcessing}
                        autoComplete="email"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-primary font-mono">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-orange" aria-hidden="true" />
                      <Input
                        id="password"
                        name="new-password"
                        type="password"
                        placeholder="Create a secure password"
                        className="pl-10 bg-surface border-border text-primary focus:border-neon-orange focus-visible:ring-neon-orange"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        disabled={isProcessing}
                        autoComplete="new-password"
                        aria-required="true"
                        aria-describedby="password-help"
                      />
                    </div>
                    <SrOnly>
                      <div id="password-help">Use at least 8 characters. Avoid common words.</div>
                    </SrOnly>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-primary font-mono">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-cyan" aria-hidden="true" />
                      <Input
                        id="confirmPassword"
                        name="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10 bg-surface border-border text-primary focus:border-neon-cyan focus-visible:ring-neon-cyan"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        disabled={isProcessing}
                        autoComplete="new-password"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <Button
                    ref={submitStdButtonRef}
                    type="submit"
                    className="w-full btn-neon-orange focus-visible:ring-accessible font-mono"
                    disabled={isProcessing}
                    aria-label="Create account using standard method"
                  >
                    {isProcessing ? "PROCESSING..." : "CREATE ACCOUNT"}
                  </Button>
                </form>
              </TabsContent>

              {/* --- VOICE TAB --- */}
              <TabsContent value="voice" className="space-y-4 mt-6" id="tab-voice" role="tabpanel" aria-labelledby="voice-tab">
                <form
                  onSubmit={handleVoiceSubmit}
                  className="space-y-4"
                  aria-busy={isProcessing ? "true" : "false"}
                  aria-describedby="voice-instructions voice-help"
                >
                  <div className="space-y-1">
                    <Label className="text-primary font-mono text-lg" id="voice-legend">
                      Voice SignUp
                    </Label>
                    <p id="voice-instructions" className="text-sm text-muted-foreground">
                      Say your full name and email address when recording.
                    </p>
                  </div>

                  <div
                    className="text-center p-8 border-2 border-dashed border-border rounded-lg bg-surface/50"
                    role="group"
                    aria-labelledby="voice-legend"
                    aria-describedby="voice-instructions voice-progress voice-help"
                  >
                    {/* a11y: progress / status announcer */}
                    <SrOnly>
                      <div id="voice-help">Recording lasts five seconds and will stop automatically.</div>
                    </SrOnly>

                    {/* a11y: live countdown (polite) */}
                    <div id="voice-progress" aria-live="polite" className="sr-only">
                      {isRecording ? `Recording in progress. ${countdown} seconds remaining.` : voiceBlob ? "Recording complete." : "Not recording."}
                    </div>

                    <Button
                      ref={recordButtonRef}
                      type="button"
                      onClick={startRecording}
                      disabled={isRecording || isProcessing}
                      aria-pressed={isRecording}
                      aria-label={isRecording ? `Recording in progress, ${countdown} seconds remaining` : voiceBlob ? "Record again" : "Record voice sample"}
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
                          <MicOff className="w-5 h-5 mr-2" aria-hidden="true" />
                          RECORDING... {countdown}s
                          <SrOnly>Recording will end automatically.</SrOnly>
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5 mr-2" aria-hidden="true" />
                          {voiceBlob ? "RECORD AGAIN" : "RECORD VOICE"}
                        </>
                      )}
                    </Button>

                    {voiceBlob && (
                      <p className="text-sm text-neon-green mt-3 text-glow" role="status" aria-live="polite">
                        Voice captured successfully.
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-3">
                      Speak clearly for 5 seconds to capture your voice pattern.
                    </p>
                  </div>

                  <Button
                    ref={submitVoiceButtonRef}
                    type="submit"
                    className="w-full btn-neon-cyan focus-visible:ring-accessible font-mono"
                    disabled={isProcessing}
                    aria-label="Register with voice"
                  >
                    {isProcessing ? "PROCESSING..." : "REGISTER WITH VOICE"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className={`font-medium focus-visible:ring-accessible transition-smooth ${
                    isProcessing ? "text-muted pointer-events-none" : "text-neon-orange hover:text-primary"
                  }`}
                  aria-label="Go to sign in page"
                >
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
