"use client";

import { useRoleCheck } from "@/hooks/useRoleCheck";
import { ReactNode } from "react";

type UserRole = "Admin" | "Coach" | "Player" | "Captain";

interface RoleGuardProps {
  roles: UserRole | UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * RoleGuard component that conditionally renders children based on user roles
 *
 * @example
 * ```tsx
 * <RoleGuard roles="Admin">
 *   <AdminPanel />
 * </RoleGuard>
 *
 * <RoleGuard roles={["Admin", "Coach"]}>
 *   <TeamManagement />
 * </RoleGuard>
 *
 * <RoleGuard roles="Player" fallback={<p>Access denied</p>}>
 *   <PlayerStats />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { hasRole } = useRoleCheck();

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
