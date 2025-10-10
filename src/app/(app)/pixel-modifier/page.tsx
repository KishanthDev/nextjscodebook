'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/registry/new-york-v4/ui/tabs";
import BubbleModifier from '@/components/pixel-modifier/pixel';
import ChatBar from '@/components/pixel-modifier/CharBar';

export default function Page() {
    return (
        <div className="flex flex-col h-[calc(100vh-114px)] w-full mx-auto p-4">
            <Tabs defaultValue="bubble" className="w-full">
                <TabsList>
                    <TabsTrigger value="bubble">Bubble</TabsTrigger>
                    <TabsTrigger value="chat">Chat Bar</TabsTrigger>
                </TabsList>

                <TabsContent value="bubble">
                    <BubbleModifier />
                </TabsContent>

                <TabsContent value="chat">
                    <ChatBar />
                </TabsContent>
            </Tabs>
        </div>
    );
}
