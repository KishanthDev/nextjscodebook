'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/registry/new-york-v4/ui/tabs";
import BubbleEditorSSR from "@/components/pixel-modifier/BubbleEditor";
import ChatBar from "@/components/pixel-modifier/ChatBarEditor";
import ChatWidgetEditor from "@/components/pixel-modifier/ChatWidgetEditor";
import { useEffect } from "react";
import { useConfigStore } from "@/stores/useConfigStore";
import { BubblePixelSettings } from "@/components/pixel-modifier/bubble/bubbletype";
import { ChatbarSettings } from "@/components/pixel-modifier/chatbar/chatbartype";
import { ChatWidgetSettings } from "@/components/pixel-modifier/chatwidget/chat-widget-types";

interface PageClientProps {
  bubble: BubblePixelSettings;
  chatbar: ChatbarSettings;
  chatwidget: ChatWidgetSettings;
}

export default function PageClient({ bubble, chatbar, chatwidget }: PageClientProps) {
  const { setBubble, setChatbar, setChatwidget } = useConfigStore();

  useEffect(() => {
    setBubble(bubble);
    setChatbar(chatbar);
    setChatwidget(chatwidget);
  }, [bubble, chatbar, chatwidget, setBubble, setChatbar, setChatwidget]);

  const store = useConfigStore();
  const { bubble: bubbleStore, chatbar: chatbarStore, chatwidget: chatwidgetStore } = store;

  if (!bubbleStore || !chatbarStore || !chatwidgetStore) return <div>Loading editors...</div>;

  return (
    <Tabs defaultValue="bubble" className="w-full">
      <TabsList>
        <TabsTrigger value="bubble">Bubble</TabsTrigger>
        <TabsTrigger value="chat">Chat Bar</TabsTrigger>
        <TabsTrigger value="chatwidgetopen">Chat Widget Open</TabsTrigger>
      </TabsList>

      <TabsContent value="bubble">
        <BubbleEditorSSR initialSettings={bubbleStore} />
      </TabsContent>

      <TabsContent value="chat">
        <ChatBar initialSettings={chatbarStore} />
      </TabsContent>

      <TabsContent value="chatwidgetopen">
        <ChatWidgetEditor initialSettings={chatwidgetStore} />
      </TabsContent>
    </Tabs>
  );
}
