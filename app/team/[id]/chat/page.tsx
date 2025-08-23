"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Paperclip, Smile, Users, Settings } from "lucide-react"
import Link from "next/link"

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    sender: "Coach Johnson",
    senderRole: "coach",
    avatar: "/coach-avatar.png",
    message: "Great practice today everyone! Remember we have our game this Saturday at 2 PM.",
    timestamp: "10:30 AM",
    isCurrentUser: false,
  },
  {
    id: 2,
    sender: "Alex Rodriguez",
    senderRole: "player",
    avatar: "/player-avatar.png",
    message: "Thanks coach! Should we bring our own water bottles?",
    timestamp: "10:32 AM",
    isCurrentUser: false,
  },
  {
    id: 3,
    sender: "You",
    senderRole: "coach",
    avatar: "/diverse-user-avatars.png",
    message: "Yes, please bring your own water bottles. Also, don't forget your cleats!",
    timestamp: "10:35 AM",
    isCurrentUser: true,
  },
  {
    id: 4,
    sender: "Sarah Chen",
    senderRole: "player",
    avatar: "/player-avatar.png",
    message: "Coach, what time should we arrive for warm-up?",
    timestamp: "10:40 AM",
    isCurrentUser: false,
  },
  {
    id: 5,
    sender: "Mike Thompson",
    senderRole: "player",
    avatar: "/player-avatar.png",
    message: "I'll be there 30 minutes early to help set up!",
    timestamp: "10:42 AM",
    isCurrentUser: false,
  },
]

const mockOnlineMembers = [
  { id: 1, name: "Coach Johnson", role: "coach", avatar: "/coach-avatar.png" },
  { id: 2, name: "Alex Rodriguez", role: "player", avatar: "/player-avatar.png" },
  { id: 3, name: "Sarah Chen", role: "player", avatar: "/player-avatar.png" },
  { id: 4, name: "Mike Thompson", role: "player", avatar: "/player-avatar.png" },
  { id: 5, name: "Emma Wilson", role: "player", avatar: "/player-avatar.png" },
]

export default function TeamChatPage({ params }: { params: { id: string } }) {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "You",
        senderRole: "coach",
        avatar: "/diverse-user-avatars.png",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isCurrentUser: true,
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href={`/team/${params.id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Team
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/generic-soccer-team-logo.png" />
                  <AvatarFallback>ET</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-semibold text-gray-900">Eagles Soccer Team</h1>
                  <p className="text-sm text-gray-500">{mockOnlineMembers.length} members online</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Chat Settings
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-xs lg:max-w-md ${message.isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={message.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {message.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`mx-2 ${message.isCurrentUser ? "text-right" : "text-left"}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-sm font-medium ${message.isCurrentUser ? "order-2" : "order-1"}`}>
                        {message.sender}
                      </span>
                      {message.senderRole === "coach" && (
                        <Badge
                          variant="secondary"
                          className={`text-xs ${message.isCurrentUser ? "order-1" : "order-2"}`}
                        >
                          Coach
                        </Badge>
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.isCurrentUser ? "bg-blue-600 text-white" : "bg-white border text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t bg-white p-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Smile className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Online Members Sidebar */}
        <div className="w-64 bg-white border-l flex-shrink-0 hidden lg:block">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Online ({mockOnlineMembers.length})
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {mockOnlineMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
