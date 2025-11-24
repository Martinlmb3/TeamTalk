"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/features', '/pricing', '/support', '/login', '/signup']

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => {
    if (route === '/') return pathname === '/'
    return pathname === route || pathname.startsWith(`${route}/`)
  })

  useEffect(() => {
    // If not loading and not authenticated and trying to access protected route
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, isLoading, isPublicRoute, pathname, router])

  // Show loading state while checking authentication
  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and trying to access protected route, show nothing (will redirect)
  if (!isAuthenticated && !isPublicRoute && !isLoading) {
    return null
  }

  // Otherwise, render children
  return <>{children}</>
}
