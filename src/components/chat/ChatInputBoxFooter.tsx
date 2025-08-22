// ChatFooter.tsx
"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ChatInputBoxFooter({ children }: Props) {
  return (
    <div className="absolute bottom-2 left-2 flex gap-2 max-w-[70%] overflow-x-auto 
                    scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
      <div className="flex gap-2">{children}</div>
    </div>
  );
}
