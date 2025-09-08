"use client"

import { useCallback, useRef } from 'react'

interface UseAccessibilityAnnouncerReturn {
  announce: (message: string, priority?: 'polite' | 'assertive') => void
}

export function useAccessibilityAnnouncer(): UseAccessibilityAnnouncerReturn {
  const politeRegionRef = useRef<HTMLDivElement | null>(null)
  const assertiveRegionRef = useRef<HTMLDivElement | null>(null)

  // Initialize live regions if they don't exist
  const initializeLiveRegions = useCallback(() => {
    if (!politeRegionRef.current) {
      const politeRegion = document.getElementById('accessibility-announcements-polite') as HTMLDivElement
      if (politeRegion) {
        politeRegionRef.current = politeRegion
      }
    }

    if (!assertiveRegionRef.current) {
      const assertiveRegion = document.getElementById('accessibility-announcements-assertive') as HTMLDivElement
      if (assertiveRegion) {
        assertiveRegionRef.current = assertiveRegion
      }
    }
  }, [])

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    initializeLiveRegions()

    const targetRef = priority === 'assertive' ? assertiveRegionRef : politeRegionRef
    
    if (targetRef.current) {
      // Clear the region first to ensure the message is announced
      targetRef.current.textContent = ''
      
      // Use a small delay to ensure screen readers pick up the change
      setTimeout(() => {
        if (targetRef.current) {
          targetRef.current.textContent = message
        }
      }, 100)

      // Clear the message after a delay to keep the region clean
      setTimeout(() => {
        if (targetRef.current) {
          targetRef.current.textContent = ''
        }
      }, 5000)
    }
  }, [initializeLiveRegions])

  return { announce }
}