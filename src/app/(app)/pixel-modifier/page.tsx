import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/registry/new-york-v4/ui/tabs";
import BubbleEditorSSR from '@/components/pixel-modifier/BubbleEditor';
import ChatBar from '@/components/pixel-modifier/ChatBarEditor';
import ChatWidgetEditor from '@/components/pixel-modifier/ChatWidgetEditor';

import bubbleDefaultsJSON from '@/defaults/bubble.json';
import chatBarDefaultsJSON from '@/defaults/chatbar.json';
import chatWidgetDefaultsJSON from '@/defaults/chatwidget.json';
import { BubblePixelSettings } from '@/components/pixel-modifier/bubble/bubbletype';
import { ChatbarSettings } from '@/components/pixel-modifier/chatbar/chatbartype';
import { ChatWidgetSettings } from '@/components/pixel-modifier/chatwidget/chat-widget-types';

export default function Page() {

    const bubbleDefaults = bubbleDefaultsJSON as BubblePixelSettings;
    const chatBarDefaults = chatBarDefaultsJSON as ChatbarSettings;
    const chatWidgetDefaults = chatWidgetDefaultsJSON as ChatWidgetSettings;

    return (
        <div className="flex flex-col h-[calc(100vh-114px)] w-full mx-auto p-4">
            <Tabs defaultValue="bubble" className="w-full">
                <TabsList>
                    <TabsTrigger value="bubble">Bubble</TabsTrigger>
                    <TabsTrigger value="chat">Chat Bar</TabsTrigger>
                    <TabsTrigger value="chatwidgetopen">Chat Widget Open</TabsTrigger>
                </TabsList>

                <TabsContent value="bubble">
                    <BubbleEditorSSR initialSettings={bubbleDefaults} />
                </TabsContent>

                <TabsContent value="chat">
                    <ChatBar initialSettings={chatBarDefaults} />
                </TabsContent>

                <TabsContent value="chatwidgetopen">
                    <ChatWidgetEditor initialSettings={chatWidgetDefaults} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
