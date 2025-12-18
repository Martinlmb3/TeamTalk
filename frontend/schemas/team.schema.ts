import { z } from "zod"

/**
 * Team creation schema
 */
export const createTeamSchema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .min(3, "Team name must be at least 3 characters")
    .max(100, "Team name must be less than 100 characters"),
  sport: z
    .string()
    .min(1, "Sport is required")
    .max(50, "Sport must be less than 50 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  teamLogo: z
    .string()
    .url("Invalid logo URL")
    .optional()
    .or(z.literal("")),
  maxMembers: z
    .number()
    .min(2, "Team must have at least 2 members")
    .max(200, "Team cannot exceed 200 members")
    .optional(),
  isPrivate: z.boolean().optional(),
  inviteCode: z
    .string()
    .min(6, "Invite code must be at least 6 characters")
    .max(20, "Invite code must be less than 20 characters")
    .optional(),
})

export type CreateTeamData = z.infer<typeof createTeamSchema>

/**
 * Update team schema
 */
export const updateTeamSchema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .min(3, "Team name must be at least 3 characters")
    .max(100, "Team name must be less than 100 characters")
    .optional(),
  sport: z
    .string()
    .min(1, "Sport is required")
    .max(50, "Sport must be less than 50 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  teamLogo: z
    .string()
    .url("Invalid logo URL")
    .optional()
    .or(z.literal("")),
  maxMembers: z
    .number()
    .min(2, "Team must have at least 2 members")
    .max(200, "Team cannot exceed 200 members")
    .optional(),
  isPrivate: z.boolean().optional(),
})

export type UpdateTeamData = z.infer<typeof updateTeamSchema>

/**
 * Team member schema
 */
export const teamMemberSchema = z.object({
  userId: z.string().or(z.number()),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["coach", "player", "assistant"]),
  joinedAt: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal("")),
})

export type TeamMember = z.infer<typeof teamMemberSchema>

/**
 * Team schema (complete team object)
 */
export const teamSchema = z.object({
  id: z.string().or(z.number()),
  name: z.string(),
  sport: z.string(),
  description: z.string().optional(),
  teamLogo: z.string().url().optional().or(z.literal("")),
  coachId: z.string().or(z.number()),
  coachName: z.string(),
  memberCount: z.number(),
  maxMembers: z.number().optional(),
  isPrivate: z.boolean().optional(),
  inviteCode: z.string().optional(),
  createdAt: z.string().optional(),
  lastActivity: z.string().optional(),
  status: z.enum(["active", "pending", "inactive"]).optional(),
  members: z.array(teamMemberSchema).optional(),
})

export type Team = z.infer<typeof teamSchema>

/**
 * Team invitation schema
 */
export const teamInvitationSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  role: z.enum(["player", "assistant"], {
    required_error: "Please select a role",
  }),
  message: z
    .string()
    .max(200, "Message must be less than 200 characters")
    .optional(),
})

export type TeamInvitationData = z.infer<typeof teamInvitationSchema>

/**
 * Team logo upload schema
 */
export const teamLogoSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Only JPG, PNG, and WebP formats are supported"
    ),
})

export type TeamLogoData = z.infer<typeof teamLogoSchema>
