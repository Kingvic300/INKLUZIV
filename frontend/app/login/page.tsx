"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Mail, Lock, ArrowLeft, Terminal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  const handleVoiceRecord = () => {
    if (!isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream)
          const chunks: BlobPart[] = []

          mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/wav" })
            setVoiceBlob(blob)
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
    toast({
      title: "Login Successful",
      description: "Welcome back!",
    })
    router.push("/dashboard")
  }

  const handleVoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!voiceBlob) {
      toast({
        title: "Voice Sample Required",
        description: "Please record your voice first",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Voice Authentication Successful",
      description: "Welcome back!",
    })
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-accessible-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-accessible-cyan hover:text-accessible-accent transition-colors focus-visible:ring-accessible"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>

        <Card className="bg-accessible-fg border-accessible card-glow">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Terminal className="w-6 h-6 text-accessible-cyan" />
              <span className="text-accessible-accent text-sm">User Authentication</span>
            </div>
            <CardTitle className="text-2xl text-accessible-primary">Welcome Back</CardTitle>
            <CardDescription className="text-accessible-secondary">Choose your authentication method</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="traditional" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-accessible-bg border border-accessible">
                <TabsTrigger
                  value="traditional"
                  className="data-[state=active]:bg-accessible-accent data-[state=active]:text-accessible-bg focus-visible:ring-accessible"
                >
                  Email & Password
                </TabsTrigger>
                <TabsTrigger
                  value="voice"
                  className="data-[state=active]:bg-accessible-cyan data-[state=active]:text-accessible-bg focus-visible:ring-accessible"
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
                        className="pl-10 bg-accessible-bg border-accessible text-accessible-primary focus:border-accessible-cyan focus-visible:ring-accessible"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
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
                        className="pl-10 bg-accessible-bg border-accessible text-accessible-primary focus:border-accessible-accent focus-visible:ring-accessible"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-accessible-cyan hover:text-accessible-accent focus-visible:ring-accessible"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accessible-accent hover:bg-accessible-accent text-accessible-bg btn-glow focus-visible:ring-accessible"
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
                          Voice captured, processing authentication...
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
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
