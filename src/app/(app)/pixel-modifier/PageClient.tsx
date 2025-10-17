'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/registry/new-york-v4/ui/tabs";
import BubbleEditorSSR from "@/components/pixel-modifier/BubbleEditor";
import ChatBar from "@/components/pixel-modifier/ChatBarEditor";
import ChatWidgetEditor from "@/components/pixel-modifier/ChatWidgetEditor";
import WidgetDropdown from "@/components/pixel-modifier/lib/Dropdown";
import { useConfigStore } from "@/stores/useConfigStore";
import { useEffect } from "react";
import { AddWidgetButton } from "@/components/pixel-modifier/lib/AddWidgetButton";
import { DeleteWidgetButton } from "@/components/pixel-modifier/lib/DeleteButton";

export default function PageClient({ configs }: { configs: any[] }) {
  const { setAllConfigs, getCurrentWidget } = useConfigStore();

  // Store all widgets in Zustand on mount
  useEffect(() => {
    setAllConfigs(configs);
  }, [configs, setAllConfigs]);

  const current = getCurrentWidget();

  if (!current) return <div>Loading widgets...</div>;
  console.log(current);


  return (
    <div className="flex flex-col w-full h-[calc(100vh-114px)] mx-auto p-4">
      {/* Dropdown to select which widget to edit */}
      <WidgetDropdown />
<AddWidgetButton/>
<DeleteWidgetButton/>
      <Tabs defaultValue="bubble" className="w-full flex-1 mt-4">
        <TabsList>
          <TabsTrigger value="bubble">Bubble</TabsTrigger>
          <TabsTrigger value="chat">Chat Bar</TabsTrigger>
          <TabsTrigger value="chatwidgetopen">Chat Widget Open</TabsTrigger>
        </TabsList>

        <TabsContent value="bubble" className="relative">
          <BubbleEditorSSR key={current.id} initialSettings={current.bubblejson} />
        </TabsContent>

        <TabsContent value="chat">
          <ChatBar key={current.id} initialSettings={current.chatbarjson} />
        </TabsContent>

        <TabsContent value="chatwidgetopen">
          <ChatWidgetEditor key={current.id} initialSettings={current.chatwidgetSettings} />
        </TabsContent>

      </Tabs>
    </div>
  );
}
