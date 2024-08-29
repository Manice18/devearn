"use client"; // remove in case of server side navbar

import Image from "next/image";
import Link from "next/link";

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { LogOut, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserButtonProps {
  user: User;
}

export default function UserButton({ user }: UserButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hidden">
        <Button size="icon" className="flex-none rounded-full">
          <Image
            src={user.image || "/images/user/avatar_placeholder.png"}
            alt="User profile picture"
            width={50}
            height={50}
            className="aspect-square rounded-full bg-background object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark:bg-blacksection z-[99999] w-56 border-[0.5px] dark:border-white">
        <DropdownMenuLabel>{user.name || "User"}</DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-white" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="dark:hover:bg-hoverdark">
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="dark:bg-white" />
        <DropdownMenuItem asChild className="dark:hover:bg-hoverdark">
          <button
            className="flex w-full items-center"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
