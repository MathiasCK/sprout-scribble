"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Switch } from "~/components/ui/switch";

import Image from "next/image";
import { LogOutIcon, Moon, SettingsIcon, Sun, TruckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

const UserButton = ({ user }: Session) => {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState<boolean>(false);

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar>
          {user.image ? (
            <Image src={user.image} alt={user.name!} fill={true} />
          ) : (
            <AvatarFallback className="bg-primary/25">
              <div className="font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-6" align="end">
        <div className="mb-4 p-4 flex flex-col items-center gap-1 bg-primary/10 rounded-lg">
          {user.image && (
            <Image
              className="rounded-full"
              src={user.image}
              alt={user.name!}
              width={36}
              height={36}
            />
          )}
          <p className="font-bold text-xs">{user.name}</p>
          <span className="text-xs font-medium text-secondary-foreground">
            {user.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer">
          <TruckIcon
            size={14}
            className="mr-2 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
          />
          My orders
        </DropdownMenuItem>
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer">
          <SettingsIcon
            size={14}
            className="mr-2 group-hover:rotate-180 transition-all duration-300 ease-in-out"
          />
          Settings
        </DropdownMenuItem>
        {theme && (
          <DropdownMenuItem className="py-2 font-medium cursor-pointer">
            <div
              className="flex items-center group"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative flex mr-2">
                <Sun
                  className="group-hover:text-yellow-600 absolute group-hover:rotate-180 dark:scale-0 dark:-rotate-90 transition-all duration-500 ease-in-out"
                  size={14}
                />
                <Moon
                  className="group-hover:text-blue-400 dark:scale-100 scale-0"
                  size={14}
                />
              </div>
              <p className="dark:text-blue-400 text-secondary-foreground/75 text-yellow-600">
                {theme[0].toUpperCase() + theme.slice(1)} mode
              </p>
              <Switch
                className="scale-75 ml-2"
                checked={checked}
                onCheckedChange={e => {
                  setChecked(prev => !prev);
                  setTheme(e ? "dark" : "light");
                }}
              />
            </div>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => signOut()}
          className="group py-2 font-medium cursor-pointer"
        >
          <LogOutIcon
            size={14}
            className="mr-2 group-hover:scale-75 transition-all duration-300 ease-in-out"
          />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
