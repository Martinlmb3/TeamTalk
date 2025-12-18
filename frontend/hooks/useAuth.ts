"use client"

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi, type UserProfile } from '@/lib/api/auth'

// Fetch current user from API
async function fetchUser(): Promise<UserProfile | null> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  if (!token) return null

  try {
    return await authApi.getProfile()
  } catch (error) {
    console.error('Failed to fetch user:', error)
    // Token is invalid, remove it
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
    return null
  }
}

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  // Query for current user
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'), // Only run if token exists
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Logout function
  const logout = () => {
    authApi.logout()
    queryClient.setQueryData(['user'], null)
    queryClient.clear()
    router.push('/login')
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    logout,
    token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  }
}
