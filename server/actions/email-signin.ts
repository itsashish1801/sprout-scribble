"use server";

import { LoginSchema } from "@/types/loginSchema";

import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";
import { actionClient } from "@/server/actions/safe-action";

export const emailSignin = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser?.email !== email) {
      return { error: "Email not found" };
    }

    return { success: { email, password, code } };
  });
