"use client"

import { useState, useEffect, useCallback } from "react"

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        const recognitionInstance = new SpeechRecognition()

        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = "en-US"
        recognitionInstance.maxAlternatives = 1

        recognitionInstance.onstart = () => {
          setIsListening(true)
          setError(null)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          if (event.results.length > 0) {
            const transcript = event.results[0][0].transcript
            setTranscript(transcript)
            setError(null)
          }
        }

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          setIsListening(false)
          setError(`Speech recognition error: ${event.error}`)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition && !isListening && isSupported) {
      try {
        setTranscript("")
        setError(null)
        recognition.start()
      } catch (error) {
        setError("Failed to start speech recognition")
        setIsListening(false)
      }
    }
  }, [recognition, isListening, isSupported])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop()
      } catch (error) {
        setIsListening(false)
      }
    }
  }, [recognition, isListening])

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    error,
  }
}

export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true)
    }
  }, [])

  const speak = useCallback(
    (text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
      if (!isSupported) return

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = options?.rate || 1
      utterance.pitch = options?.pitch || 1
      utterance.volume = options?.volume || 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    },
    [isSupported],
  )

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  return {
    isSupported,
    isSpeaking,
    speak,
    cancel,
  }
}
