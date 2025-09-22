"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MessagesPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to direct messages by default
    router.replace("/messages/direct")
  }, [router])

  return null
}
