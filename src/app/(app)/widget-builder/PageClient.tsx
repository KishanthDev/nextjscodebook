'use client';

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/registry/new-york-v4/ui/tabs";
import BubbleEditorSSR from "@/components/widget-builder/BubbleEditor";
import ChatBar from "@/components/widget-builder/ChatBarEditor";
import ChatWidgetEditor from "@/components/widget-builder/ChatWidgetEditor";
import { useConfigStore } from "@/stores/useConfigStore";
import { AddWidgetButton } from "@/components/widget-builder/lib/AddWidgetButton";
import { DeleteWidgetButton } from "@/components/widget-builder/lib/DeleteButton";
import EyecatcherMain from "@/components/widget-builder/eyecatcher/EyecatcherMain";
import GreetingMain from "@/components/widget-builder/greeting/GreetingMain";
import CustomerSelect from "@/components/widget-builder/poc/CustomerSelect";
import ChatWidgetMain from "@/components/widget-builder/contact/ChatWidgetMain";
import WidgetSelect from "@/components/widget-builder/WidgetSelect";

// sample defaults
import newBubbleJson from "@/defaults/newbubble.json";
import { BubbleWidget, ChatBarWidget, ChatWidgetOpen } from "@/components/widget-builder/widgetTypes";
import newChatBarJson from "@/defaults/newchatbar.json";
import newChatWidgetJson from "@/defaults/newchatwidget.json";

export default function PageClient({ configs }: { configs: any[] }) {
  const { setAllConfigs, getCurrentWidget } = useConfigStore();

  const [activeTab, setActiveTab] = useState("bubble");

  // Local state for selected items of each type
  const newBubble: BubbleWidget[] = newBubbleJson as unknown as BubbleWidget[];
  const newChatBar: ChatBarWidget[] = newChatBarJson as unknown as ChatBarWidget[];
  const newChatWidget: ChatWidgetOpen[] = newChatWidgetJson as unknown as ChatWidgetOpen[];

  const [selectedBubble, setSelectedBubble] = useState(newBubble[0]);
  const [selectedChatBar, setSelectedChatBar] = useState(newChatBar[0]);
  const [selectedChatWidget, setSelectedChatWidget] = useState(newChatWidget[0]);

  useEffect(() => {
    setAllConfigs(configs);
  }, [configs, setAllConfigs]);

  const current = getCurrentWidget();
  if (!current) return <div>Loading widgets...</div>;


  return (
    <div className="flex flex-col w-full h-[calc(100vh-114px)] mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="bubble">Bubble</TabsTrigger>
            <TabsTrigger value="chat">Chat Bar</TabsTrigger>
            <TabsTrigger value="chatwidgetopen">Chat Widget Open</TabsTrigger>
            <TabsTrigger value="eyecatcher">Eye Catcher</TabsTrigger>
            <TabsTrigger value="greeting">Greeting</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <CustomerSelect />
            {activeTab === "bubble" && (
              <WidgetSelect
                type="bubble"
                selectedId={selectedBubble._id}
                onSelect={setSelectedBubble}
              />
            )}
            {activeTab === "chat" && (
              <WidgetSelect
                type="chat"
                selectedId={selectedChatBar._id}
                onSelect={setSelectedChatBar}
              />
            )}
            {activeTab === "chatwidgetopen" && (
              <WidgetSelect
                type="chatwidgetopen"
                selectedId={selectedChatWidget._id}
                onSelect={setSelectedChatWidget}
              />
            )}
            <AddWidgetButton />
            <DeleteWidgetButton />
          </div>

        </div>

        <TabsContent value="bubble">
          <BubbleEditorSSR
            key={selectedBubble?._id}
            initialSettings={selectedBubble?.bubbleSettings || {}}
          />
        </TabsContent>

        <TabsContent value="chat">
          <ChatBar
            key={selectedChatBar?._id}
            initialSettings={selectedChatBar?.chatBarSettings || {}}
          />
        </TabsContent>

        <TabsContent value="chatwidgetopen">
          <ChatWidgetEditor
            key={selectedChatWidget?._id}
            initialSettings={selectedChatWidget?.chatwidgetSettings || {}}
          />
        </TabsContent>


        {/* Other Tabs */}
        <TabsContent value="eyecatcher">
          <EyecatcherMain />
        </TabsContent>

        <TabsContent value="greeting">
          <GreetingMain />
        </TabsContent>

        <TabsContent value="contact">
          <ChatWidgetMain />
        </TabsContent>
      </Tabs>
    </div>
  );
}
