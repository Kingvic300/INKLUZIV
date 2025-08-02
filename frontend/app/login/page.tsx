"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Mail, Lock, ArrowLeft, Terminal, Volume2, VolumeX, Play, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isVoiceCommandListening, setIsVoiceCommandListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const { toast } = useToast()
  const router = useRouter()
  const speechSynthesis = useRef<SpeechSynthesis | null>(null)
  const recognition = useRef<SpeechRecognition | null>(null)
  const voiceCommandRecognition = useRef<SpeechRecognition | null>(null)
  const [currentField, setCurrentField] = useState<'email' | 'password' | null>(null)

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis
    }

    // Initialize speech recognition for form inputs
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognition.current = new SpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = 'en-US'

      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript
        if (currentField === 'email') {
          setFormData(prev => ({ ...prev, email: transcript }))
          speak(`Email entered: ${transcript}`)
        } else if (currentField === 'password') {
          setFormData(prev => ({ ...prev, password: transcript }))
          speak("Password entered")
        }
        setIsListening(false)
        setCurrentField(null)
      }

      recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setCurrentField(null)
        speak("Sorry, I couldn't understand that. Please try again.")
      }

      recognition.current.onend = () => {
        setIsListening(false)
        setCurrentField(null)
      }

      // Initialize voice command recognition
      voiceCommandRecognition.current = new SpeechRecognition()
      voiceCommandRecognition.current.continuous = true
      voiceCommandRecognition.current.interimResults = false
      voiceCommandRecognition.current.lang = 'en-US'

      voiceCommandRecognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim()
        console.log('Voice command:', transcript)
        handleVoiceCommand(transcript)
      }

      voiceCommandRecognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Voice command recognition error:', event.error)
      }

      voiceCommandRecognition.current.onend = () => {
        if (isVoiceCommandListening) {
          voiceCommandRecognition.current?.start()
        }
      }
    }

    // Read welcome message on page load and start voice commands
    setTimeout(() => {
      speak("Welcome to the login page. You can use email and password, or voice authentication. Say 'login' to proceed to banking, or press Tab to navigate.")
      startVoiceCommands()
    }, 1000)

    return () => {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel()
      }
      if (recognition.current) {
        recognition.current.abort()
      }
      if (voiceCommandRecognition.current) {
        voiceCommandRecognition.current.abort()
      }
    }
  }, [])

  const speak = (text: string) => {
    if (!speechEnabled || !speechSynthesis.current) return
    
    speechSynthesis.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    
    speechSynthesis.current.speak(utterance)
  }

  const handleVoiceCommand = (command: string) => {
    console.log('Processing command:', command)
    
    if (command.includes('login') || command.includes('sign in') || command.includes('banking')) {
      speak("Logging you in and navigating to banking")
      router.push('/banking')
    } else if (command.includes('help') || command.includes('commands')) {
      speak("Available voice commands: Say 'login' to go to banking, 'read page' to hear content, or use the form normally.")
    } else if (command.includes('read page') || command.includes('read content')) {
      readPageContent()
    } else if (command.includes('stop') || command.includes('quiet')) {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel()
      }
    }
  }

  const startVoiceCommands = () => {
    if (voiceCommandRecognition.current && !isVoiceCommandListening) {
      setIsVoiceCommandListening(true)
      voiceCommandRecognition.current.start()
    }
  }

  const stopVoiceCommands = () => {
    if (voiceCommandRecognition.current) {
      voiceCommandRecognition.current.stop()
      setIsVoiceCommandListening(false)
    }
  }

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled)
    if (speechSynthesis.current && isSpeaking) {
      speechSynthesis.current.cancel()
    }
    speak(speechEnabled ? "Speech disabled" : "Speech enabled")
  }

  const startVoiceInput = (field: 'email' | 'password') => {
    if (!recognition.current) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input",
        variant: "destructive",
      })
      return
    }

    setCurrentField(field)
    setIsListening(true)
    speak(`Please speak your ${field}`)
    recognition.current.start()
  }

  const stopVoiceInput = () => {
    if (recognition.current) {
      recognition.current.stop()
    }
    setIsListening(false)
    setCurrentField(null)
  }

  const handleVoiceRecord = () => {
    if (!isRecording) {
      speak("Starting voice authentication. Please speak clearly.")
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream)
          const chunks: BlobPart[] = []

          mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/wav" })
            setVoiceBlob(blob)
            speak("Voice captured successfully. You can now authenticate.")
            toast({
              title: "Voice Captured",
              description: "Processing voice authentication...",
            })
          }

          mediaRecorder.start()
          setIsRecording(true)

          setTimeout(() => {
            mediaRecorder.stop()
            stream.getTracks().forEach((track) => track.stop())
            setIsRecording(false)
          }, 3000)
        })
        .catch((err) => {
          speak("Microphone access is required for voice login")
          toast({
            title: "Microphone Access Required",
            description: "Please allow microphone access for voice login",
            variant: "destructive",
          })
        })
    }
  }

  const handleTraditionalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    speak("Login successful. Welcome to banking!")
    toast({
      title: "Login Successful",
      description: "Welcome back!",
    })
    setTimeout(() => router.push("/banking"), 1500)
  }

  const handleVoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!voiceBlob) {
      speak("Please record your voice first")
      toast({
        title: "Voice Sample Required",
        description: "Please record your voice first",
        variant: "destructive",
      })
      return
    }

    speak("Voice authentication successful. Welcome to banking!")
    toast({
      title: "Voice Authentication Successful",
      description: "Welcome back!",
    })
    setTimeout(() => router.push("/banking"), 1500)
  }

  const readPageContent = () => {
    const content = `
      Login page. You can choose between email and password authentication, or voice authentication.
      For email login, enter your email address and password.
      For voice login, record a 3-second voice sample for authentication.
      Use the voice input buttons to speak your email or password instead of typing.
      Say 'login' at any time to go directly to banking.
    `
    speak(content)
  }

  return (
    <div className="min-h-screen bg-accessible-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Accessibility Controls */}
        <div className="mb-4 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center text-accessible-cyan hover:text-accessible-accent transition-colors focus-visible:ring-accessible"
            onFocus={() => speak("Back to home link")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex space-x-2">
            <Button
              onClick={readPageContent}
              size="sm"
              variant="outline"
              className="border-accessible-cyan text-accessible-cyan hover:bg-accessible-cyan hover:text-accessible-bg focus-visible:ring-accessible"
              aria-label="Read page content aloud"
            >
              <Play className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={toggleSpeech}
              size="sm"
              variant="outline"
              className={`border-accessible-accent focus-visible:ring-accessible ${
                speechEnabled 
                  ? "text-accessible-accent hover:bg-accessible-accent hover:text-accessible-bg" 
                  : "text-accessible-secondary"
              }`}
              aria-label={speechEnabled ? "Disable speech" : "Enable speech"}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>

            {isVoiceCommandListening && (
              <div className="text-xs text-accessible-cyan font-mono bg-accessible-cyan/10 px-2 py-1 rounded">
                🎤 SAY "LOGIN"
              </div>
            )}
          </div>
        </div>

        <Card className="bg-accessible-fg border-accessible card-glow">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Terminal className="w-6 h-6 text-accessible-cyan" />
              <span className="text-accessible-accent text-sm">User Authentication</span>
            </div>
            <CardTitle className="text-2xl text-accessible-primary">Welcome Back</CardTitle>
            <CardDescription className="text-accessible-secondary">
              Choose your authentication method or say "login" to proceed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="traditional" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-accessible-bg border border-accessible">
                <TabsTrigger
                  value="traditional"
                  className="data-[state=active]:bg-accessible-accent data-[state=active]:text-accessible-bg focus-visible:ring-accessible"
                  onFocus={() => speak("Email and password tab")}
                >
                  Email & Password
                </TabsTrigger>
                <TabsTrigger
                  value="voice"
                  className="data-[state=active]:bg-accessible-cyan data-[state=active]:text-accessible-bg focus-visible:ring-accessible"
                  onFocus={() => speak("Voice login tab")}
                >
                  Voice Login
                </TabsTrigger>
              </TabsList>

              <TabsContent value="traditional" className="space-y-4 mt-6">
                <form onSubmit={handleTraditionalSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-accessible-primary">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-accessible-cyan" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 pr-12 bg-accessible-bg border-accessible text-accessible-primary focus:border-accessible-cyan focus-visible:ring-accessible"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => speak("Email address field")}
                        required
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0 bg-accessible-cyan hover:bg-accessible-accent focus-visible:ring-accessible"
                        onClick={() => startVoiceInput('email')}
                        disabled={isListening && currentField !== 'email'}
                        aria-label="Voice input for email"
                      >
                        <Mic className="w-3 h-3" />
                      </Button>
                    </div>
                    {isListening && currentField === 'email' && (
                      <p className="text-sm text-accessible-cyan">Listening for email...</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-accessible-primary">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-accessible-accent" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 pr-12 bg-accessible-bg border-accessible text-accessible-primary focus:border-accessible-accent focus-visible:ring-accessible"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onFocus={() => speak("Password field")}
                        required
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0 bg-accessible-accent hover:bg-accessible-cyan focus-visible:ring-accessible"
                        onClick={() => startVoiceInput('password')}
                        disabled={isListening && currentField !== 'password'}
                        aria-label="Voice input for password"
                      >
                        <Mic className="w-3 h-3" />
                      </Button>
                    </div>
                    {isListening && currentField === 'password' && (
                      <p className="text-sm text-accessible-accent">Listening for password...</p>
                    )}
                  </div>

                  {isListening && (
                    <Button
                      type="button"
                      onClick={stopVoiceInput}
                      className="w-full bg-accessible-error hover:bg-accessible-error text-white focus-visible:ring-accessible"
                    >
                      <MicOff className="w-4 h-4 mr-2" />
                      Stop Listening
                    </Button>
                  )}

                  <div className="flex items-center justify-between">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-accessible-cyan hover:text-accessible-accent focus-visible:ring-accessible"
                      onFocus={() => speak("Forgot password link")}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accessible-accent hover:bg-accessible-accent text-accessible-bg btn-glow focus-visible:ring-accessible"
                    onFocus={() => speak("Sign in button - will take you to banking")}
                  >
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="voice" className="space-y-4 mt-6">
                <form onSubmit={handleVoiceSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-accessible-primary">Voice Authentication</Label>
                    <div className="text-center p-10 border-2 border-dashed border-accessible rounded-lg bg-accessible-bg/50">
                      <Button
                        type="button"
                        onClick={handleVoiceRecord}
                        disabled={isRecording}
                        size="lg"
                        className={`w-full text-xl py-6 focus-visible:ring-accessible ${
                          isRecording
                            ? "bg-accessible-error hover:bg-accessible-error pulse-glow"
                            : voiceBlob
                              ? "bg-accessible-cyan hover:bg-accessible-cyan text-accessible-bg btn-glow"
                              : "bg-accessible-accent hover:bg-accessible-accent text-accessible-bg btn-glow"
                        }`}
                        onFocus={() => speak(isRecording ? "Currently recording" : voiceBlob ? "Voice recorded, tap to record again" : "Tap to speak for voice authentication")}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="w-6 h-6 mr-3" />
                            Listening... 3 seconds
                          </>
                        ) : (
                          <>
                            <Mic className="w-6 h-6 mr-3" />
                            {voiceBlob ? "Record Again" : "Tap to Speak"}
                          </>
                        )}
                      </Button>
                      {voiceBlob && (
                        <p className="text-sm text-accessible-cyan mt-4">
                          Voice captured, ready for authentication
                        </p>
                      )}
                      <p className="text-xs text-accessible-secondary mt-4">
                        Speak clearly for 3 seconds to authenticate
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accessible-cyan hover:bg-accessible-cyan text-accessible-bg btn-glow focus-visible:ring-accessible"
                    onFocus={() => speak("Authenticate with voice button - will take you to banking")}
                  >
                    Authenticate with Voice
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-accessible-secondary">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-accessible-accent hover:text-accessible-accent font-medium focus-visible:ring-accessible"
                  onFocus={() => speak("Sign up link")}
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Screen reader instructions */}
        <div className="sr-only" aria-live="polite">
          {isSpeaking && "Page is being read aloud"}
          {isListening && `Listening for ${currentField} input`}
          {isRecording && "Recording voice for authentication"}
          {isVoiceCommandListening && "Voice commands active - say 'login' to proceed"}
        </div>
      </div>
    </div>
  )
}