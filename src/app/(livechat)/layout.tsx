// app/(auth)/auth/layout.tsx
import type { ReactNode } from 'react';

export default function LiveChatLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
