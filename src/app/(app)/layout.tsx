// app/(app)/layout.tsx
'use client';

import { useEffect, type ReactNode } from 'react';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import { SidebarProvider } from "@/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Toaster } from '@/ui/sonner';
import { NavbarWrapper } from '@/components/navbar/navbar';
import { useAIMessageHandler } from '@/stores/aiMessageHandler';
import { useUserMessageHandler } from '@/stores/userMessageHandler';
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
  useEffect(() => {
    // Initialize MQTT connection for AI handler
    useAIMessageHandler.getState().connect('nextjs/poc/s', 'user-1');
    useUserMessageHandler.getState().connect('nextjs/poc/s', 'user-2');
    return () => {
      // Keep connection alive across routes
      // Optionally: useAIMessageHandler.getState().disconnect();
    };
  }, []);
  return (
    <ThemeProvider attribute="class">
        <SidebarProvider>
          <AppSidebar />
          <main className={`${geistSans.variable} ${geistMono.variable} w-full bg-background text-foreground antialiased overflow-x-hidden`}>
            <NavbarWrapper />
            {children}
          </main>
          <Toaster />
        </SidebarProvider>
    </ThemeProvider>
  );
}
