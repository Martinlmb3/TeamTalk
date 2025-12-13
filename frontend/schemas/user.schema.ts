import { z } from "zod"

/**
 * User profile update schema
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(val),
      "Please enter a valid phone number"
    ),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country must be less than 100 characters"),
  profilePicture: z
    .string()
    .url("Invalid profile picture URL")
    .optional()
    .or(z.literal("")),
})

export type UpdateProfileData = z.infer<typeof updateProfileSchema>

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  current: z
    .string()
    .min(1, "Current password is required"),
  new: z
    .string()
    .min(1, "New password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirm: z
    .string()
    .min(1, "Please confirm your new password"),
}).refine((data) => data.new === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
}).refine((data) => data.current !== data.new, {
  message: "New password must be different from current password",
  path: ["new"],
})

export type ChangePasswordData = z.infer<typeof changePasswordSchema>

/**
 * User role enum
 */
export const userRoleSchema = z.enum(["coach", "player", "admin"])

export type UserRole = z.infer<typeof userRoleSchema>

/**
 * User status enum
 */
export const userStatusSchema = z.enum(["active", "pending", "suspended", "inactive"])

export type UserStatus = z.infer<typeof userStatusSchema>

/**
 * Auth provider enum
 */
export const authProviderSchema = z.enum(["Jwt", "Google", "Facebook"])

export type AuthProvider = z.infer<typeof authProviderSchema>

/**
 * User schema (for display/admin purposes)
 */
export const userSchema = z.object({
  id: z.number().or(z.string()),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  role: userRoleSchema,
  status: userStatusSchema,
  authProvider: authProviderSchema.optional(),
  profilePicture: z.string().url().optional().or(z.literal("")),
  joinDate: z.string().optional(),
  location: z.string().optional(),
  lastActive: z.string().optional(),
  totalMessages: z.number().optional(),
  teams: z.array(z.string()).optional(),
})

export type User = z.infer<typeof userSchema>

/**
 * Profile picture upload schema
 */
export const profilePictureSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Only JPG, PNG, and WebP formats are supported"
    ),
})

export type ProfilePictureData = z.infer<typeof profilePictureSchema>

/**
 * User filter schema (for admin user management)
 */
export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  sortBy: z.enum(["name", "email", "joinDate", "lastActive", "totalMessages"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})

export type UserFilterData = z.infer<typeof userFilterSchema>

/**
 * Update user status schema (admin action)
 */
export const updateUserStatusSchema = z.object({
  userId: z.number().or(z.string()),
  status: userStatusSchema,
  reason: z.string().optional(),
})

export type UpdateUserStatusData = z.infer<typeof updateUserStatusSchema>