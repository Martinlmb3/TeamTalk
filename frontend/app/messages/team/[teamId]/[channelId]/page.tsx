"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import MessagesSidebar from "@/components/messages-sidebar"
import { Send, Paperclip, Smile, Hash, Users, Settings } from "lucide-react"

interface TeamMessagesPageProps {
  params: {
    teamId: string
    channelId: string
  }
}

export default function TeamMessagesPage({ params }: TeamMessagesPageProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Sarah Miller",
      avatar: "/player-avatar.png",
      content: "Hey team, great practice today! 🏀",
      timestamp: "2:30 PM",
      isCurrentUser: false,
    },
    {
      id: 2,
      user: "Mark Thompson",
      avatar: "/assistant-coach-avatar.png",
      content: "Agreed! The new plays are really coming together.",
      timestamp: "2:32 PM",
      isCurrentUser: false,
    },
    {
      id: 3,
      user: "You",
      avatar: "/diverse-user-avatars.png",
      content: "Thanks coach! Looking forward to the game this weekend.",
      timestamp: "2:35 PM",
      isCurrentUser: true,
    },
    {
      id: 4,
      user: "Emily Carter",
      avatar: "/coach-avatar.png",
      content: "Don't forget we have an early practice tomorrow at 7 AM",
      timestamp: "2:40 PM",
      isCurrentUser: false,
    },
    {
      id: 5,
      user: "David Lee",
      avatar: "/player-avatar.png",
      content: "Got it! See everyone bright and early 💪",
      timestamp: "2:42 PM",
      isCurrentUser: false,
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: "You",
        avatar: "/diverse-user-avatars.png",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isCurrentUser: true,
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Mock team and channel data
  const teamName = "Team Titans"
  const channelName = params.channelId.charAt(0).toUpperCase() + params.channelId.slice(1).replace("-", " ")
  const onlineMembers = [
    { name: "Sarah Miller", avatar: "/player-avatar.png" },
    { name: "Emily Carter", avatar: "/coach-avatar.png" },
    { name: "David Lee", avatar: "/player-avatar.png" },
  ]

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <MessagesSidebar type="team" teamId={params.teamId} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-gray-500" />
              <h1 className="text-xl font-semibold text-gray-900">{channelName}</h1>
            </div>
            <Badge variant="secondary" className="text-xs">
              {teamName}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {/* Online Members */}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div className="flex -space-x-2">
                {onlineMembers.slice(0, 3).map((member, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-white">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="text-xs">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-gray-600">{onlineMembers.length} online</span>
            </div>

            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6">
          <div className="py-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                {!msg.isCurrentUser && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={msg.avatar || "/placeholder.svg"} alt={msg.user} />
                    <AvatarFallback className="text-xs">
                      {msg.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`flex flex-col ${msg.isCurrentUser ? "items-end" : "items-start"} max-w-xs lg:max-w-md`}
                >
                  {!msg.isCurrentUser && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{msg.user}</span>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                  )}

                  <div
                    className={`px-4 py-2 rounded-lg ${
                      msg.isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>

                  {msg.isCurrentUser && <span className="text-xs text-gray-500 mt-1">{msg.timestamp}</span>}
                </div>

                {msg.isCurrentUser && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={msg.avatar || "/placeholder.svg"} alt={msg.user} />
                    <AvatarFallback className="text-xs">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 px-4 py-3">
                <Input
                  placeholder={`Message #${channelName.toLowerCase()}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Smile className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
            <Button onClick={handleSendMessage} disabled={!message.trim()} className="px-4 py-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
