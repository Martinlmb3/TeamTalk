"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Footer() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = theme === "system" ? systemTheme : theme
  const logoSrc = currentTheme === "dark"
    ? "/TeamTalk - logo - darkMode.svg"
    : "/TeamTalk - logo - lightMode.svg"

  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              {mounted && <Image src={logoSrc} alt="TeamTalk Logo" width={32} height={32} className="w-8 h-8" />}
              <span className="text-xl font-bold text-foreground">TeamTalk</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              The ultimate platform for sports teams to communicate, collaborate, and conquer together. Join TeamTalk
              today and transform the way your team connects.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-primary text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-primary text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <p className="text-center text-muted-foreground text-sm">© {new Date().getFullYear()} TeamTalk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
