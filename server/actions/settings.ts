"use server";

import { SettingsSchema } from "@/types/settings-schema";
import { actionClient } from "@/server/actions/safe-action";
import { auth } from "@/server/auth";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export const settings = actionClient
  .schema(SettingsSchema)
  .action(async ({ parsedInput }) => {
    const user = await auth();

    if (!user) return { error: "User not found" };

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    });

    if (!dbUser) return { error: "User not found" };

    if (user.user.isOAuth) {
      parsedInput.email = undefined;
      parsedInput.image = undefined;
      parsedInput.password = undefined;
      parsedInput.isTwoFactorEnabled = undefined;
    }

    if (parsedInput.password && parsedInput.newPassword && dbUser.password) {
      const passwordMatch = await bcrypt.compare(
        parsedInput.password,
        dbUser.password
      );

      if (!passwordMatch) return { error: "Invalid password" };

      const samePassword = await bcrypt.compare(
        parsedInput.newPassword,
        dbUser.password
      );

      if (samePassword) return { error: "New password cannot be same as old" };

      const hashedPassword = await bcrypt.hash(parsedInput.newPassword, 10);
      parsedInput.password = hashedPassword;
      parsedInput.newPassword = undefined;
    }

    const updatedUser = await db
      .update(users)
      .set({
        twoFactorEnabled: parsedInput.isTwoFactorEnabled,
        email: parsedInput.email,
        image: parsedInput.image,
        password: parsedInput.password,
        name: parsedInput.name,
      })
      .where(eq(users.id, dbUser.id));

    revalidatePath("/dashboard/settings");
    return { success: "Settings updated" };
  });
