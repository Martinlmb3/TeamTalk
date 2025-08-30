import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, MoreHorizontal, Shield } from "lucide-react"
import Link from "next/link"

// Mock data for all teams
const mockAllTeams = [
  {
    id: 1,
    name: "Eagles Soccer Team",
    sport: "Soccer",
    members: 24,
    coach: "Coach Johnson",
    coachEmail: "johnson@example.com",
    created: "March 15, 2024",
    lastActivity: "2 hours ago",
    status: "active",
    totalMessages: 1247,
  },
  {
    id: 2,
    name: "Thunder Basketball",
    sport: "Basketball",
    members: 15,
    coach: "Coach Williams",
    coachEmail: "williams@example.com",
    created: "March 10, 2024",
    lastActivity: "1 day ago",
    status: "active",
    totalMessages: 892,
  },
  {
    id: 3,
    name: "Sharks Swimming Club",
    sport: "Swimming",
    members: 18,
    coach: "Coach Davis",
    coachEmail: "davis@example.com",
    created: "March 12, 2024",
    lastActivity: "3 hours ago",
    status: "pending",
    totalMessages: 234,
  },
  {
    id: 4,
    name: "Lions Rugby Team",
    sport: "Rugby",
    members: 22,
    coach: "Coach Martinez",
    coachEmail: "martinez@example.com",
    created: "March 8, 2024",
    lastActivity: "5 days ago",
    status: "inactive",
    totalMessages: 567,
  },
]

export default function AdminTeamsPage() {
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
                <span className="ml-2 text-xl font-bold text-gray-900">Team Management</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search teams..." className="pl-10 w-64" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
          <p className="text-gray-600">Monitor and manage all teams on the platform.</p>
        </div>

        {/* Teams Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Teams ({mockAllTeams.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAllTeams.map((team) => (
                <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={`/generic-${team.sport.toLowerCase()}-team-logo.png`} />
                      <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-600">
                        {team.sport} • {team.coach}
                      </p>
                      <p className="text-xs text-gray-500">{team.coachEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{team.members}</p>
                      <p className="text-xs text-gray-500">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{team.totalMessages}</p>
                      <p className="text-xs text-gray-500">Messages</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{team.lastActivity}</p>
                      <p className="text-xs text-gray-500">Last Active</p>
                    </div>
                    <Badge
                      variant={
                        team.status === "active" ? "default" : team.status === "pending" ? "secondary" : "destructive"
                      }
                    >
                      {team.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
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
