import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageCircle, Settings, Plus, Crown } from "lucide-react"
import Link from "next/link"

// Mock data for teams/lobbies
const mockTeams = [
  {
    id: 1,
    name: "Eagles Soccer Team",
    sport: "Soccer",
    memberCount: 24,
    role: "coach",
    lastActivity: "2 hours ago",
    unreadMessages: 5,
    avatar: "/generic-soccer-team-logo.png",
  },
  {
    id: 2,
    name: "Thunder Basketball",
    sport: "Basketball",
    memberCount: 15,
    role: "player",
    lastActivity: "1 day ago",
    unreadMessages: 0,
    avatar: "/abstract-basketball-logo.png",
  },
  {
    id: 3,
    name: "Sharks Swimming Club",
    sport: "Swimming",
    memberCount: 18,
    role: "coach",
    lastActivity: "3 hours ago",
    unreadMessages: 2,
    avatar: "/swimming-team-logo.png",
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Coach Johnson!</h1>
            <p className="text-gray-600">Manage your teams and stay connected with your players.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Teams</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                  <p className="text-2xl font-bold text-gray-900">7</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">57</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teams Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Your Teams</h2>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTeams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={team.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <p className="text-sm text-gray-600">{team.sport}</p>
                    </div>
                  </div>
                  {team.role === "coach" && <Crown className="w-4 h-4 text-yellow-500" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Members</span>
                    <Badge variant="secondary">{team.memberCount}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Activity</span>
                    <span className="text-sm text-gray-900">{team.lastActivity}</span>
                  </div>

                  {team.unreadMessages > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Unread Messages</span>
                      <Badge className="bg-red-500 hover:bg-red-600">{team.unreadMessages}</Badge>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <Link href={`/team/${team.id}`}>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Open Team Chat
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for New Users */}
        {mockTeams.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No teams yet</h3>
              <p className="text-gray-600 mb-6">Create your first team to start communicating with your players.</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Team
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
