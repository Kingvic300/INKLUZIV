"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, User, Mail, Lock, ArrowLeft, Terminal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech"
import { apiClient } from "@/lib/api"

// a11y: simple sr-only utility if not present globally (Tailwind users often have this)
const SrOnly = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
)

export default function RegisterPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
  const [countdown, setCountdown] = useState(5)
  const [currentField, setCurrentField] = useState<string>("")
  const [currentSubtitle, setCurrentSubtitle] = useState("")
  const [voiceEnabled, setVoiceEnabled] = useState(true)
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
  const { isListening, transcript, isSupported: speechSupported, startListening, stopListening } = useSpeechRecognition()
  const { speak, isSupported: ttsSupported } = useSpeechSynthesis()

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
    if (voiceEnabled && ttsSupported) {
      const timer = setTimeout(() => {
        const welcomeMessage = "Welcome to INKLUZIV wallet registration. Create your account using standard form or voice registration for your USDT wallet."
        speak(welcomeMessage)
        setCurrentSubtitle(welcomeMessage)
        setTimeout(() => setCurrentSubtitle(""), 8000)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [voiceEnabled, ttsSupported])

  useEffect(() => {
    if (transcript && currentField) {
      handleVoiceInput(transcript)
    }
  }, [transcript, currentField])

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleVoiceInput = (input: string) => {
    const cleanInput = input.trim()
    
    if (currentField === "name") {
      setFormData(prev => ({ ...prev, name: cleanInput }))
      
      if (voiceEnabled && ttsSupported) {
        speak(`Name entered: ${cleanInput}. Now please say your email address.`)
        setCurrentSubtitle(`Name: ${cleanInput}`)
        setTimeout(() => setCurrentSubtitle(""), 3000)
      }
      setCurrentField("email")
    } else if (currentField === "email") {
      // Convert spoken email to text format
      let emailInput = cleanInput
        .replace(/\s+at\s+/gi, "@")
        .replace(/\s+dot\s+/gi, ".")
        .replace(/\s+/g, "")
        .toLowerCase()
      
      setFormData(prev => ({ ...prev, email: emailInput }))
      
      if (voiceEnabled && ttsSupported) {
        speak(`Email entered: ${emailInput}. Now please say your password.`)
        setCurrentSubtitle(`Email: ${emailInput}`)
        setTimeout(() => setCurrentSubtitle(""), 3000)
      }
      setCurrentField("password")
    } else if (currentField === "password") {
      setFormData(prev => ({ ...prev, password: cleanInput }))
      
      if (voiceEnabled && ttsSupported) {
        speak("Password entered. Please confirm your password.")
        setCurrentSubtitle("Password entered. Confirm password.")
        setTimeout(() => setCurrentSubtitle(""), 3000)
      }
      setCurrentField("confirmPassword")
    } else if (currentField === "confirmPassword") {
      setFormData(prev => ({ ...prev, confirmPassword: cleanInput }))
      
      if (voiceEnabled && ttsSupported) {
        speak("Password confirmed. Say 'register' to create your wallet account.")
        setCurrentSubtitle("Say 'register' to create account")
        setTimeout(() => setCurrentSubtitle(""), 3000)
      }
      setCurrentField("")
    }
    
    if (cleanInput.includes("register") && formData.name && formData.email && formData.password && formData.confirmPassword) {
      handleTraditionalSubmit(new Event("submit") as any)
    }
  }

  const handleFieldFocus = (fieldName: string, fieldLabel: string) => {
    setCurrentField(fieldName)
    if (voiceEnabled && ttsSupported) {
      speak(`${fieldLabel} field focused. Please speak your ${fieldLabel.toLowerCase()}.`)
      setCurrentSubtitle(`Speak your ${fieldLabel.toLowerCase()}`)
      setTimeout(() => setCurrentSubtitle(""), 3000)
    }
    
    if (!isListening && speechSupported) {
      startListening()
    }
  }

  const startRecording = async () => {
    setVoiceBlob(null)
    audioChunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsRecording(true)
      setLiveStatus("Recording started. Speak your full name and email address.")
      toast({
        title: "Recording Voice for Wallet...",
        description: "Speak your name and email clearly for wallet creation.",
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
          description: "Your unique voice pattern for wallet access has been recorded.",
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
        description: "Please allow microphone access for voice wallet creation.",
        variant: "destructive",
      })
      setLiveAssertive("Microphone access is required for voice wallet creation.")
      setIsRecording(false)
      recordButtonRef.current?.focus()
    }
  }

  const handleTraditionalSubmit = async (e: React.FormEvent) => {
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
    
    setIsProcessing(true)
    
    try {
      await apiClient.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      if (voiceEnabled && ttsSupported) {
        speak("Wallet account created successfully! Please check your email for verification.")
        setCurrentSubtitle("Account created! Check email for verification.")
        setTimeout(() => setCurrentSubtitle(""), 4000)
      }
      
      toast({ 
        title: "Wallet Account Created", 
        description: "Please check your email for verification code.",
        className: "card-futuristic border-neon-green text-primary"
      })
      
      setLiveStatus("Wallet account created successfully. Check your email.")
      
      // In a real app, you'd redirect to OTP verification page
      // For demo, we'll redirect to login
      setTimeout(() => router.push("/login"), 3000)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed"
      
      if (voiceEnabled && ttsSupported) {
        speak(`Registration failed: ${errorMessage}`)
        setCurrentSubtitle(`Registration failed: ${errorMessage}`)
        setTimeout(() => setCurrentSubtitle(""), 4000)
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!voiceBlob) {
      toast({
        title: "Voice Sample Required",
        description: "Please record your voice sample before creating wallet.",
        variant: "destructive",
      })
      setLiveAssertive("Voice sample required. Please record your voice before creating wallet.")
      recordButtonRef.current?.focus()
      return
    }

    setIsProcessing(true)
    setLiveStatus("Wallet creation initiated. Uploading encrypted voiceprint.")

    try {
      // Convert blob to file
      const file = new File([voiceBlob], "voice-sample.webm", { type: "audio/webm" })
      
      toast({
        title: "Wallet Creation Initiated",
        description: "Uploading encrypted voiceprint for wallet access...",
        className: "card-futuristic border-neon-purple text-primary",
      })

      // For voice signup, we need email from the form
      const email = voiceFormData.email || "demo@inkluziv.com" // Fallback for demo
      
      const response = await apiClient.voiceSignup({
        email: email,
        role: "USER",
        voiceSample: file
      })
      
      setLiveStatus("Voice pattern analyzed. Creating secure wallet access.")
      toast({
        title: "Voice Pattern Analyzed",
        description: "Creating secure biometric wallet access...",
        className: "card-futuristic border-neon-cyan text-primary",
      })

      // In a real app, you'd redirect to OTP verification
      // For demo, we'll simulate completion
      setTimeout(() => {
        setLiveStatus("Wallet created successfully. Redirecting to login.")
        toast({
          title: "Voice Wallet Created!",
          description: "Your voice-controlled USDT wallet is ready. Please login to access.",
          className: "card-futuristic border-neon-green text-primary",
        })
        
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }, 3000)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Voice registration failed"
      
      if (voiceEnabled && ttsSupported) {
        speak(`Voice registration failed: ${errorMessage}`)
        setCurrentSubtitle(`Registration failed: ${errorMessage}`)
        setTimeout(() => setCurrentSubtitle(""), 4000)
      }
      
      toast({
        title: "Voice Registration Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
      setCurrentField("")
    } else {
      if (!speechSupported) {
        toast({ title: "Speech Recognition Not Supported", variant: "destructive" })
        return
      }
      setCurrentSubtitle("Voice recognition active... Say field names to fill them")
      startListening()
    }
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
      
      {/* Live Captions */}
      {currentSubtitle && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-elevated/95 backdrop-blur-md border border-neon-cyan shadow-neon-cyan max-w-4xl rounded-lg">
          <div className="px-4 py-3">
            <p className="text-primary text-center font-medium font-mono text-lg">
              <Mic className="w-5 h-5 inline mr-3" />
              {currentSubtitle}
            </p>
          </div>
        </div>
      )}

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
              <span className="text-neon-cyan text-sm font-mono tracking-widest">WALLET REGISTRATION</span>
            </div>
            <CardTitle id="create-account-title" className="text-2xl text-primary font-mono">
              Create USDT Wallet
            </CardTitle>
            <CardDescription id="registration-method-desc" className="text-muted-foreground">
              Choose your preferred wallet creation method
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Voice Control Button */}
            <div className="mb-6 text-center">
              <Button
                onClick={handleVoiceToggle}
                disabled={!speechSupported}
                className={`w-12 h-12 rounded-full transition-smooth font-mono ${
                  isListening
                    ? "bg-error text-white pulse-recording border-2 border-error"
                    : "btn-neon-purple"
                }`}
                aria-label={isListening ? "Stop voice recognition" : "Activate voice recognition"}
              >
                <Mic className="w-6 h-6" />
              </Button>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                {isListening ? "LISTENING..." : "VOICE CONTROL"}
              </p>
            </div>

            {/* Tabs already use proper roles via shadcn/ui; add aria-describedby for clarity */}
            <Tabs defaultValue="traditional" className="w-full" aria-describedby="registration-method-desc">
              <TabsList className="grid w-full grid-cols-2 bg-surface-elevated border border-strong" role="tablist">
                <TabsTrigger
                  value="traditional"
                  className="data-[state=active]:bg-neon-orange data-[state=active]:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
                  disabled={isProcessing}
                  aria-controls="tab-traditional"
                >
                  WALLET FORM
                </TabsTrigger>
                <TabsTrigger
                  value="voice"
                  className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono"
                  disabled={isProcessing}
                  aria-controls="tab-voice"
                >
                  VOICE WALLET
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
                      Wallet Owner Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-orange" aria-hidden="true" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter wallet owner name"
                        className="pl-10 bg-surface border-border text-primary focus:border-neon-orange focus-visible:ring-neon-orange"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onFocus={() => handleFieldFocus("name", "Full Name")}
                        required
                        disabled={isProcessing}
                        autoComplete="name"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-primary font-mono">
                      Wallet Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-cyan" aria-hidden="true" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter wallet email"
                        className="pl-10 bg-surface border-border text-primary focus:border-neon-cyan focus-visible:ring-neon-cyan"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => handleFieldFocus("email", "Email Address")}
                        required
                        disabled={isProcessing}
                        autoComplete="email"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-primary font-mono">
                      Wallet Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-orange" aria-hidden="true" />
                      <Input
                        id="password"
                        name="new-password"
                        type="password"
                        placeholder="Create secure wallet password"
                        className="pl-10 bg-surface border-border text-primary focus:border-neon-orange focus-visible:ring-neon-orange"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onFocus={() => handleFieldFocus("password", "Password")}
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
                      Confirm Wallet Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-cyan" aria-hidden="true" />
                      <Input
                        id="confirmPassword"
                        name="confirm-password"
                        type="password"
                        placeholder="Confirm wallet password"
                        className="pl-10 bg-surface border-border text-primary focus:border-neon-cyan focus-visible:ring-neon-cyan"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        onFocus={() => handleFieldFocus("confirmPassword", "Confirm Password")}
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
                    aria-label="Create wallet account using standard method"
                  >
                    {isProcessing ? "CREATING WALLET..." : "CREATE WALLET"}
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
                      Voice Wallet Creation
                    </Label>
                    <p id="voice-instructions" className="text-sm text-muted-foreground">
                      Say your full name and email address for wallet creation.
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
                      aria-label={isRecording ? `Recording wallet voice, ${countdown} seconds remaining` : voiceBlob ? "Record again" : "Record voice for wallet"}
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
                          RECORDING WALLET VOICE... {countdown}s
                          <SrOnly>Recording will end automatically.</SrOnly>
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5 mr-2" aria-hidden="true" />
                          {voiceBlob ? "RECORD AGAIN" : "RECORD WALLET VOICE"}
                        </>
                      )}
                    </Button>

                    {voiceBlob && (
                      <p className="text-sm text-neon-green mt-3 text-glow" role="status" aria-live="polite">
                        Wallet voice captured successfully.
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-3">
                      Speak clearly for 5 seconds to capture your wallet voice pattern.
                    </p>
                  </div>

                  <Button
                    ref={submitVoiceButtonRef}
                    type="submit"
                    className="w-full btn-neon-cyan focus-visible:ring-accessible font-mono"
                    disabled={isProcessing}
                    aria-label="Create wallet with voice"
                  >
                    {isProcessing ? "CREATING WALLET..." : "CREATE VOICE WALLET"}
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
                  aria-label="Go to wallet login page"
                >
                  Access Wallet
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
