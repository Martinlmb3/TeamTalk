/**
 * Utility functions for handling user roles
 */

export type UserRole = "Admin" | "Coach" | "Player" | "Captain";

/**
 * Convert backend role enum (number) to role name (string)
 * Backend enum: Admin = 0, Coach = 1, Player = 2, Captain = 3
 */
export function roleNumberToString(roleNumber: number): UserRole | null {
  switch (roleNumber) {
    case 0:
      return "Admin";
    case 1:
      return "Coach";
    case 2:
      return "Player";
    case 3:
      return "Captain";
    default:
      return null;
  }
}

/**
 * Convert role name (string) to backend role enum (number)
 */
export function roleStringToNumber(roleName: UserRole): number {
  switch (roleName) {
    case "Admin":
      return 0;
    case "Coach":
      return 1;
    case "Player":
      return 2;
    case "Captain":
      return 3;
  }
}

/**
 * Check if a role number matches any of the specified role names
 */
export function hasRole(userRoleNumber: number | undefined | null, allowedRoles: UserRole | UserRole[]): boolean {
  if (userRoleNumber === undefined || userRoleNumber === null) return false;

  const userRoleName = roleNumberToString(userRoleNumber);
  if (!userRoleName) return false;

  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return rolesArray.includes(userRoleName);
}
