"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import MessagesSidebar from "@/components/messages-sidebar"
import { Send, Paperclip, Smile, Phone, Video, MoreVertical } from "lucide-react"

interface DirectMessagesPageProps {
  params: {
    userId: string
  }
}

export default function DirectMessagesPage({ params }: DirectMessagesPageProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Sarah Miller",
      avatar: "/player-avatar.png",
      content: "Hey! Are you ready for tomorrow's practice?",
      timestamp: "10:30 AM",
      isCurrentUser: false,
    },
    {
      id: 2,
      user: "You",
      avatar: "/diverse-user-avatars.png",
      content: "Yes, definitely! I've been working on those new drills you showed me.",
      timestamp: "10:32 AM",
      isCurrentUser: true,
    },
    {
      id: 3,
      user: "Sarah Miller",
      avatar: "/player-avatar.png",
      content: "That's great to hear! Coach mentioned you've been improving a lot.",
      timestamp: "10:35 AM",
      isCurrentUser: false,
    },
    {
      id: 4,
      user: "You",
      avatar: "/diverse-user-avatars.png",
      content: "Thanks! I really appreciate the extra help you've been giving me.",
      timestamp: "10:37 AM",
      isCurrentUser: true,
    },
    {
      id: 5,
      user: "Sarah Miller",
      avatar: "/player-avatar.png",
      content: "Of course! We're a team. By the way, did you see the game schedule for next month?",
      timestamp: "10:40 AM",
      isCurrentUser: false,
    },
    {
      id: 6,
      user: "You",
      avatar: "/diverse-user-avatars.png",
      content: "Not yet, where can I find it?",
      timestamp: "10:42 AM",
      isCurrentUser: true,
    },
    {
      id: 7,
      user: "Sarah Miller",
      avatar: "/player-avatar.png",
      content: "I'll send you the link. It's posted in the team announcements channel too.",
      timestamp: "10:45 AM",
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

  // Mock user data based on userId
  const getUserData = (userId: string) => {
    const users = {
      "1": {
        name: "Sarah Miller",
        avatar: "/player-avatar.png",
        status: "online",
        role: "Team Captain",
        team: "Team Titans",
      },
      "2": {
        name: "Coach Johnson",
        avatar: "/coach-avatar.png",
        status: "away",
        role: "Head Coach",
        team: "Team Titans",
      },
      "3": {
        name: "Mark Thompson",
        avatar: "/assistant-coach-avatar.png",
        status: "offline",
        role: "Assistant Coach",
        team: "Team Titans",
      },
      "4": {
        name: "Emily Carter",
        avatar: "/diverse-user-avatars.png",
        status: "online",
        role: "Player",
        team: "Team Strikers",
      },
    }
    return users[userId as keyof typeof users] || users["1"]
  }

  const currentUser = getUserData(params.userId)

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <MessagesSidebar type="direct" />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback>
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {/* Status indicator */}
              <div
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                  currentUser.status === "online"
                    ? "bg-green-500"
                    : currentUser.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                }`}
              />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-gray-900">{currentUser.name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {currentUser.role}
                </Badge>
                <span className="text-sm text-gray-500">{currentUser.team}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
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
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      msg.isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>

                  <span className="text-xs text-gray-500 mt-1">{msg.timestamp}</span>
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
                  placeholder={`Message ${currentUser.name}`}
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
