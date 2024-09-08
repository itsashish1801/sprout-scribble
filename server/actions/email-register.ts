"use server";

import bcrypt from "bcrypt";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";
import { actionClient } from "@/server/actions/safe-action";
import { RegisterSchema } from "@/types/register-schema";
import { generateVerificationToken } from "@/server/actions/tokens";
import { sendVerificationEmail } from "@/server/actions/email";

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(
    async ({ parsedInput: { email, name, password, confirmPassword } }) => {
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
        if (!existingUser.emailVerified) {
          const verificationToken = await generateVerificationToken(email);
          await sendVerificationEmail(email, verificationToken[0].token);

          return { success: "Email confirmation resent" };
        }
        return { error: "Email already exists" };
      }

      await db.insert(users).values({
        email,
        name,
        password: hashedPassword,
      });

      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail(email, verificationToken[0].token);
      return { success: "Email confirmation sent" };
    }
  );
