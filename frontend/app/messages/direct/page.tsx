"use client"

import MessagesSidebar from "@/components/messages-sidebar"
import { MessageCircle } from "lucide-react"

export default function DirectMessagesPage() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <MessagesSidebar type="direct" />

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h2>
          <p className="text-gray-600">Choose a conversation from the sidebar to start messaging.</p>
        </div>
      </div>
    </div>
  )
}
