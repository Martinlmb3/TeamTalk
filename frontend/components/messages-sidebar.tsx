"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Hash, Search, Plus, Users, Calendar, Megaphone, Coffee, Trophy } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MessagesSidebarProps {
  type: "team" | "direct"
  teamId?: string
}

export default function MessagesSidebar({ type, teamId }: MessagesSidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for team channels
  const teamChannels = [
    { id: "general", name: "General", icon: Hash, unread: 3, type: "channel" },
    { id: "game-day", name: "Game Day", icon: Trophy, unread: 0, type: "channel" },
    { id: "off-season", name: "Off-Season", icon: Calendar, unread: 1, type: "channel" },
    { id: "announcements", name: "Announcements", icon: Megaphone, unread: 0, type: "channel" },
    { id: "social-events", name: "Social Events", icon: Coffee, unread: 2, type: "channel" },
  ]

  // Mock data for direct messages
  const directMessages = [
    {
      id: "1",
      name: "Sarah Miller",
      avatar: "/player-avatar.png",
      status: "online",
      lastMessage: "Hey, are you ready for practice?",
      unread: 2,
      timestamp: "2m ago",
    },
    {
      id: "2",
      name: "Coach Johnson",
      avatar: "/coach-avatar.png",
      status: "away",
      lastMessage: "Great job in today's game!",
      unread: 0,
      timestamp: "1h ago",
    },
    {
      id: "3",
      name: "Mark Thompson",
      avatar: "/assistant-coach-avatar.png",
      status: "offline",
      lastMessage: "Can we reschedule tomorrow's meeting?",
      unread: 1,
      timestamp: "3h ago",
    },
    {
      id: "4",
      name: "Emily Carter",
      avatar: "/diverse-user-avatars.png",
      status: "online",
      lastMessage: "Thanks for the feedback!",
      unread: 0,
      timestamp: "5h ago",
    },
  ]

  const filteredChannels = teamChannels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredDMs = directMessages.filter((dm) => dm.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const isChannelActive = (channelId: string) => {
    if (type === "team") {
      return pathname.includes(`/messages/team/${teamId}/${channelId}`)
    }
    return pathname.includes(`/messages/direct/${channelId}`)
  }

  return (
    <div className="w-64 bg-muted border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">{type === "team" ? "Team Channels" : "Direct Messages"}</h2>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={type === "team" ? "Search channels..." : "Search conversations..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {type === "team" ? (
            // Team Channels
            <div className="space-y-1">
              {filteredChannels.map((channel) => {
                const Icon = channel.icon
                const isActive = isChannelActive(channel.id)

                return (
                  <Link
                    key={channel.id}
                    href={`/messages/team/${teamId}/${channel.id}`}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 truncate">{channel.name}</span>
                    {channel.unread > 0 && (
                      <Badge variant="default" className="h-5 min-w-5 text-xs px-1.5">
                        {channel.unread}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          ) : (
            // Direct Messages
            <div className="space-y-1">
              {filteredDMs.map((dm) => {
                const isActive = isChannelActive(dm.id)

                return (
                  <Link
                    key={dm.id}
                    href={`/messages/direct/${dm.id}`}
                    className={`flex items-center gap-3 px-2 py-2 rounded-md transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={dm.avatar || "/placeholder.svg"} alt={dm.name} />
                        <AvatarFallback className="text-xs">
                          {dm.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {/* Status indicator */}
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                          dm.status === "online"
                            ? "bg-green-500"
                            : dm.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">{dm.name}</span>
                        <span className="text-xs text-gray-500">{dm.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{dm.lastMessage}</p>
                    </div>

                    {dm.unread > 0 && (
                      <Badge variant="default" className="h-5 min-w-5 text-xs px-1.5">
                        {dm.unread}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{type === "team" ? "5 channels" : "4 conversations"}</span>
        </div>
      </div>
    </div>
  )
}
