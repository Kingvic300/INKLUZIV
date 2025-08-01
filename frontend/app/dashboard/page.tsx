"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mic, Shield, Upload, LogOut, Key, Smartphone, Terminal, Activity, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [voiceAuthEnabled, setVoiceAuthEnabled] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const { toast } = useToast()

  const handleVoiceAuthToggle = (enabled: boolean) => {
    setVoiceAuthEnabled(enabled)
    toast({
      title: enabled ? "Voice Authentication Enabled" : "Voice Authentication Disabled",
      description: enabled
        ? "You can now use voice to log in to your account"
        : "Voice authentication has been turned off",
    })
  }

  const handleLogout = () => {
    toast({
      title: "Logged Out Successfully",
      description: "You have been signed out of your account",
    })
  }

  const handleLogoutAllDevices = () => {
    toast({
      title: "Logged Out from All Devices",
      description: "You have been signed out from all active sessions",
    })
  }

  return (
    <div className="min-h-screen bg-surface scan-lines">
      {/* Header */}
      <header className="bg-surface-elevated/80 backdrop-blur-md border-b border-neon-cyan/30 shadow-neon-cyan/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-neon-orange rounded-lg flex items-center justify-center shimmer">
              <Terminal className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-gradient text-glow font-mono">INKLUZIV</h1>
            <span className="text-secondary text-sm font-mono">Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
            >
              <LogOut className="w-4 h-4 mr-2" />
              LOGOUT
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-futuristic transition-smooth">
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-neon-cyan shadow-neon-cyan">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="bg-surface text-neon-cyan text-xl font-mono">JD</AvatarFallback>
                </Avatar>
                <CardTitle className="text-primary font-mono">John Doe</CardTitle>
                <CardDescription className="text-secondary font-mono">john.doe@example.com</CardDescription>
                <div className="flex justify-center mt-3">
                  <Badge
                    variant={voiceAuthEnabled ? "default" : "secondary"}
                    className={`font-mono ${voiceAuthEnabled ? "bg-neon-green text-black shadow-neon-green" : "bg-gray-600 text-gray-400"}`}
                  >
                    {voiceAuthEnabled ? "VOICE ACTIVE" : "VOICE INACTIVE"}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <Card className="mt-4 card-futuristic transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg text-primary font-mono">QUICK ACTIONS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono"
                >
                  <User className="w-4 h-4 mr-2" />
                  EDIT PROFILE
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 transition-smooth font-mono"
                >
                  <Key className="w-4 h-4 mr-2" />
                  CHANGE PASSWORD
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  UPLOAD FILES
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-surface-elevated border border-strong">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-neon-cyan data-[state=active]:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono"
                >
                  OVERVIEW
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:bg-neon-green data-[state=active]:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 transition-smooth font-mono"
                >
                  SECURITY
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-neon-orange data-[state=active]:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
                >
                  SETTINGS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="card-futuristic transition-smooth">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-primary font-mono">ACTIVE SESSIONS</CardTitle>
                      <Smartphone className="h-4 w-4 text-neon-cyan" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-neon-cyan text-glow font-mono">3</div>
                      <p className="text-xs text-secondary font-mono">connected devices</p>
                    </CardContent>
                  </Card>

                  <Card className="card-futuristic transition-smooth">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-primary font-mono">VOICE LOGINS</CardTitle>
                      <Mic className="h-4 w-4 text-neon-green" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-neon-green text-glow font-mono">12</div>
                      <p className="text-xs text-secondary font-mono">this month</p>
                    </CardContent>
                  </Card>

                  <Card className="card-futuristic transition-smooth">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-primary font-mono">FILES UPLOADED</CardTitle>
                      <Upload className="h-4 w-4 text-neon-orange" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-neon-orange text-glow font-mono">8</div>
                      <p className="text-xs text-secondary font-mono">total files</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center font-mono">
                      <Activity className="w-5 h-5 mr-2 text-neon-purple" />
                      RECENT ACTIVITY
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-neon-cyan rounded-full pulse-glow"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-primary font-mono">
                            Voice authentication completed successfully
                          </p>
                          <p className="text-xs text-secondary font-mono">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-primary font-mono">Profile information updated</p>
                          <p className="text-xs text-secondary font-mono">1 hour ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-neon-orange rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-primary font-mono">File uploaded: document.pdf</p>
                          <p className="text-xs text-secondary font-mono">3 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center font-mono">
                      <Mic className="w-5 h-5 mr-2 text-neon-green" />
                      VOICE AUTHENTICATION
                    </CardTitle>
                    <CardDescription className="text-secondary font-mono">
                      Manage your voice authentication settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base text-primary font-mono">Enable Voice Login</div>
                        <div className="text-sm text-secondary font-mono">Allow logging in with your voice</div>
                      </div>
                      <Switch
                        checked={voiceAuthEnabled}
                        onCheckedChange={handleVoiceAuthToggle}
                        className="data-[state=checked]:bg-neon-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2"
                      />
                    </div>

                    {voiceAuthEnabled && (
                      <div className="p-4 bg-neon-green/10 rounded-lg border border-neon-green/30 backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-neon-green" />
                          <span className="text-sm font-medium text-neon-green font-mono">
                            VOICE AUTHENTICATION ACTIVE
                          </span>
                        </div>
                        <p className="text-sm text-primary mt-1 font-mono">
                          Your voice profile is securely stored and ready for authentication.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 transition-smooth font-mono"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        UPDATE VOICE SAMPLE
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2 transition-smooth font-mono"
                      >
                        <Key className="w-4 h-4 mr-2" />
                        RESET PASSWORD
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center font-mono">
                      <Terminal className="w-5 h-5 mr-2 text-neon-purple" />
                      SESSION MANAGEMENT
                    </CardTitle>
                    <CardDescription className="text-secondary font-mono">Control your active sessions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent border-neon-green text-neon-green hover:bg-neon-green hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 transition-smooth font-mono"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        LOGOUT CURRENT DEVICE
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full bg-error hover:bg-error/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 transition-smooth font-mono"
                        onClick={handleLogoutAllDevices}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        LOGOUT ALL DEVICES
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center font-mono">
                      <Zap className="w-5 h-5 mr-2 text-neon-cyan" />
                      USER PREFERENCES
                    </CardTitle>
                    <CardDescription className="text-secondary font-mono">
                      Customize your account settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base text-primary font-mono">Email Notifications</div>
                        <div className="text-sm text-secondary font-mono">Receive email updates about your account</div>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                        className="data-[state=checked]:bg-neon-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base text-primary font-mono">SMS Notifications</div>
                        <div className="text-sm text-secondary font-mono">Receive SMS alerts for security events</div>
                      </div>
                      <Switch
                        defaultChecked
                        className="data-[state=checked]:bg-neon-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange focus-visible:ring-offset-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-futuristic transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center font-mono">
                      <Terminal className="w-5 h-5 mr-2 text-neon-green" />
                      ACCOUNT ACTIONS
                    </CardTitle>
                    <CardDescription className="text-secondary font-mono">Manage your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple focus-visible:ring-offset-2 transition-smooth font-mono"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      EXPORT ACCOUNT DATA
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full bg-error hover:bg-error/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 transition-smooth font-mono"
                    >
                      DELETE ACCOUNT
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
