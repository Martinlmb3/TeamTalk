"use client";

import { useAuth } from "./useAuth";
import { hasRole as checkRole, roleNumberToString, type UserRole } from "@/lib/utils/roleUtils";

export function useRoleCheck() {
  const { user } = useAuth();

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    return checkRole(user?.role, roles);
  };

  // Convert user.role (number) to string for comparison
  const userRoleName = user?.role !== undefined ? roleNumberToString(user.role) : null;

  const isAdmin = userRoleName === "Admin";
  const isCoach = userRoleName === "Coach";
  const isPlayer = userRoleName === "Player";
  const isCaptain = userRoleName === "Captain";

  // Helper functions for common permission checks
  const canManageTeams = hasRole(["Admin", "Coach"]);
  const canViewAllTeams = hasRole(["Admin", "Coach"]);
  const canEditTeam = hasRole(["Admin", "Coach", "Captain"]);
  const canInvitePlayers = hasRole(["Admin", "Coach"]);
  const canManageUsers = hasRole("Admin");
  const canCreateTeam = hasRole(["Admin", "Coach"]);

  return {
    hasRole,
    isAdmin,
    isCoach,
    isPlayer,
    isCaptain,
    canManageTeams,
    canViewAllTeams,
    canEditTeam,
    canInvitePlayers,
    canManageUsers,
    canCreateTeam,
  };
}
