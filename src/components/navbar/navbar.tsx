"use client";

import React from "react";
import { Button } from "../../registry/new-york-v4/ui/button"; // shadcn/ui Button
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../registry/new-york-v4/ui/dropdown-menu"; // shadcn/ui DropdownMenu
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { DarkModeSwitch } from "./darkmodeswitch";
import FullScreenToggle  from "./FullScreenToggle";
import { UserDropdown } from "./user-dropdown";



export const NavbarWrapper = () => {
  const { resolvedTheme } = useTheme();
const isDark = resolvedTheme === "dark";

if (!resolvedTheme) return null;

  const baseBtnClass =
    "inline-flex h-9 w-10 items-center justify-center rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden",
        isDark ? "bg-black" : "bg-white"
      )}
    >
      {/* Navbar */}
      <header
        className={cn(
          "relative w-full py-2 shadow-lg border-b",
          isDark
            ? "border-gray-700 bg-black text-white"
            : "border-gray-300 bg-white text-black"
        )}
      >
        <div className="flex items-center justify-between px-4">
          {/* Left Section */}
          <div className="flex items-center space-x-4">

            <span className="font-bold text-primary">Chat App</span>
          </div>

          {/* Right Section (Mobile: Dropdown, Desktop: Inline) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile View (Dropdown) */}
            <div className="block lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className={baseBtnClass}>
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <DarkModeSwitch />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FullScreenToggle />
                  </DropdownMenuItem>
                  <DropdownMenuItem><UserDropdown/></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop View (Inline) */}
            <div className="hidden lg:flex items-center gap-3">
              <div className={baseBtnClass}>
                <DarkModeSwitch />
              </div>
              <div className={baseBtnClass}>
                <FullScreenToggle />
              </div>
              {/* Replace UserDropdown with shadcn/ui DropdownMenu */}
              <UserDropdown/>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};