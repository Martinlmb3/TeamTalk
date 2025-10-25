"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Paperclip, Smile, Users, Settings } from "lucide-react"
import Link from "next/link"
import chatService from "@/services/chatService"
import type { LobbyMessage, UserTypingEvent } from "@/types/chat"

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

interface ChatMessage {
  id: string
  sender: string
  senderRole: string
  avatar: string
  message: string
  timestamp: string
  isCurrentUser: boolean
}

export default function TeamChatPage({ params }: { params: { id: string } }) {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Connect to WebSocket and join lobby
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Connect to ChatHub
        await chatService.connect()
        setIsConnected(true)
        setError(null)

        // Join the lobby
        await chatService.joinLobby(params.id)

        // Set up message listener
        const handleReceiveLobbyMessage = (message: LobbyMessage) => {
          const chatMessage: ChatMessage = {
            id: message.Id,
            sender: message.UserName,
            senderRole: "player", // You can extend this based on user role
            avatar: "/player-avatar.png",
            message: message.Content,
            timestamp: new Date(message.SentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }),
            isCurrentUser: false, // Backend will determine this based on userId
          }
          setMessages((prev) => [...prev, chatMessage])
        }

        // Set up typing indicator listener
        const handleUserTyping = (event: UserTypingEvent) => {
          if (event.IsTyping) {
            setTypingUsers((prev) => new Set(prev).add(event.UserId))
          } else {
            setTypingUsers((prev) => {
              const newSet = new Set(prev)
              newSet.delete(event.UserId)
              return newSet
            })
          }
        }

        chatService.onReceiveLobbyMessage(handleReceiveLobbyMessage)
        chatService.onUserTyping(handleUserTyping)

        console.log(`Connected to lobby: ${params.id}`)
      } catch (err) {
        console.error("Failed to initialize chat:", err)
        setError("Failed to connect to chat. Please try refreshing the page.")
        setIsConnected(false)
      }
    }

    initializeChat()

    // Cleanup on unmount
    return () => {
      if (chatService.isConnected()) {
        chatService.leaveLobby(params.id).catch(console.error)
        chatService.off("ReceiveLobbyMessage")
        chatService.off("UserTyping")
      }
    }
  }, [params.id])

  const handleSendMessage = async () => {
    if (newMessage.trim() && isConnected) {
      try {
        await chatService.sendLobbyMessage(params.id, newMessage)
        setNewMessage("")

        // Stop typing indicator
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
          typingTimeoutRef.current = null
        }
        await chatService.typingInLobby(params.id, false)
      } catch (err) {
        console.error("Failed to send message:", err)
        setError("Failed to send message. Please try again.")
      }
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)

    // Send typing indicator
    if (isConnected && e.target.value.length > 0) {
      try {
        await chatService.typingInLobby(params.id, true)

        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }

        // Stop typing indicator after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(async () => {
          await chatService.typingInLobby(params.id, false)
        }, 3000)
      } catch (err) {
        console.error("Failed to send typing indicator:", err)
      }
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
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-800 flex justify-between items-center">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Connection Status */}
      {!isConnected && !error && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800">
          Connecting to chat...
        </div>
      )}

      {/* Chat Header */}
      <div className="bg-white border-b flex-shrink-0 px-4 py-3">
        <div className="flex justify-between items-center">
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
                <p className="text-sm text-gray-500">
                  {isConnected ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Connected
                    </span>
                  ) : (
                    <span className="text-gray-400">Connecting...</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Chat Settings
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Be the first to send a message!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
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
              ))
            )}
            {typingUsers.size > 0 && (
              <div className="text-sm text-gray-500 italic">
                {typingUsers.size === 1 ? "Someone is" : `${typingUsers.size} people are`} typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t bg-white p-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" disabled={!isConnected}>
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled={!isConnected}>
                <Smile className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <Input
                  placeholder={isConnected ? "Type your message..." : "Connecting..."}
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={!isConnected}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
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
