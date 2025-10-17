'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/registry/new-york-v4/ui/tabs";
import BubbleEditorSSR from "@/components/pixel-modifier/BubbleEditor";
import ChatBar from "@/components/pixel-modifier/ChatBarEditor";
import ChatWidgetEditor from "@/components/pixel-modifier/ChatWidgetEditor";
import { useEffect } from "react";
import { useConfigStore } from "@/stores/useConfigStore";

interface PageClientProps {
  configs: any[];
}

export default function PageClient({ configs }: PageClientProps) {
  const { setAllConfigs, widgets } = useConfigStore();

  // ✅ Store all widget configs in Zustand on mount
  useEffect(() => {
    setAllConfigs(configs);
  }, [configs, setAllConfigs]);

  if (widgets.length === 0) return <div>Loading editors...</div>;

  // Just editing first widget for now (can extend to multiple)
  const first = widgets[0];

  return (
    <Tabs defaultValue="bubble" className="w-full">
      <TabsList>
        <TabsTrigger value="bubble">Bubble</TabsTrigger>
        <TabsTrigger value="chat">Chat Bar</TabsTrigger>
        <TabsTrigger value="chatwidgetopen">Chat Widget Open</TabsTrigger>
      </TabsList>

      <TabsContent value="bubble" className="relative">
        <BubbleEditorSSR initialSettings={first.bubblejson} />
      </TabsContent>

      <TabsContent value="chat">
        <ChatBar initialSettings={first.chatbarjson} />
      </TabsContent>

      <TabsContent value="chatwidgetopen">
        <ChatWidgetEditor initialSettings={first.chatwidgetSettings} />
      </TabsContent>
    </Tabs>
  );
}
