"use client"

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi, type UserProfile } from '@/lib/api/auth'

// Fetch current user from API
async function fetchUser(): Promise<UserProfile | null> {
  try {
    return await authApi.getProfile()
  } catch (error) {
    console.error('Failed to fetch user:', error)
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
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Logout function
  const logout = async () => {
    await authApi.logout()
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
  }
}
