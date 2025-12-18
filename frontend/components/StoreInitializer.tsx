"use client"

import { useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'

export function StoreInitializer() {
  useEffect(() => {
    // Initialize theme store
    useThemeStore.getState().initialize()
  }, [])

  return null
}
