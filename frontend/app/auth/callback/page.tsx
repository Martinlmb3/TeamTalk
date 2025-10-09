"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get("token")
    const refreshToken = searchParams.get("refreshToken")

    if (token && refreshToken) {
      // Store tokens in localStorage
      localStorage.setItem("accessToken", token)
      localStorage.setItem("refreshToken", refreshToken)

      // Redirect to dashboard
      router.push("/dashboard")
    } else {
      // If no tokens, redirect to login with error
      router.push("/login?error=auth_failed")
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
