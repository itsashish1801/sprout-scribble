"use client";

import { Session } from "next-auth";
import { Button } from "@/components/ui/button";

import { LogOut, Moon, Settings, Sun, Truck } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function UserIcon({ user }: Session) {
  const { setTheme, theme } = useTheme();

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Avatar className="w-10 h-10">
            {user?.image && <AvatarImage src={user?.image} />}
            <AvatarFallback className="bg-rose-200 text-rose-800 font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-4" align="end">
        <DropdownMenuLabel className="font-semibold flex flex-col text-base">
          <div>{user?.name}</div>
          <div className="text-zinc-600 dark:text-zinc-400 font-normal text-sm">
            {user?.email}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuGroup className="font-medium">
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/orders")}
            className="inline-flex items-center gap-2 w-full"
          >
            <Truck size={16} /> My Orders
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="inline-flex items-center gap-2 w-full"
          >
            <Settings size={16} /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="inline-flex items-center gap-2 w-full">
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {theme === "light" && <Sun size={16} />}
              {theme === "dark" && <Moon size={16} />}
              Toggle Theme
              <Switch
                checked={theme === "dark"}
                onCheckedChange={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
              />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 w-full cursor-pointer"
          >
            <LogOut size={16} /> Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
