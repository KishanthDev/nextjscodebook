import BubbleEditorClient from "./PageClient";
import { BubblePixelSettings } from "@/components/pixel-modifier/bubble/bubbletype";
import { ChatbarSettings } from "@/components/pixel-modifier/chatbar/chatbartype";
import { ChatWidgetSettings } from "@/components/pixel-modifier/chatwidget/chat-widget-types";

async function getConfigs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/config`, { cache: "no-store" });
  return res.json();
}

export default async function PageSSR() {
  const { bubble, chatbar, chatwidget } = await getConfigs();

  return (
    <div className="flex flex-col h-[calc(100vh-114px)] w-full mx-auto p-4">
      <BubbleEditorClient
        bubble={bubble as BubblePixelSettings}
        chatbar={chatbar as ChatbarSettings}
        chatwidget={chatwidget as ChatWidgetSettings}
      />
    </div>
  );
}
