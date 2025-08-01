"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, Key, Terminal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { toast } = useToast()

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Reset Code Sent",
      description: "Please check your email for the verification code",
    })
    setStep("otp")
  }

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Code Verified",
      description: "You can now reset your password",
    })
    setStep("reset")
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Password Reset Successful",
      description: "You can now log in with your new password",
    })
  }

  return (
    <div className="min-h-screen bg-accessible-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center text-accessible-cyan hover:text-accessible-accent transition-colors focus-visible:ring-accessible"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Login</span>
          </Link>
        </div>

        <Card className="bg-accessible-fg border-accessible card-glow">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Terminal className="w-6 h-6 text-accessible-accent" />
              <span className="text-accessible-cyan text-sm">Password Recovery</span>
            </div>
            <CardTitle className="text-2xl text-accessible-primary">Reset Password</CardTitle>
            <CardDescription className="text-accessible-secondary">
              {step === "email" && "Enter your email to receive a reset code"}
              {step === "otp" && "Enter the verification code sent to your email"}
              {step === "reset" && "Create your new password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "email" && (
              <form onSubmit={handleSendOTP} className="space-y-4">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-accessible-accent hover:bg-accessible-accent text-accessible-bg btn-glow focus-visible:ring-accessible"
                >
                  Send Reset Code
                </Button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-accessible-primary">
                    Verification Code
                  </Label>
                  <Input
                    id="otp"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center text-2xl tracking-widest bg-accessible-bg border-accessible text-accessible-accent focus:border-accessible-accent focus-visible:ring-accessible"
                    required
                  />
                  <p className="text-sm text-accessible-secondary text-center">Code sent to {email}</p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-accessible-cyan hover:bg-accessible-cyan text-accessible-bg btn-glow focus-visible:ring-accessible"
                >
                  Verify Code
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent border-accessible-accent text-accessible-accent hover:bg-accessible-accent hover:text-accessible-bg focus-visible:ring-accessible"
                  onClick={() => toast({ title: "Code Resent", description: "A new code has been sent to your email" })}
                >
                  Resend Code
                </Button>
              </form>
            )}

            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-accessible-primary">
                    New Password
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-accessible-accent" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      className="pl-10 bg-accessible-bg border-accessible text-accessible-primary focus:border-accessible-accent focus-visible:ring-accessible"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-accessible-primary">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-accessible-cyan" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      className="pl-10 bg-accessible-bg border-accessible text-accessible-primary focus:border-accessible-cyan focus-visible:ring-accessible"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-accessible-accent hover:bg-accessible-accent text-accessible-bg btn-glow focus-visible:ring-accessible"
                >
                  Reset Password
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
