'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStatus } from "@/stores/useUserStatus";
import { useAIMessageHandler } from "@/stores/aiMessageHandler";
import Lottie from 'lottie-react';
import dotNotificationAnim from "../../../data/icon.json"
import { AIIcon } from "@/components/icons/AIIcon";  // adjust path as needed


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
  Edit,
  Building,
  Flame,
} from 'lucide-react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { acceptChats } = useUserStatus();
  const { newMsgCount, resetNewMsgCount } = useAIMessageHandler();

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
    { href: '/openai-assistant-chat', icon: Bot, label: 'OpenAI Assistant Chat' },
    { href: '/hive-consumer', icon: Bot, label: 'User' },
    { href: '/ai-assistants', icon: AIIcon, label: 'AI Assistants' },
    { href: '/ai-assistants-users', icon: AIIcon, label: 'AI Assistant Users' },
    { href: '/widget-builder', icon: Building, label: 'Widget Builder' },
    { href: '/widget-modifier', icon: Edit, label: 'Widget Modifier' },
    { href: '/widget-flavours', icon: Flame, label: 'Widget Flavours' }

  ];

  return (
    <Sidebar collapsible="icon" {...props}>
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
                    if (href === "/chats") resetNewMsgCount();
                  }}
                  className="data-[active=true]:bg-gradient-to-r data-[active=true]:from-indigo-500 data-[active=true]:to-purple-600 data-[active=true]:text-white data-[active=true]:shadow-lg"
                >
                  <Link href={href} className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {/* Always show Lucide chat icon */}
                      {href === "/chats" ? (
                        <MessageCircle className="mr-2 w-[18px] h-[18px]" strokeWidth={1.5} />
                      ) : href === "/ai-assistants" || href === "/ai-assistants-users" ? (
                        <AIIcon
                          className="mr-2 w-[18px] h-[18px]"
                          active={pathname === href}
                        />
                      ) : (
                        <Icon className="mr-2 w-[18px] h-[18px]" strokeWidth={1.5} />
                      )}

                      <span className="truncate">{label}</span>
                    </div>

                    {/* Dot badge replaced by Lottie */}
                    {href === "/chats" && newMsgCount > 0 && (
                      <span className="mr-1 w-[40px] h-[40px] flex justify-center items-center">
                        <Lottie
                          animationData={dotNotificationAnim}
                          loop
                          autoplay
                          style={{ width: 40, height: 40, pointerEvents: "none" }}
                        />
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
