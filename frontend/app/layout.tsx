import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { DynamicFavicon } from "@/components/dynamic-favicon"
import { QueryProvider } from "@/providers/QueryProvider"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "TeamTalk - Sports Team Communication Platform",
  description: "A comprehensive sports team communication and management platform that connects athletes, coaches, and team administrators in one unified space.",
  icons: {
    icon: "/TeamTalk - logo - lightMode.svg",
    shortcut: "/TeamTalk - logo - lightMode.svg",
    apple: "/TeamTalk - logo - lightMode.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <DynamicFavicon />
            <Header />
            <ProtectedRoute>
              <main className="flex-1">{children}</main>
            </ProtectedRoute>
            <Footer />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
