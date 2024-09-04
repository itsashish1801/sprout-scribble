import { auth } from "@/server/auth";

import Logo from "@/components/navigation/logo";
import UserBtn from "@/components/navigation/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="bg-zinc-100 py-4 px-4 md:px-8 lg:px-16">
      <nav>
        <ul className="flex items-center justify-between">
          <li>
            <Link href="/">
              <Logo />
            </Link>
          </li>
          {!session ? (
            <li>
              <Button asChild>
                <Link href="/auth/login" className="gap-1">
                  <LogIn size={16} />
                  <span>Log in</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserBtn expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
