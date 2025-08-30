import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Users, Settings, UserPlus, Crown, Shield } from "lucide-react"
import Link from "next/link"

// Mock data for team details
const mockTeam = {
  id: 1,
  name: "Eagles Soccer Team",
  sport: "Soccer",
  description: "Competitive soccer team focused on teamwork and excellence.",
  memberCount: 24,
  createdDate: "March 2024",
  avatar: "/generic-soccer-team-logo.png",
}

const mockMembers = [
  { id: 1, name: "Coach Johnson", role: "coach", avatar: "/coach-avatar.png", status: "online" },
  { id: 2, name: "Assistant Coach Smith", role: "assistant", avatar: "/assistant-coach-avatar.png", status: "online" },
  { id: 3, name: "Alex Rodriguez", role: "player", avatar: "/player-avatar.png", status: "online" },
  { id: 4, name: "Sarah Chen", role: "player", avatar: "/player-avatar.png", status: "offline" },
  { id: 5, name: "Mike Thompson", role: "player", avatar: "/player-avatar.png", status: "online" },
  { id: 6, name: "Emma Wilson", role: "player", avatar: "/player-avatar.png", status: "offline" },
]

export default function TeamPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Team Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={mockTeam.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{mockTeam.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockTeam.name}</h1>
                  <p className="text-gray-600 mb-2">{mockTeam.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{mockTeam.sport}</span>
                    <span>•</span>
                    <span>{mockTeam.memberCount} members</span>
                    <span>•</span>
                    <span>Created {mockTeam.createdDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Members
                </Button>
                <Link href={`/team/${params.id}/chat`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">Open Team Chat</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Members */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Team Members ({mockMembers.length})
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              member.status === "online" ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {member.role === "coach" && <Crown className="w-4 h-4 text-yellow-500" />}
                        {member.role === "assistant" && <Shield className="w-4 h-4 text-blue-500" />}
                        <Badge variant={member.status === "online" ? "default" : "secondary"}>{member.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Stats & Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Members</span>
                  <span className="font-semibold">{mockTeam.memberCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Online Now</span>
                  <span className="font-semibold text-green-600">
                    {mockMembers.filter((m) => m.status === "online").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coaches</span>
                  <span className="font-semibold">
                    {mockMembers.filter((m) => m.role === "coach" || m.role === "assistant").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Players</span>
                  <span className="font-semibold">{mockMembers.filter((m) => m.role === "player").length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite New Members
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Team Settings
                </Button>
                <Link href={`/team/${params.id}/chat`}>
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">Open Team Chat</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
