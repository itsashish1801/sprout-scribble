import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(
      z.string().min(3, { message: "Username must be at least 3 characters" })
    ),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email({ message: "Invalid email" })),
    password: z.optional(
      z.string().min(8, { message: "Password must be at least 8 characters" })
    ),
    newPassword: z.optional(
      z.string().min(8, { message: "Password must be at least 8 characters" })
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    { message: "New password is required", path: ["newPassword"] }
  );
