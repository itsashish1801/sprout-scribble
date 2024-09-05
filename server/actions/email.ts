"use server";

import getBaseUrl from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend();
const domain = getBaseUrl();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/confirm-email?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Sprout & Scribble - Email Confirmation",
    text: `Please confirm your email by clicking on the following link: ${confirmLink}`,
    html: `<p>Please confirm your email by clicking: <a href="${confirmLink}">here</a></p>`,
  });

  if (error) return console.log(error);
  if (data) return data;
};
