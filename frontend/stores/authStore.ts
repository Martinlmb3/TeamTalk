import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi, type UserProfile } from '@/lib/api/auth'
import type { LoginFormData } from '@/schemas/auth.schema'

interface AuthState {
  // State
  user: UserProfile | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: UserProfile | null) => void
  setAccessToken: (token: string | null) => void
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
      accessToken: null,
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

      // Set access token
      setAccessToken: (token) => {
        set({ accessToken: token })
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
          // Login and get tokens
          const response = await authApi.login(credentials)

          // Store access token
          set({ accessToken: response.accessToken })

          // Fetch full profile
          await get().fetchProfile()

          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed'
          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            accessToken: null,
            isAuthenticated: false,
          })
          throw error
        }
      },

      // Fetch user profile
      fetchProfile: async () => {
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
          accessToken: null,
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
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'auth-storage',
      // Persist user, accessToken, and isAuthenticated
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Initialize auth state on app load
if (typeof window !== 'undefined') {
  // Only fetch profile if user was previously authenticated (has data in localStorage)
  const storedState = localStorage.getItem('auth-storage')
  if (storedState) {
    try {
      const parsed = JSON.parse(storedState)
      if (parsed?.state?.isAuthenticated) {
        // User was authenticated, verify session is still valid
        useAuthStore.getState().fetchProfile()
      }
    } catch (e) {
      console.error('Failed to parse auth storage:', e)
    }
  }
}
