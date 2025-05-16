"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york-v4/ui/avatar";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/registry/new-york-v4/ui/sidebar";
import { Apple, Bell, ChevronsUpDown, LogOut } from "lucide-react";
import Link from "next/link";

export function NavUser({
    user,
}: {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
}) {
    const { isMobile } = useSidebar();
    const { theme, setTheme } = useTheme();
    const [acceptChats, setAcceptChats] = useState(false);

    // Toggle handlers
    const handleAcceptChatsToggle = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent click from closing the dropdown
        setAcceptChats((prev) => !prev);
    };

    const handleDarkModeToggle = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent click from closing the dropdown
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="flex items-center justify-between">
                                Accept chats
                                <label
                                    className="relative inline-flex items-center cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={acceptChats}
                                        onChange={() => { }}
                                        onClick={handleAcceptChatsToggle}
                                        aria-label="Accept chats"
                                        data-testid="accept-chats-toggle"
                                    />
                                    <div
                                        className={`w-10 h-6 rounded-full transition-colors duration-500 ease-in-out ${acceptChats ? "bg-green-500" : "bg-gray-300"
                                            }`}
                                    >
                                        <div
                                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition duration-500 ease-in-out mt-1 ml-1 ${acceptChats ? "translate-x-4 scale-110" : "translate-x-0 scale-100"
                                                }`}
                                        ></div>
                                    </div>
                                </label>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center justify-between">
                                Dark mode
                                <label
                                    className="relative inline-flex items-center cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={theme === "dark"}
                                        onChange={() => { }}
                                        onClick={handleDarkModeToggle}
                                        aria-label="Dark mode"
                                        data-testid="dark-mode-toggle"
                                    />
                                    <div
                                        className={`w-10 h-6 rounded-full transition-colors duration-500 ease-in-out ${theme === "dark" ? "bg-blue-500" : "bg-gray-300"
                                            }`}
                                    >
                                        <div
                                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition duration-500 ease-in-out mt-1 ml-1 ${theme === "dark" ? "translate-x-4 scale-110" : "translate-x-0 scale-100"
                                                }`}
                                        ></div>
                                    </div>
                                </label>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Help center</DropdownMenuItem>
                            <DropdownMenuItem>Report an issue</DropdownMenuItem>
                            <DropdownMenuItem>Keyboard shortcut</DropdownMenuItem>
                            <DropdownMenuItem>Company details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Download Apps
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Bell /> Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut />
                            <Link href="/auth">Log out</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}