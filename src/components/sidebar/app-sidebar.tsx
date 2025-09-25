'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStatus } from "@/stores/useUserStatus";
import { useAIMessageHandler } from "@/stores/aiMessageHandler"; // ⬅️ import store

import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/ui/sidebar';

import {
  LayoutDashboard,
  MessageCircle,
  Bot,
  Settings2,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  Send,
  BadgeDollarSign,
  ChartGanttIcon,
} from 'lucide-react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { acceptChats } = useUserStatus();
  const { newMsgCount, resetNewMsgCount } = useAIMessageHandler(); // ⬅️ access count + reset

  const user = {
    name: 'zoey',
    email: 'zoey@example.com',
    avatar: '/avatars/shadcn.jpg',
  };

  const teams = [
    { name: 'Acme Inc', logo: GalleryVerticalEnd, plan: 'Enterprise' },
    { name: 'Acme Corp.', logo: AudioWaveform, plan: 'Startup' },
    { name: 'Evil Corp.', logo: Command, plan: 'Free' },
  ];

  const links = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/chats', icon: MessageCircle, label: 'Active Chats' },
    { href: '/engage', icon: Send, label: 'Engage' },
    { href: '/ai-agent', icon: Bot, label: 'AI Agent Training' },
    { href: '/agent-bots', icon: Bot, label: 'Agent Bots' },
    { href: '/modifier', icon: Settings2, label: 'Chat Widget' },
    { href: '/billing', icon: BadgeDollarSign, label: 'Billing' },
    { href: '/ai', icon: Bot, label: 'AI' },
    { href: '/custom-ai', icon: Bot, label: 'Custom - AI' },
    { href: '/angular-ai', icon: Bot, label: 'Angular-AI' },
    { href: '/pdf-chat', icon: ChartGanttIcon, label: 'PDF Chat' },
    { href: '/openai-assistant-chat', icon: Bot, label: 'OpenAI Assistant Chat' },
    { href: '/hive-consumer', icon: Bot, label: 'User' },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <style>
        {`
          @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
          }
          .animate-breathe {
            animation: breathe 1.5s ease-in-out infinite;
          }
        `}
      </style>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
        <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map(({ href, icon: Icon, label }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  data-active={pathname === href}
                  onClick={() => {
                    if (href === "/chats") resetNewMsgCount(); // ⬅️ reset on click
                  }}
                  className="data-[active=true]:bg-gradient-to-r data-[active=true]:from-indigo-500 data-[active=true]:to-purple-600 data-[active=true]:text-white data-[active=true]:shadow-lg"
                >
                  <Link href={href} className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Icon className="mr-2 w-[18px] h-[18px]" strokeWidth={1.5} />
                      <span className='truncate'>{label}</span>
                    </div>
                    {href === "/chats" && newMsgCount > 0 && (
                      <span className="relative flex items-center justify-center w-3 h-3">
                        {/* breathing background */}
                        <span className="absolute w-full h-full rounded-full bg-red-500 animate-breathe origin-center"></span>
                        {/* solid dot */}
                        <span className="relative w-2 h-2 rounded-full bg-red-500"></span>
                      </span>
                    )}


                  </Link>

                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} isOnline={acceptChats} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
