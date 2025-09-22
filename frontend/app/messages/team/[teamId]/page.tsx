"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface TeamMessagesProps {
  params: {
    teamId: string
  }
}

export default function TeamMessages({ params }: TeamMessagesProps) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to general channel by default
    router.replace(`/messages/team/${params.teamId}/general`)
  }, [params.teamId, router])

  return null
}
