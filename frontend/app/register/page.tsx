"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, User, Mail, Lock, ArrowLeft, Terminal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const { toast } = useToast()

  const handleVoiceRecord = () => {
    if (!isRecording) {
      // Start recording
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
              title: "Voice Sample Captured",
              description: "Your voice pattern has been successfully recorded",
            })
          }

          mediaRecorder.start()
          setIsRecording(true)

          // Stop after 5 seconds
          setTimeout(() => {
            mediaRecorder.stop()
            stream.getTracks().forEach((track) => track.stop())
            setIsRecording(false)
          }, 5000)
        })
        .catch((err) => {
          toast({
            title: "Microphone Access Required",
            description: "Please allow microphone access to use voice registration",
            variant: "destructive",
          })
        })
    }
  }

  const handleTraditionalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Account Created Successfully",
      description: "Please check your email for verification",
    })
  }

  const handleVoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!voiceBlob) {
      toast({
        title: "Voice Sample Required",
        description: "Please record your voice sample first",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Voice Registration Started",
      description: "Processing your voice pattern...",
    })
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
            <span>Back</span>
          </Link>
        </div>

        <Card className="bg-accessible-fg border-accessible card-glow">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Terminal className="w-6 h-6 text-accessible-accent" />
              <span className="text-accessible-cyan text-sm">User Registration</span>
            </div>
            <CardTitle className="text-2xl text-accessible-primary">Create Account</CardTitle>
            <CardDescription className="text-accessible-secondary">
              Choose your preferred registration method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="traditional" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-accessible-bg border border-accessible">
                <TabsTrigger
                  value="traditional"
                  className="data-[state=active]:bg-accessible-accent data-[state=active]:text-accessible-bg focus-visible:ring-accessible"
                >
                  Standard
                </TabsTrigger>
                <TabsTrigger
                  value="voice"
                  className="data-[state=active]:bg-accessible-cyan data-[state=active]:text-accessible-bg focus-visible:ring-accessible"
                >
                  Voice Setup
                </TabsTrigger>
              </TabsList>

              <TabsContent value="traditional" className="space-y-4 mt-6">
                <form onSubmit={handleTraditionalSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-accessible-primary">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-accessible-accent" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className="pl-10 bg-accessible-bg border-accessible text-accessible-primary focus:border-accessible-accent focus-visible:ring-accessible"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

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
                        placeholder="Create a secure password"
                        className="pl-10 bg-accessible-bg border-accessible text-accessible-primary focus:border-accessible-accent focus-visible:ring-accessible"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-accessible-primary">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-accessible-cyan" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10 bg-accessible-bg border-accessible text-accessible-primary focus:border-accessible-cyan focus-visible:ring-accessible"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accessible-accent hover:bg-accessible-accent text-accessible-bg btn-glow focus-visible:ring-accessible"
                  >
                    Create Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="voice" className="space-y-4 mt-6">
                <form onSubmit={handleVoiceSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="voiceName" className="text-accessible-primary">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-accessible-accent" />
                      <Input
                        id="voiceName"
                        placeholder="Enter your full name"
                        className="pl-10 bg-accessible-bg border-accessible text-accessible-primary focus:border-accessible-accent focus-visible:ring-accessible"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voiceEmail" className="text-accessible-primary">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-accessible-cyan" />
                      <Input
                        id="voiceEmail"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-accessible-bg border-accessible text-accessible-primary focus:border-accessible-cyan focus-visible:ring-accessible"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-accessible-primary">Voice Sample</Label>
                    <div className="text-center p-8 border-2 border-dashed border-accessible rounded-lg bg-accessible-bg/50">
                      <Button
                        type="button"
                        onClick={handleVoiceRecord}
                        disabled={isRecording}
                        className={`w-full text-lg py-4 focus-visible:ring-accessible ${
                          isRecording
                            ? "bg-accessible-error hover:bg-accessible-error pulse-glow"
                            : voiceBlob
                              ? "bg-accessible-cyan hover:bg-accessible-cyan text-accessible-bg btn-glow"
                              : "bg-accessible-accent hover:bg-accessible-accent text-accessible-bg btn-glow"
                        }`}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="w-5 h-5 mr-2" />
                            Recording... 5 seconds
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5 mr-2" />
                            {voiceBlob ? "Record Again" : "Record Voice Sample"}
                          </>
                        )}
                      </Button>
                      {voiceBlob && (
                        <p className="text-sm text-accessible-cyan mt-3">Voice sample captured successfully</p>
                      )}
                      <p className="text-xs text-accessible-secondary mt-3">
                        Speak clearly for 5 seconds to capture your voice pattern
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accessible-cyan hover:bg-accessible-cyan text-accessible-bg btn-glow focus-visible:ring-accessible"
                  >
                    Register with Voice
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-accessible-secondary">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-accessible-accent hover:text-accessible-accent font-medium focus-visible:ring-accessible"
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
