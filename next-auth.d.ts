import NextAuth, { type DefaultSession } from "next-auth";
import { decl } from "postcss";

export type ExtendUser = DefaultSession["user"] & {
  id: string;
  role: string;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  image: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendUser;
  }
}
