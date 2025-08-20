import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "ELICS - Makes Life Easy",
  description: "Reliable, energy-efficient, and innovative electrical solutions for your home and business.",
  keywords: ["electrical appliances", "home appliances", "energy efficient", "smart technology"],
  authors: [{ name: "VoltTech" }],
  creator: "ELICS",
  publisher: "ELICS",
  icons: {
    icon: "/ELICS LOGO PRINT-1.svg",
    shortcut: "/ELICS LOGO PRINT-1.svg",
    apple: "/ELICS LOGO PRINT-1.png",
  },
  openGraph: {
    title: "ELICS - Makes Life Easy",
    description: "Reliable, energy-efficient, and innovative electrical solutions for your home and business.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ELICS - Makes Life Easy",
    description: "Reliable, energy-efficient, and innovative electrical solutions for your home and business.",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
