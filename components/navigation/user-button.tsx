"use client";

import { Session } from "next-auth";
import { Button } from "@/components/ui/button";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function UserIcon({ user }: Session) {
  return (
    <div>
      <h1>{user?.email}</h1>
      <Button onClick={() => signOut()} className="gap-1">
        <LogOut size={16} />
        <span>Log out</span>
      </Button>
    </div>
  );
}
