'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStatus } from "@/stores/useUserStatus";

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
} from 'lucide-react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { acceptChats } = useUserStatus();

  const user = {
    name: 'zoey',
    email: 'zoey@example.com',
    avatar: '/avatars/shadcn.jpg',
  };

  const teams = [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ];

  const links = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/chats', icon: MessageCircle, label: 'Active Chats' },
    { href: '/engage', icon: Send, label: 'Engage' },
    { href: '/ai-agent', icon: Bot, label: 'AI Agent' },
    { href: '/modifier', icon: Settings2, label: 'Chat Widget' },
    { href: '/archived-chats', icon: MessageCircle, label: 'Archived Chats' },
    { href: '/billing', icon: BadgeDollarSign, label: 'Billing' },
    { href: '/ai', icon: Bot, label: 'AI' },
    { href: '/ai-sdk', icon: Bot, label: 'AI - SDK' },
    { href: '/custom-ai', icon: Bot, label: 'Custom - AI' },
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
                  className="data-[active=true]:bg-gradient-to-r data-[active=true]:from-indigo-500 data-[active=true]:to-purple-600 data-[active=true]:text-white data-[active=true]:shadow-lg"
                >
                  <Link href={href}>
                    <Icon className="mr-2" />
                    <span>{label}</span>
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