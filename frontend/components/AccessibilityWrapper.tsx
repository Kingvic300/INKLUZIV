"use client"

import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Accessibility, 
  Settings, 
  X, 
  Volume2, 
  VolumeX, 
  Plus, 
  Minus, 
  Palette,
  Eye
} from "lucide-react"
import { usePathname } from 'next/navigation'

// Accessibility Context
interface AccessibilityContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void
  isHighContrast: boolean
  textSize: number
  liveAnnouncementsEnabled: boolean
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityWrapper')
  }
  return context
}

interface AccessibilityWrapperProps {
  children: React.ReactNode
}

export default function AccessibilityWrapper({ children }: AccessibilityWrapperProps) {
  // Accessibility states
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [liveAnnouncementsEnabled, setLiveAnnouncementsEnabled] = useState(true)
  const [textSize, setTextSize] = useState(100) // percentage
  const [isHighContrast, setIsHighContrast] = useState(false)
  
  // Live region refs
  const politeRegionRef = useRef<HTMLDivElement>(null)
  const assertiveRegionRef = useRef<HTMLDivElement>(null)
  
  // Menu refs for focus management
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const firstMenuItemRef = useRef<HTMLButtonElement>(null)
  
  const pathname = usePathname()

  // Announce route changes
  useEffect(() => {
    if (liveAnnouncementsEnabled) {
      const routeNames: Record<string, string> = {
        '/': 'Home page',
        '/login': 'Login page',
        '/register': 'Registration page',
        '/dashboard': 'Dashboard',
        '/banking': 'USDT Wallet',
        '/docs': 'Documentation',
        '/sdk': 'SDK page',
        '/forgot-password': 'Password reset page'
      }
      
      const routeName = routeNames[pathname] || 'Page'
      announce(`Navigated to ${routeName}`, 'polite')
    }
  }, [pathname, liveAnnouncementsEnabled])

  // Apply text size changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize}%`
  }, [textSize])

  // Apply high contrast mode
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isHighContrast])

  // Keyboard navigation for menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Focus first menu item when menu opens
      setTimeout(() => firstMenuItemRef.current?.focus(), 100)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  // Announce function for other components to use
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!liveAnnouncementsEnabled) return

    const targetRef = priority === 'assertive' ? assertiveRegionRef : politeRegionRef
    if (targetRef.current) {
      // Clear and then set the message to ensure it's announced
      targetRef.current.textContent = ''
      setTimeout(() => {
        if (targetRef.current) {
          targetRef.current.textContent = message
        }
      }, 100)
    }
  }

  const increaseTextSize = () => {
    const newSize = Math.min(textSize + 10, 150)
    setTextSize(newSize)
    announce(`Text size increased to ${newSize} percent`)
  }

  const decreaseTextSize = () => {
    const newSize = Math.max(textSize - 10, 80)
    setTextSize(newSize)
    announce(`Text size decreased to ${newSize} percent`)
  }

  const toggleHighContrast = () => {
    const newState = !isHighContrast
    setIsHighContrast(newState)
    announce(newState ? 'High contrast mode enabled' : 'High contrast mode disabled')
  }

  const toggleLiveAnnouncements = () => {
    const newState = !liveAnnouncementsEnabled
    setLiveAnnouncementsEnabled(newState)
    // Use a direct announcement since we're toggling the feature
    if (newState) {
      setTimeout(() => announce('Live announcements enabled'), 100)
    }
  }

  const contextValue: AccessibilityContextType = {
    announce,
    isHighContrast,
    textSize,
    liveAnnouncementsEnabled
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      <div className={`accessibility-wrapper ${isHighContrast ? 'high-contrast' : ''}`}>
        {/* Skip to main content link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-neon-cyan focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-mono focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/* Live regions for screen reader announcements */}
        <div 
          ref={politeRegionRef}
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
          id="accessibility-announcements-polite"
        />
        <div 
          ref={assertiveRegionRef}
          aria-live="assertive" 
          aria-atomic="true" 
          className="sr-only"
          id="accessibility-announcements-assertive"
        />

        {/* Accessibility Menu Button */}
        <Button
          ref={menuButtonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full btn-neon-green shadow-lg transition-smooth"
          aria-label="Open accessibility menu"
          aria-expanded={isMenuOpen}
          aria-controls="accessibility-menu"
        >
          <Accessibility className="w-6 h-6" />
        </Button>

        {/* Accessibility Menu */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Menu Panel */}
            <Card 
              ref={menuRef}
              id="accessibility-menu"
              className="fixed bottom-24 left-6 z-50 w-80 card-futuristic border-neon-green shadow-neon-green"
              role="dialog"
              aria-labelledby="accessibility-menu-title"
              aria-modal="true"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle 
                    id="accessibility-menu-title" 
                    className="text-primary font-mono flex items-center"
                  >
                    <Accessibility className="w-5 h-5 mr-2 text-neon-green" />
                    ACCESSIBILITY
                  </CardTitle>
                  <Button
                    onClick={() => setIsMenuOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="text-secondary hover:text-primary"
                    aria-label="Close accessibility menu"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Live Announcements Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="live-announcements" className="text-primary font-mono flex items-center">
                      <Volume2 className="w-4 h-4 mr-2 text-neon-cyan" />
                      Live Announcements
                    </Label>
                    <Switch
                      ref={firstMenuItemRef}
                      id="live-announcements"
                      checked={liveAnnouncementsEnabled}
                      onCheckedChange={toggleLiveAnnouncements}
                      className="data-[state=checked]:bg-neon-cyan"
                      aria-describedby="live-announcements-help"
                    />
                  </div>
                  <p id="live-announcements-help" className="text-xs text-secondary font-mono">
                    Enable automatic announcements for screen readers
                  </p>
                </div>

                {/* Text Size Controls */}
                <div className="space-y-3">
                  <Label className="text-primary font-mono flex items-center">
                    <Eye className="w-4 h-4 mr-2 text-neon-orange" />
                    Text Size: {textSize}%
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={decreaseTextSize}
                      disabled={textSize <= 80}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black font-mono"
                      aria-label="Decrease text size"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 text-center">
                      <span className="text-primary font-mono text-sm">{textSize}%</span>
                    </div>
                    <Button
                      onClick={increaseTextSize}
                      disabled={textSize >= 150}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-black font-mono"
                      aria-label="Increase text size"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* High Contrast Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-contrast" className="text-primary font-mono flex items-center">
                      <Palette className="w-4 h-4 mr-2 text-neon-purple" />
                      High Contrast
                    </Label>
                    <Switch
                      id="high-contrast"
                      checked={isHighContrast}
                      onCheckedChange={toggleHighContrast}
                      className="data-[state=checked]:bg-neon-purple"
                      aria-describedby="high-contrast-help"
                    />
                  </div>
                  <p id="high-contrast-help" className="text-xs text-secondary font-mono">
                    Increase visual contrast for better readability
                  </p>
                </div>

                {/* Instructions */}
                <div className="pt-4 border-t border-strong">
                  <p className="text-xs text-secondary font-mono leading-relaxed">
                    Use Tab to navigate, Enter or Space to activate buttons, 
                    and Escape to close this menu.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Main app content */}
        <div id="main-content">
          {children}
        </div>
      </div>
    </AccessibilityContext.Provider>
  )
}