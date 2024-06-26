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
import { useRouter } from "next/navigation";

const UserButton = ({ user }: Session) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState<boolean>(false);

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
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
        <div className="mb-4 flex flex-col items-center gap-1 rounded-lg bg-primary/10 p-4">
          {user.image && (
            <Image
              className="rounded-full"
              src={user.image}
              alt={user.name!}
              width={36}
              height={36}
            />
          )}
          <p className="text-xs font-bold">{user.name}</p>
          <span className="text-xs font-medium text-secondary-foreground">
            {user.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/orders")}
          className="group cursor-pointer py-2 font-medium"
        >
          <TruckIcon
            size={14}
            className="mr-2 transition-all duration-300 ease-in-out group-hover:translate-x-1"
          />
          My orders
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings")}
          className="group cursor-pointer py-2 font-medium"
        >
          <SettingsIcon
            size={14}
            className="mr-2 transition-all duration-300 ease-in-out group-hover:rotate-180"
          />
          Settings
        </DropdownMenuItem>
        {theme && (
          <DropdownMenuItem className="cursor-pointer py-2 font-medium">
            <div
              className="group flex items-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative mr-2 flex">
                <Sun
                  className="absolute transition-all duration-500 ease-in-out group-hover:rotate-180 group-hover:text-yellow-600 dark:-rotate-90 dark:scale-0"
                  size={14}
                />
                <Moon
                  className="scale-0 group-hover:text-blue-400 dark:scale-100"
                  size={14}
                />
              </div>
              <p className="text-secondary-foreground/75 text-yellow-600 dark:text-blue-400">
                {theme[0].toUpperCase() + theme.slice(1)} mode
              </p>
              <Switch
                className="ml-2 scale-75"
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
          className="group cursor-pointer py-2 font-medium"
        >
          <LogOutIcon
            size={14}
            className="mr-2 transition-all duration-300 ease-in-out group-hover:scale-75"
          />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
