"use client";

import { Button } from "@/components/ui/button";

import { signIn } from "next-auth/react";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Socials() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => signIn("google", { redirect: false, callbackUrl: "/" })}
        variant="outline"
        className="w-full relative"
      >
        <FcGoogle
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        />
        Login with Google
      </Button>
      <Button
        onClick={() => signIn("github", { redirect: false, callbackUrl: "/" })}
        variant="outline"
        className="w-full relative"
      >
        <FaGithub
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        />
        Login with Github
      </Button>
    </div>
  );
}
