"use server";

import { actionClient } from "@/server/actions/safe-action";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { getPasswordResetTokenByToken } from "@/server/actions/tokens";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "@/server/schema";
import bcrypt from "bcrypt";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

export const newPassword = actionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({ connectionString: process.env.DB_URL! });
    const dbPool = drizzle(pool);

    if (!token) {
      return { error: "Missing Token" };
    }

    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      return { error: "Token does not exist" };
    }

    if (existingToken.expires < new Date()) {
      return { error: "Token expired" };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) return { error: "User does not exist" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbPool.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, existingToken.id));
      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    });
    return { success: "Password reset successful" };
  });
