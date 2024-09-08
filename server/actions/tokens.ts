"use server";

import { db } from "@/server";
import { eq } from "drizzle-orm";
import {
  passwordResetTokens,
  users,
  verificationTokens,
} from "@/server/schema";

export const getVerficationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.email, email),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerficationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerficationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));
  }

  const verificationToken = await db
    .insert(verificationTokens)
    .values({
      token,
      expires,
      email,
    })
    .returning();
  // .execute();

  return verificationToken;
};

export const verifyEmailToken = async (token: string) => {
  const existingToken = await getVerficationTokenByToken(token);

  if (!existingToken) return { error: "Invalid token" };

  if (existingToken.expires < new Date()) {
    return { error: "Token expired" };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });

  if (!existingUser) return { error: "Email does not exist" };

  await db
    .update(users)
    .set({ emailVerified: new Date(), email: existingToken.email });

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.id, existingToken.id));

  return { success: "Email verified" };
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));
  }

  const passwordResetToken = await db
    .insert(passwordResetTokens)
    .values({
      token,
      expires,
      email,
    })
    .returning();

  return passwordResetToken;
};
