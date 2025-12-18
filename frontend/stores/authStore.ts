import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi, type UserProfile } from '@/lib/api/auth'
import type { LoginFormData } from '@/schemas/auth.schema'

interface AuthState {
  // State
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (credentials: LoginFormData) => Promise<void>
  logout: () => void
  fetchProfile: () => Promise<void>
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Set user and update authentication status
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        })
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      // Set error
      setError: (error) => {
        set({ error })
      },

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null })

        try {
          const response = await authApi.login(credentials)

          // Store tokens
          localStorage.setItem('accessToken', response.accessToken)
          localStorage.setItem('refreshToken', response.refreshToken)

          // Fetch full profile
          await get().fetchProfile()

          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed'
          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            isAuthenticated: false,
          })
          throw error
        }
      },

      // Fetch user profile
      fetchProfile: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false })
          return
        }

        set({ isLoading: true })

        try {
          const user = await authApi.getProfile()
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          console.error('Failed to fetch profile:', error)

          // Clear invalid tokens
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
          }

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired',
          })
        }
      },

      // Logout action
      logout: () => {
        authApi.logout()
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      // Clear all auth state
      clearAuth: () => {
        authApi.logout()
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user and isAuthenticated, not loading/error states
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Initialize auth state on app load
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('accessToken')
  if (token) {
    // Fetch profile to validate token
    useAuthStore.getState().fetchProfile()
  }
}
