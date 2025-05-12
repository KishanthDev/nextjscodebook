"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../../registry/new-york-v4/ui/dropdown-menu"; // shadcn/ui DropdownMenu
import { User2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // shadcn/ui utility for className merging

const Divider = () => (
  <hr className="my-2 border-t-2 border-gray-300 dark:border-gray-600" />
);

const statusOptions = [
  { label: "Online", color: "bg-green-500" },
  { label: "Away", color: "bg-yellow-400" },
  { label: "Busy", color: "bg-red-500" },
  { label: "Offline", color: "bg-gray-400" },
];

export const UserDropdown = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const isDark = theme === "dark";
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [isOpen, setIsOpen] = useState(false); // <-- track open state

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth");
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-haspopup="true"
          aria-label="User menu"
          className={cn(
            "relative cursor-pointer rounded-full bg-transparent p-0",
            isOpen ? "ring-2 ring-primary" : "focus:outline-none focus:ring-2 focus:ring-primary"
          )}
        >
          <User2
            className={cn("h-8 w-8", isDark ? "text-white" : "text-black")}
          />
          <span
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2",
              isDark ? "border-zinc-900" : "border-white",
              selectedStatus.color
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(
          "w-64 rounded-lg p-2 shadow-xl",
          isDark ? "bg-zinc-900 text-white" : "bg-white text-black"
        )}
        align="end"
      >
        <DropdownMenuItem className="h-16 focus:bg-transparent">
          <div className="flex items-center gap-2">
            <span
              aria-label="avatar"
              className="flex items-center justify-center text-inherit w-8 h-8"
              role="img"
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="80%"
                role="presentation"
                viewBox="0 0 24 24"
                width="80%"
                className={cn(isDark ? "text-white" : "text-black")}
              >
                <path
                  d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z"
                  fill="currentColor"
                />
                <path
                  d="M17.0809 14.1489C14.2909 12.2889 9.74094 12.2889 6.93094 14.1489C5.66094 14.9989 4.96094 16.1489 4.96094 17.3789C4.96094 18.6089 5.66094 19.7489 6.92094 20.5889C8.32094 21.5289 10.1609 21.9989 12.0009 21.9989C13.8409 21.9989 15.6809 21.5289 17.0809 20.5889C18.3409 19.7389 19.0409 18.5989 19.0409 17.3589C19.0309 16.1289 18.3409 14.9889 17.0809 14.1489Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-bold text-base",
                  isDark ? "text-white" : "text-black"
                )}
              >
                Signed in as
              </span>
              <span
                className={cn(
                  "font-medium text-sm",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}
              >
                zoey@example.com
              </span>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-0" aria-hidden="true">
          <Divider />
        </DropdownMenuItem>

        <DropdownMenuItem
          className={cn(
            "text-base",
            isDark ? "text-white hover:bg-zinc-800" : "text-black hover:bg-gray-100"
          )}
        >
          My Profile
        </DropdownMenuItem>

        {/* Status submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            className={cn(
              "text-base",
              isDark ? "text-white" : "text-black"
            )}
          >
            <span>Status</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            className={cn(
              "w-40 rounded-lg p-2 shadow-xl",
              isDark ? "bg-zinc-900 text-white" : "bg-white text-black"
            )}
          >
            {statusOptions.map(({ label, color }) => (
              <DropdownMenuItem
                key={label}
                onClick={() => setSelectedStatus({ label, color })}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm",
                  isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"
                )}
              >
                <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem className="p-0" aria-hidden="true">
          <Divider />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className={cn(
            "text-base font-medium",
            isDark ? "text-red-400 hover:bg-zinc-800" : "text-red-500 hover:bg-gray-100"
          )}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};