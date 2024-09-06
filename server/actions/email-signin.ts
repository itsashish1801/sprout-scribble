"use server";

import { LoginSchema } from "@/types/loginSchema";

import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";
import { actionClient } from "@/server/actions/safe-action";
import { generateVerificationToken } from "@/server/actions/tokens";
import { sendVerificationEmail } from "@/server/actions/email";
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
