"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
}

interface LoginCredentials {
  email: string
  password: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Get token from localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

// Set token in localStorage
const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('token')
}

// Fetch current user from API
async function fetchUser(): Promise<User | null> {
  const token = getToken()
  if (!token) return null

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      removeToken()
      return null
    }

    return response.json()
  } catch (error) {
    console.error('Failed to fetch user:', error)
    removeToken()
    return null
  }
}

// Login function
async function loginUser(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed')
  }

  return response.json()
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
    enabled: !!getToken(), // Only run if token exists
    retry: false,
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setToken(data.token)
      queryClient.setQueryData(['user'], data.user)
      router.push('/dashboard')
    },
  })

  // Logout function
  const logout = () => {
    removeToken()
    queryClient.setQueryData(['user'], null)
    queryClient.clear()
    router.push('/login')
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    logout,
    token: getToken(),
  }
}
