import BubbleEditorClient from "./PageClient";
import { BubblePixelSettings } from "@/components/pixel-modifier/bubble/bubbletype";
import { ChatbarSettings } from "@/components/pixel-modifier/chatbar/chatbartype";
import { ChatWidgetSettings } from "@/components/pixel-modifier/chatwidget/chat-widget-types";

import bubbleDefaults from '@/defaults/bubble.json';
import chatBarDefaults from '@/defaults/chatbar.json';
import chatWidgetDefaults from '@/defaults/chatwidget.json';

async function getConfigs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/config`, { cache: "no-store" });
    if (!res.ok) throw new Error('Failed to fetch configs');
    return await res.json();
  } catch (err) {
    console.warn('Fetching configs failed, using defaults:', (err as Error).message);
    return {
      bubble: bubbleDefaults as BubblePixelSettings,
      chatbar: chatBarDefaults as ChatbarSettings,
      chatwidget: chatWidgetDefaults as ChatWidgetSettings,
    };
  }
}

export default async function PageSSR() {
  const { bubble, chatbar, chatwidget } = await getConfigs();

  return (
    <div className="flex flex-col h-[calc(100vh-114px)] w-full mx-auto p-4">
      <BubbleEditorClient
        bubble={bubble}
        chatbar={chatbar}
        chatwidget={chatwidget}
      />
    </div>
  );
}
