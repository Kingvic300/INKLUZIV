import type React from "react"
import type { Metadata } from "next"
import { Fira_Code } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fira-code",
})

export const metadata: Metadata = {
  title: "INKLUZIV",
  description: "Next-generation software development kit for accessible financial applications",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={firaCode.variable}>
      <body className={firaCode.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
