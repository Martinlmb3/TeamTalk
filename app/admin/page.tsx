import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Users, MessageCircle, Shield, Settings, Search, MoreHorizontal, AlertTriangle, Activity } from "lucide-react"
import Link from "next/link"

// Mock data for admin dashboard
const mockStats = {
  totalUsers: 1247,
  totalTeams: 89,
  totalMessages: 15432,
  activeUsers: 342,
}

const mockRecentTeams = [
  {
    id: 1,
    name: "Eagles Soccer Team",
    sport: "Soccer",
    members: 24,
    coach: "Coach Johnson",
    created: "2 days ago",
    status: "active",
  },
  {
    id: 2,
    name: "Thunder Basketball",
    sport: "Basketball",
    members: 15,
    coach: "Coach Williams",
    created: "1 week ago",
    status: "active",
  },
  {
    id: 3,
    name: "Sharks Swimming Club",
    sport: "Swimming",
    members: 18,
    coach: "Coach Davis",
    created: "3 days ago",
    status: "pending",
  },
]

const mockRecentUsers = [
  {
    id: 1,
    name: "Alex Rodriguez",
    email: "alex@example.com",
    role: "player",
    team: "Eagles Soccer Team",
    joined: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "player",
    team: "Thunder Basketball",
    joined: "1 day ago",
    status: "active",
  },
  {
    id: 3,
    name: "Mike Thompson",
    email: "mike@example.com",
    role: "coach",
    team: "Sharks Swimming Club",
    joined: "3 days ago",
    status: "pending",
  },
]

const mockReports = [
  {
    id: 1,
    type: "inappropriate_message",
    reporter: "Sarah Chen",
    reported: "John Doe",
    team: "Eagles Soccer Team",
    reason: "Inappropriate language in team chat",
    status: "pending",
    created: "2 hours ago",
  },
  {
    id: 2,
    type: "spam",
    reporter: "Coach Johnson",
    reported: "Spam User",
    team: "Thunder Basketball",
    reason: "Sending spam messages repeatedly",
    status: "resolved",
    created: "1 day ago",
  },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">TeamTalk Admin</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search users, teams..." className="pl-10 w-64" />
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/admin-avatar.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage the TeamTalk platform.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Teams</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalTeams}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalMessages.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Teams */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Teams</CardTitle>
                <Link href="/admin/teams">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentTeams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`/generic-${team.sport.toLowerCase()}-team-logo.png`} />
                        <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{team.name}</p>
                        <p className="text-sm text-gray-500">
                          {team.members} members • {team.coach}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={team.status === "active" ? "default" : "secondary"}>{team.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Users</CardTitle>
                <Link href="/admin/users">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/player-avatar.png" />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          {user.email} • {user.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports & Moderation */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Reports & Moderation
              </CardTitle>
              <Link href="/admin/reports">
                <Button variant="outline" size="sm">
                  View All Reports
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        report.status === "pending" ? "bg-yellow-500" : "bg-green-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {report.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-600">
                        {report.reporter} reported {report.reported} in {report.team}
                      </p>
                      <p className="text-sm text-gray-500">{report.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={report.status === "pending" ? "destructive" : "default"}>{report.status}</Badge>
                    <span className="text-sm text-gray-500">{report.created}</span>
                    {report.status === "pending" && (
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Take Action
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
