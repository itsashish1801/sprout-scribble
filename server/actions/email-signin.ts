"use server";

import { LoginSchema } from "@/types/login-schema";

import { db } from "@/server";
import { eq } from "drizzle-orm";
import { twoFactorTokens, users } from "@/server/schema";
import { actionClient } from "@/server/actions/safe-action";
import {
  generateTwoFactorToken,
  generateVerificationToken,
  getTwoFactorTokenByEmail,
} from "@/server/actions/tokens";
import {
  sendTwoFactorToken,
  sendVerificationEmail,
} from "@/server/actions/email";
import { signIn } from "@/server/auth";
import { AuthError } from "next-auth";

export const emailSignin = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "Email not found" };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
          existingUser.email
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "Email confirmation sent" };
      }

      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          if (!twoFactorToken) {
            return { error: "No token" };
          }
          if (twoFactorToken.token !== code) {
            return { error: "Invalid token" };
          }
          if (new Date(twoFactorToken.expires) < new Date()) {
            return { error: "Token expired" };
          }
          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const newTwoFactorToken = await generateTwoFactorToken(
            existingUser.email,
            existingUser.id
          );

          if (!newTwoFactorToken) {
            return { error: "Token not generated" };
          }

          await sendTwoFactorToken(
            newTwoFactorToken[0].email,
            newTwoFactorToken[0].token
          );
          return { twoFactor: "Two factor token sent" };
        }
      }

      await signIn("credentials", { email, password, redirectTo: "/" });

      return { success: "Logged in successfully" };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid email or password" };
          case "AccessDenied":
            return { error: "Email not verified" };
          default:
            return { error: "Something went wrong" };
        }
      }
      throw error;
    }
  });
