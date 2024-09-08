"use server";

import { actionClient } from "@/server/actions/safe-action";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "@/server/schema";
import { ResetPasswordSchema } from "@/types/reset-password-schema";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "@/server/actions/tokens";
import { sendPasswordResetEmail } from "@/server/actions/email";

export const resetPassword = actionClient
  .schema(ResetPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return { error: "User does not exist" };
    }

    const token = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(token[0].email, token[0].token);

    return { success: "Password reset email sent" };
  });
