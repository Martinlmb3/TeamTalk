"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"

function AuthCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const fetchProfile = useAuthStore((state) => state.fetchProfile)

  useEffect(() => {
    const success = searchParams.get("success")
    const requiresRole = searchParams.get("requiresRole")

    // OAuth callback - backend has already set HTTP-only cookies
    if (success === "true") {
      // Fetch user profile to update auth state
      fetchProfile().then(() => {
        // Check if user needs to select a role
        if (requiresRole === "true") {
          // Redirect to role selection page
          router.push("/select-role")
        } else {
          // Redirect to dashboard
          router.push("/dashboard")
        }
      }).catch(() => {
        // If profile fetch fails, redirect to login with error
        router.push("/login?error=auth_failed")
      })
    } else {
      // If no success flag, redirect to login with error
      router.push("/login?error=auth_failed")
    }
  }, [searchParams, router, fetchProfile])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallback />
    </Suspense>
  )
}
