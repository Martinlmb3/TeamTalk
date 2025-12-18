import { z } from "zod";

/**
 * Schema for selecting user role after registration
 */
export const selectRoleSchema = z.object({
  role: z.enum(["Player", "Coach"], {
    required_error: "Please select a role",
    invalid_type_error: "Invalid role selected",
  }),
});

export type SelectRoleFormData = z.infer<typeof selectRoleSchema>;
