import * as z from "zod";

export const settingsSchema = z
  .object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    currentPassword: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
  })
  .refine(
    data => {
      if (data.currentPassword && !data.newPassword) {
        return false;
      }
      return true;
    },
    { message: "New password is required", path: ["newPassword"] },
  );
