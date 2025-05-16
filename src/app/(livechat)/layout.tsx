// app/(auth)/auth/layout.tsx
import { Toaster } from 'sonner';
import type { ReactNode } from 'react';

export default function LiveChatLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
}
