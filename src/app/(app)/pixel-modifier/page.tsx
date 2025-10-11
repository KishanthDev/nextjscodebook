'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/registry/new-york-v4/ui/tabs";
import BubbleModifier from '@/components/pixel-modifier/BubbleEditor';
import ChatBar from '@/components/pixel-modifier/ChatBarEditor';
import ChatWidgetEditor from "../../../components/pixel-modifier/ChatWidgetEditor";


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
                    <ChatWidgetEditor />
                </TabsContent>
            </Tabs>
        </div>
    );
}
