import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeState {
  // State
  theme: Theme
  resolvedTheme: ResolvedTheme
  mounted: boolean

  // Actions
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  initialize: () => void
}

// Get system theme preference
const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

// Resolve theme based on user preference and system
const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme === 'system') {
    return getSystemTheme()
  }
  return theme
}

// Apply theme to document
const applyTheme = (resolvedTheme: ResolvedTheme) => {
  if (typeof window === 'undefined') return

  const root = document.documentElement

  // Remove both classes first
  root.classList.remove('light', 'dark')

  // Add the resolved theme class
  root.classList.add(resolvedTheme)

  // Update data attribute for CSS
  root.setAttribute('data-theme', resolvedTheme)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      resolvedTheme: 'light',
      mounted: false,

      // Set theme
      setTheme: (theme) => {
        const resolvedTheme = resolveTheme(theme)

        set({ theme, resolvedTheme })
        applyTheme(resolvedTheme)
      },

      // Toggle between light and dark
      toggleTheme: () => {
        const { resolvedTheme } = get()
        const newTheme: Theme = resolvedTheme === 'dark' ? 'light' : 'dark'

        set({ theme: newTheme, resolvedTheme: newTheme })
        applyTheme(newTheme)
      },

      // Initialize theme on mount
      initialize: () => {
        const { theme } = get()
        const resolvedTheme = resolveTheme(theme)

        set({ mounted: true, resolvedTheme })
        applyTheme(resolvedTheme)

        // Listen for system theme changes
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

          const handleChange = (e: MediaQueryListEvent) => {
            const { theme } = get()

            // Only update if user is using system theme
            if (theme === 'system') {
              const newResolvedTheme = e.matches ? 'dark' : 'light'
              set({ resolvedTheme: newResolvedTheme })
              applyTheme(newResolvedTheme)
            }
          }

          // Use addEventListener for better browser support
          if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange)
          } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleChange)
          }
        }
      },
    }),
    {
      name: 'theme-storage',
      // Only persist theme, not mounted or resolvedTheme
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
)

// Initialize on load (client-side only)
if (typeof window !== 'undefined') {
  // Apply theme immediately to prevent flash
  const stored = localStorage.getItem('theme-storage')

  if (stored) {
    try {
      const { state } = JSON.parse(stored)
      const theme = state.theme || 'system'
      const resolvedTheme = resolveTheme(theme)
      applyTheme(resolvedTheme)
    } catch (error) {
      console.error('Failed to parse theme from storage:', error)
    }
  }
}
