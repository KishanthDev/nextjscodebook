// app/(app)/layout.tsx
'use client';

import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import { SidebarProvider } from "@/registry/new-york-v4/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from '@/registry/new-york-v4/ui/sonner';
import { NavbarWrapper } from '@/components/navbar/navbar';
import { UserStatusProvider } from '@/context/UserStatusContext';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <UserStatusProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className={`${geistSans.variable} ${geistMono.variable} w-full bg-background text-foreground antialiased`}>
            <NavbarWrapper />
            {children}
          </main>
          <Toaster />
        </SidebarProvider>
      </UserStatusProvider>
    </ThemeProvider>
  );
}
