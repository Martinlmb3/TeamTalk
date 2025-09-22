import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, MoreHorizontal, Shield, UserX, UserCheck } from "lucide-react"
import Link from "next/link"

// Mock data for all users
const mockAllUsers = [
  {
    id: 1,
    name: "Coach Johnson",
    email: "johnson@example.com",
    role: "coach",
    teams: ["Eagles Soccer Team"],
    joined: "March 15, 2024",
    lastActive: "2 hours ago",
    status: "active",
    totalMessages: 247,
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    email: "alex@example.com",
    role: "player",
    teams: ["Eagles Soccer Team"],
    joined: "March 16, 2024",
    lastActive: "1 hour ago",
    status: "active",
    totalMessages: 89,
  },
  {
    id: 3,
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "player",
    teams: ["Thunder Basketball"],
    joined: "March 14, 2024",
    lastActive: "3 hours ago",
    status: "active",
    totalMessages: 156,
  },
  {
    id: 4,
    name: "Mike Thompson",
    email: "mike@example.com",
    role: "coach",
    teams: ["Sharks Swimming Club"],
    joined: "March 12, 2024",
    lastActive: "1 day ago",
    status: "pending",
    totalMessages: 34,
  },
  {
    id: 5,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "player",
    teams: ["Eagles Soccer Team", "Thunder Basketball"],
    joined: "March 10, 2024",
    lastActive: "5 days ago",
    status: "suspended",
    totalMessages: 78,
  },
]

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">User Management</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search users..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Monitor and manage all users on the platform.</p>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({mockAllUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAllUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/player-avatar.png" />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        {user.teams.length > 0 ? user.teams.join(", ") : "No teams"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <Badge variant={user.role === "coach" ? "default" : "secondary"}>{user.role}</Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{user.totalMessages}</p>
                      <p className="text-xs text-gray-500">Messages</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{user.lastActive}</p>
                      <p className="text-xs text-gray-500">Last Active</p>
                    </div>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : user.status === "pending" ? "secondary" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                    <div className="flex space-x-2">
                      {user.status === "active" && (
                        <Button variant="outline" size="sm">
                          <UserX className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      )}
                      {user.status === "suspended" && (
                        <Button variant="outline" size="sm">
                          <UserCheck className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
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
