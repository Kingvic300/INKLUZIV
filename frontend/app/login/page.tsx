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
import { Mic, MicOff, Mail, Lock, ArrowLeft, Terminal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech"

// Mock API client to simulate backend responses
const mockApiClient = {
    login: async (credentials: { email: string; password: string }) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Pre-stored user credentials
        const validCredentials = [
            { email: "kanyinsola@gmail.com", password: "wallet123" },
            { email: "demo@inkluziv.com", password: "demo123" },
            { email: "test@example.com", password: "password" }
        ]

        const isValid = validCredentials.some(
            cred => cred.email === credentials.email && cred.password === credentials.password
        )

        if (isValid) {
            // Simulate successful response
            const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substring(2)}`
            localStorage.setItem("auth_token", mockToken)
            localStorage.setItem("user_email", credentials.email)
            return {
                success: true,
                token: mockToken,
                user: {
                    id: "user_" + Math.random().toString(36).substring(2),
                    email: credentials.email,
                    name: credentials.email.split('@')[0]
                }
            }
        } else {
            throw new Error("Invalid email or password. Please check your credentials.")
        }
    },

    voiceLogin: async (voiceFile: File, email: string) => {
        // Simulate voice processing delay
        await new Promise(resolve => setTimeout(resolve, 2500))

        // For demo, always succeed if email is provided
        if (email && voiceFile.size > 0) {
            const mockToken = `voice_token_${Date.now()}_${Math.random().toString(36).substring(2)}`
            localStorage.setItem("auth_token", mockToken)
            localStorage.setItem("user_email", email)
            localStorage.setItem("login_method", "voice")
            return {
                success: true,
                token: mockToken,
                user: {
                    id: "voice_user_" + Math.random().toString(36).substring(2),
                    email: email,
                    name: email.split('@')[0],
                    voiceAuth: true
                }
            }
        } else {
            throw new Error("Voice authentication failed. Please try again with a clear voice sample.")
        }
    }
}

export default function SimulatedLoginPage() {
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
    const [countdown, setCountdown] = useState(3)
    const [formData, setFormData] = useState({
        email: "kanyinsola@gmail.com", // Pre-filled with stored user
        password: "wallet123", // Pre-filled with stored user password
    })
    const [currentField, setCurrentField] = useState<string>("")
    const [currentSubtitle, setCurrentSubtitle] = useState("")
    const [voiceEnabled, setVoiceEnabled] = useState(true)

    const { toast } = useToast()
    const router = useRouter()
    const { isListening, transcript, isSupported: speechSupported, startListening, stopListening } = useSpeechRecognition()
    const { speak, isSupported: ttsSupported } = useSpeechSynthesis()

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (voiceEnabled && ttsSupported) {
            const timer = setTimeout(() => {
                const welcomeMessage = "Welcome to INKLUZIV wallet authentication. Your credentials are ready. Choose email login or try voice authentication for your USDT wallet."
                speak(welcomeMessage)
                setCurrentSubtitle(welcomeMessage)
                setTimeout(() => setCurrentSubtitle(""), 10000)
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

        if (currentField === "email") {
            // Convert spoken email to text format
            let emailInput = cleanInput
                .replace(/\s+at\s+/gi, "@")
                .replace(/\s+dot\s+/gi, ".")
                .replace(/\s+/g, "")
                .toLowerCase()

            setFormData(prev => ({ ...prev, email: emailInput }))

            if (voiceEnabled && ttsSupported) {
                speak(`Email entered: ${emailInput}. Now please say your password.`)
                setCurrentSubtitle(`Email entered: ${emailInput}`)
                setTimeout(() => setCurrentSubtitle(""), 3000)
            }
            setCurrentField("password")
        } else if (currentField === "password") {
            setFormData(prev => ({ ...prev, password: cleanInput }))

            if (voiceEnabled && ttsSupported) {
                speak("Password entered. Say 'login' to proceed or 'clear' to start over.")
                setCurrentSubtitle("Password entered. Say 'login' to proceed.")
                setTimeout(() => setCurrentSubtitle(""), 3000)
            }
            setCurrentField("")
        }

        if (cleanInput.includes("login") && formData.email && formData.password) {
            handleTraditionalSubmit(new Event("submit") as any)
        } else if (cleanInput.includes("clear")) {
            setFormData({ email: "", password: "" })
            setCurrentField("")
            if (voiceEnabled && ttsSupported) {
                speak("Form cleared. Say 'email' to start over.")
            }
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

    const handleVoiceRecord = async () => {
        setVoiceBlob(null)
        audioChunksRef.current = []

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            setIsRecording(true)
            toast({
                title: "Listening...",
                description: "Please state your passphrase for voice authentication.",
                className: "card-futuristic border-neon-purple text-primary"
            })

            mediaRecorderRef.current = new MediaRecorder(stream)
            mediaRecorderRef.current.ondataavailable = (event) => event.data.size > 0 && audioChunksRef.current.push(event.data)

            mediaRecorderRef.current.onstop = () => {
                const recordedBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
                setVoiceBlob(recordedBlob)
                setIsRecording(false)
                stream.getTracks().forEach((track) => track.stop())
                if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
                setCountdown(3)
                // Automatically trigger the submission flow
                handleVoiceSubmit(recordedBlob)
            }

            mediaRecorderRef.current.start()
            setCountdown(3)
            countdownIntervalRef.current = setInterval(() => setCountdown(prev => prev - 1), 1000)

            setTimeout(() => mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(), 3000)

        } catch (err) {
            toast({
                title: "Microphone Access Required",
                description: "Please allow microphone access for voice login.",
                variant: "destructive"
            })
            setIsRecording(false)
        }
    }

    const handleTraditionalSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        try {
            const response = await mockApiClient.login({
                email: formData.email,
                password: formData.password
            })

            if (voiceEnabled && ttsSupported) {
                speak("Login successful! Redirecting to your USDT wallet.")
                setCurrentSubtitle("Login successful! Redirecting to wallet.")
                setTimeout(() => setCurrentSubtitle(""), 3000)
            }

            toast({
                title: "Login Successful",
                description: "Welcome back! Redirecting to your USDT wallet...",
                className: "card-futuristic border-neon-green text-primary"
            })

            setTimeout(() => router.push("/banking"), 1500)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Login failed"

            if (voiceEnabled && ttsSupported) {
                speak(`Login failed: ${errorMessage}`)
                setCurrentSubtitle(`Login failed: ${errorMessage}`)
                setTimeout(() => setCurrentSubtitle(""), 4000)
            }

            toast({
                title: "Login Failed",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleVoiceSubmit = async (blob: Blob) => {
        if (!blob) {
            toast({ title: "Voice Sample Required", description: "Please record your voice first.", variant: "destructive" })
            return
        }

        setIsProcessing(true)

        try {
            // Convert blob to file
            const file = new File([blob], "voice-sample.webm", { type: "audio/webm" })

            toast({
                title: "Voice Captured",
                description: "Processing encrypted voiceprint...",
                className: "card-futuristic border-neon-purple text-primary"
            })

            // Use the pre-filled email or default
            const email = formData.email || "kanyinsola@gmail.com"

            const response = await mockApiClient.voiceLogin(file, email)

            if (voiceEnabled && ttsSupported) {
                speak("Voice authentication successful! Redirecting to your USDT wallet.")
                setCurrentSubtitle("Voice authentication successful!")
                setTimeout(() => setCurrentSubtitle(""), 3000)
            }

            toast({
                title: "Authentication Successful!",
                description: "Welcome back! Redirecting to your wallet...",
                className: "card-futuristic border-neon-green text-primary"
            })

            setTimeout(() => {
                router.push("/banking")
            }, 2000)

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Voice authentication failed"

            if (voiceEnabled && ttsSupported) {
                speak(`Voice authentication failed: ${errorMessage}`)
                setCurrentSubtitle(`Authentication failed: ${errorMessage}`)
                setTimeout(() => setCurrentSubtitle(""), 4000)
            }

            toast({
                title: "Voice Authentication Failed",
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
            setCurrentSubtitle("Voice recognition active... Say 'email' or 'password' to fill fields")
            startListening()
        }
    }

    return (
        <div className="min-h-screen bg-surface scan-lines flex items-center justify-center p-4">
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
                    <Link href="/" className="inline-flex items-center text-neon-cyan hover:text-primary transition-colors focus-visible:ring-accessible font-mono">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span>BACK</span>
                    </Link>
                </div>

                <Card className="card-futuristic border-holographic">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Terminal className="w-6 h-6 text-neon-cyan" />
                            <span className="text-neon-cyan text-sm font-mono tracking-widest">WALLET AUTHENTICATION</span>
                        </div>
                        <CardTitle className="text-2xl text-primary font-mono">Access Your USDT Wallet</CardTitle>
                        <CardDescription className="text-muted-foreground">Choose your authentication method for blockchain access</CardDescription>
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

                        <Tabs defaultValue="traditional" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-surface-elevated border border-strong">
                                <TabsTrigger value="traditional" className="data-[state=active]:bg-neon-orange data-[state=active]:text-black transition-smooth font-mono" disabled={isProcessing}>WALLET LOGIN</TabsTrigger>
                                <TabsTrigger value="voice" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black transition-smooth font-mono" disabled={isProcessing}>VOICE WALLET</TabsTrigger>
                            </TabsList>

                            <TabsContent value="traditional" className="space-y-4 mt-6">
                                <form onSubmit={handleTraditionalSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-primary font-mono">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-cyan" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your wallet email"
                                                className="pl-10 bg-surface border-border text-primary focus:border-neon-cyan focus-visible:ring-neon-cyan"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                onFocus={() => handleFieldFocus("email", "Email")}
                                                required
                                                disabled={isProcessing}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-primary font-mono">Wallet Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-orange" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Enter your wallet password"
                                                className="pl-10 bg-surface border-border text-primary focus:border-neon-orange focus-visible:ring-neon-orange"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                onFocus={() => handleFieldFocus("password", "Password")}
                                                required
                                                disabled={isProcessing}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <Link href="/forgot-password" className={`text-sm focus-visible:ring-accessible ${isProcessing ? 'text-muted pointer-events-none' : 'text-neon-cyan hover:text-primary'}`}>Forgot wallet password?</Link>
                                    </div>
                                    <Button type="submit" className="w-full btn-neon-orange font-mono" disabled={isProcessing}>
                                        {isProcessing ? "ACCESSING WALLET..." : "ACCESS WALLET"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="voice" className="space-y-4 mt-6 text-center">
                                <Label className="text-primary font-mono">Voice Wallet Access</Label>
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
                                        {isProcessing ? "Processing voice authentication..." : isRecording ? `Listening... ${countdown}s` : "Tap to Speak"}
                                    </p>
                                    {!formData.email && (
                                        <div className="mt-4">
                                            <Label htmlFor="voice-email" className="text-primary font-mono text-sm">Email for Voice Login</Label>
                                            <Input
                                                id="voice-email"
                                                type="email"
                                                placeholder="Enter email for voice authentication"
                                                className="mt-2 bg-surface border-border text-primary focus:border-neon-cyan"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                disabled={isProcessing}
                                            />
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link href="/register" className={`font-medium focus-visible:ring-accessible transition-smooth ${isProcessing ? 'text-muted pointer-events-none' : 'text-neon-orange hover:text-primary'}`}>Create Wallet</Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}