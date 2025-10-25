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
import chatService from "@/services/chatService"
import type { DirectMessageData, UserTypingDirectEvent } from "@/types/chat"

interface DirectMessagesPageProps {
  params: {
    userId: string
  }
}

interface DMMessage {
  id: string
  user: string
  avatar: string
  content: string
  timestamp: string
  isCurrentUser: boolean
}

export default function DirectMessagesPage({ params }: DirectMessagesPageProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<DMMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Connect to WebSocket
  useEffect(() => {
    const initializeDirectMessages = async () => {
      try {
        // Connect to ChatHub
        await chatService.connect()
        setIsConnected(true)
        setError(null)

        // Set up direct message listener
        const handleReceiveDirectMessage = (dmData: DirectMessageData) => {
          const newMessage: DMMessage = {
            id: dmData.Id,
            user: dmData.SenderName,
            avatar: "/player-avatar.png",
            content: dmData.Content,
            timestamp: new Date(dmData.SentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }),
            isCurrentUser: false,
          }
          setMessages((prev) => [...prev, newMessage])
        }

        // Set up sent message confirmation
        const handleDirectMessageSent = (dmData: DirectMessageData) => {
          const sentMessage: DMMessage = {
            id: dmData.Id,
            user: "You",
            avatar: "/diverse-user-avatars.png",
            content: dmData.Content,
            timestamp: new Date(dmData.SentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }),
            isCurrentUser: true,
          }
          setMessages((prev) => [...prev, sentMessage])
        }

        // Set up typing indicator listener
        const handleUserTypingDirect = (event: UserTypingDirectEvent) => {
          setIsTyping(event.IsTyping)
        }

        chatService.onReceiveDirectMessage(handleReceiveDirectMessage)
        chatService.onDirectMessageSent(handleDirectMessageSent)
        chatService.onUserTypingDirect(handleUserTypingDirect)

        console.log(`Connected for direct messages with user: ${params.userId}`)
      } catch (err) {
        console.error("Failed to initialize direct messages:", err)
        setError("Failed to connect to chat. Please try refreshing the page.")
        setIsConnected(false)
      }
    }

    initializeDirectMessages()

    // Cleanup on unmount
    return () => {
      if (chatService.isConnected()) {
        chatService.off("ReceiveDirectMessage")
        chatService.off("DirectMessageSent")
        chatService.off("UserTypingDirect")
      }
    }
  }, [params.userId])

  const handleSendMessage = async () => {
    if (message.trim() && isConnected) {
      try {
        await chatService.sendDirectMessage(params.userId, message)
        setMessage("")

        // Stop typing indicator
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
          typingTimeoutRef.current = null
        }
        await chatService.typingDirectMessage(params.userId, false)
      } catch (err) {
        console.error("Failed to send direct message:", err)
        setError("Failed to send message. Please try again.")
      }
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)

    // Send typing indicator
    if (isConnected && e.target.value.length > 0) {
      try {
        await chatService.typingDirectMessage(params.userId, true)

        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }

        // Stop typing indicator after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(async () => {
          await chatService.typingDirectMessage(params.userId, false)
        }, 3000)
      } catch (err) {
        console.error("Failed to send typing indicator:", err)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-800 flex justify-between items-center">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </div>
        )}

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
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Start the conversation with {currentUser.name}!</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
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
              ))
            )}
            {isTyping && (
              <div className="text-sm text-gray-500 italic">
                {currentUser.name} is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 px-4 py-3">
                <Input
                  placeholder={isConnected ? `Message ${currentUser.name}` : "Connecting..."}
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={!isConnected}
                  className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={!isConnected}>
                    <Paperclip className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={!isConnected}>
                    <Smile className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
            <Button onClick={handleSendMessage} disabled={!message.trim() || !isConnected} className="px-4 py-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
