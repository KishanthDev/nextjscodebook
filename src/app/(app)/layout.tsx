'use client';

import { type ReactNode, useEffect } from 'react';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import { SidebarProvider } from "@/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Toaster } from '@/ui/sonner';
import { NavbarWrapper } from '@/components/navbar/navbar';
import { useAIMessageHandler } from '@/stores/aiMessageHandler';

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
    const handler = useAIMessageHandler.getState();
    if (!handler.client) {
      handler.connect(
        'chat/users/+',
        `agent-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
      );
    }
  }, []);

  return (
    <ThemeProvider attribute="class">
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main content area */}
          <main
            className={`${geistSans.variable} ${geistMono.variable} relative flex flex-col flex-1 bg-background text-foreground antialiased`}
          >
            {/* ✅ Fixed Navbar INSIDE main area (respects sidebar) */}
            <div className="sticky top-0 z-50">
              <NavbarWrapper />
            </div>

            {/* ✅ Scrollable content below navbar */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            <Toaster />
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
