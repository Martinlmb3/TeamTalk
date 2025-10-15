"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function DynamicFavicon() {
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme
    const faviconPath = currentTheme === "dark"
      ? "/TeamTalk - logo - darkMode.svg"
      : "/TeamTalk - logo - lightMode.svg"

    // Update all favicon link elements
    const links = document.querySelectorAll("link[rel*='icon']")
    links.forEach((link) => {
      link.setAttribute("href", faviconPath)
    })

    // Also update apple-touch-icon if it exists
    const appleIcon = document.querySelector("link[rel='apple-touch-icon']")
    if (appleIcon) {
      appleIcon.setAttribute("href", faviconPath)
    }
  }, [theme, systemTheme])

  return null
}
