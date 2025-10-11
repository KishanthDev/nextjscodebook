'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/registry/new-york-v4/ui/tabs";
import BubbleModifier from '@/components/pixel-modifier/BubbleEditor';
import ChatBar from '@/components/pixel-modifier/ChatBarEditor';

function ChatWidgetOpen(){
    return (
        <div className="">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition">
                Open Chat
            </button>
        </div>
    );
}

export default function Page() {
    return (
        <div className="flex flex-col h-[calc(100vh-114px)] w-full mx-auto p-4">
            <Tabs defaultValue="bubble" className="w-full">
                <TabsList>
                    <TabsTrigger value="bubble">Bubble</TabsTrigger>
                    <TabsTrigger value="chat">Chat Bar</TabsTrigger>
                    <TabsTrigger value="chatwidgetopen">Chat Widget Open</TabsTrigger>
                </TabsList>

                <TabsContent value="bubble">
                    <BubbleModifier />
                </TabsContent>

                <TabsContent value="chat">
                    <ChatBar />
                </TabsContent>

                <TabsContent value="chatwidgetopen">
                    <ChatWidgetOpen />
                </TabsContent>
            </Tabs>
        </div>
    );
}
