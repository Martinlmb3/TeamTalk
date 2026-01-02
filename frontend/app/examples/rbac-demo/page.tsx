"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Settings, BarChart, Shield } from "lucide-react";

/**
 * This page demonstrates Role-Based Access Control (RBAC) implementation
 * Different sections are visible based on user roles: Admin, Coach, Player, Captain
 */
export default function RBACDemoPage() {
  const { user, isLoading } = useAuth();
  const {
    isAdmin,
    isCoach,
    isPlayer,
    isCaptain,
    canManageTeams,
    canCreateTeam,
    canInvitePlayers
  } = useRoleCheck();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access this page</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Shield className="w-8 h-8" />
          RBAC Demo Page
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          This page demonstrates role-based access control. Different sections appear based on your role.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="font-semibold">Current User: {user.firstName} {user.lastName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Email: {user.email} | Role: <span className="font-bold text-blue-600 dark:text-blue-400">{user.role}</span>
          </p>
        </div>
      </div>

      {/* Role-specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Admin-only section */}
        <RoleGuard roles="Admin">
          <Card className="border-2 border-red-500 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Settings className="w-5 h-5" />
                Admin Controls
              </CardTitle>
              <CardDescription>Only visible to Admins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Manage All Users
              </Button>
              <Button className="w-full" variant="outline">
                System Settings
              </Button>
              <Button className="w-full" variant="outline">
                View All Analytics
              </Button>
            </CardContent>
          </Card>
        </RoleGuard>

        {/* Admin and Coach section */}
        <RoleGuard roles={["Admin", "Coach"]}>
          <Card className="border-2 border-blue-500 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Trophy className="w-5 h-5" />
                Team Management
              </CardTitle>
              <CardDescription>Visible to Admins and Coaches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {canCreateTeam && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Create New Team
                </Button>
              )}
              <Button className="w-full" variant="outline">
                Manage Teams
              </Button>
              {canInvitePlayers && (
                <Button className="w-full" variant="outline">
                  Invite Players
                </Button>
              )}
            </CardContent>
          </Card>
        </RoleGuard>

        {/* Player-specific section */}
        <RoleGuard roles="Player">
          <Card className="border-2 border-green-500 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <BarChart className="w-5 h-5" />
                Player Features
              </CardTitle>
              <CardDescription>Only visible to Players</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                View My Stats
              </Button>
              <Button className="w-full" variant="outline">
                Match History
              </Button>
              <Button className="w-full" variant="outline">
                Request to Join Team
              </Button>
            </CardContent>
          </Card>
        </RoleGuard>

        {/* Coach-specific section */}
        <RoleGuard roles="Coach">
          <Card className="border-2 border-purple-500 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Trophy className="w-5 h-5" />
                Coaching Tools
              </CardTitle>
              <CardDescription>Only visible to Coaches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Schedule Training
              </Button>
              <Button className="w-full" variant="outline">
                Team Analytics
              </Button>
              <Button className="w-full" variant="outline">
                Player Development Plans
              </Button>
            </CardContent>
          </Card>
        </RoleGuard>

        {/* Captain section */}
        <RoleGuard roles="Captain">
          <Card className="border-2 border-yellow-500 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <Users className="w-5 h-5" />
                Captain Features
              </CardTitle>
              <CardDescription>Only visible to Captains</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                Coordinate Team
              </Button>
              <Button className="w-full" variant="outline">
                Organize Activities
              </Button>
              <Button className="w-full" variant="outline">
                Team Communication
              </Button>
            </CardContent>
          </Card>
        </RoleGuard>

        {/* Section visible to all authenticated users */}
        <Card className="border-2 border-gray-300 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Common Features
            </CardTitle>
            <CardDescription>Visible to all authenticated users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              View Profile
            </Button>
            <Button className="w-full" variant="outline">
              Update Settings
            </Button>
            <Button className="w-full" variant="outline">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Current Permissions</CardTitle>
          <CardDescription>Based on your role: {user.role}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Role Checks:</h4>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Is Admin: {isAdmin ? 'Yes' : 'No'}
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isCoach ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Is Coach: {isCoach ? 'Yes' : 'No'}
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isPlayer ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Is Player: {isPlayer ? 'Yes' : 'No'}
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isCaptain ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Is Captain: {isCaptain ? 'Yes' : 'No'}
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Permission Checks:</h4>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${canManageTeams ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Can Manage Teams: {canManageTeams ? 'Yes' : 'No'}
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${canCreateTeam ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Can Create Team: {canCreateTeam ? 'Yes' : 'No'}
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${canInvitePlayers ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Can Invite Players: {canInvitePlayers ? 'Yes' : 'No'}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>How This Works</CardTitle>
          <CardDescription>Implementation examples from this page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Using RoleGuard Component:</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`<RoleGuard roles="Admin">
  <AdminPanel />
</RoleGuard>

<RoleGuard roles={["Admin", "Coach"]}>
  <TeamManagement />
</RoleGuard>`}</code>
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Using useRoleCheck Hook:</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`const { isAdmin, canManageTeams } = useRoleCheck();

{canManageTeams && (
  <Button>Manage Teams</Button>
)}`}</code>
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. Backend Authorization:</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`[Authorize(Policy = "CoachOrAdmin")]
public async Task<IActionResult> CreateTeam([FromBody] CreateTeamDto dto)
{
  // Only Coaches and Admins can access this endpoint
}`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
