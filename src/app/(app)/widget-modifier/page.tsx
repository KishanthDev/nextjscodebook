'use client';

import { useState, useMemo } from "react";
import clsx from "clsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/registry/new-york-v4/ui/tabs";

import BubblePreview from "@/components/widget-builder/bubble/BubblePreview";
import ChatBarPreview from "@/components/widget-builder/chatbar/ChatBarPreview";
import ChatWidgetPreview from "@/components/widget-builder/chatwidget/ChatWidgetPreview";

import { useCustomerStore } from "@/components/widget-builder/poc/useCustomerStore";
import WidgetSelect from "@/components/widget-builder/WidgetSelect";

// sample defaults (replace with your API/data)
import newBubbleJson from "@/defaults/newbubble.json";
import { BubbleWidget, ChatBarWidget, ChatWidgetOpen } from "@/components/widget-builder/widgetTypes";
import newChatBarJson from "@/defaults/newchatbar.json";
import newChatWidgetJson from "@/defaults/newchatwidget.json";
import CustomerSelect from "@/components/widget-builder/poc/CustomerSelect";
import BubbleMain from "@/components/widget-modifier/bubble/BubbleMain";
import EyecatcherMain from "@/components/widget-modifier/eyecatcher/EyecatcherMain";
import ChatBarMain from "@/components/widget-modifier/chatbar/ChatBarMain";
import ChatWidgetMain from "@/components/widget-modifier/chatwidget/ChatWidgetMain";
import GreetingMain from "@/components/widget-modifier/greeting/GreetingMain";
import ContactMain from "@/components/widget-modifier/contact/ContactMain";

const TABS = [
    { label: "All", value: "all" },
    { value: "bubble", label: "Bubble" },
    { value: "chat-bar", label: "Chat Bar" },
    { value: "chat-widget-open", label: "Chat Widget Open" },
];

export default function Page() {
    const [activeTab, setActiveTab] = useState("all");

    const [selectedOption, setSelectedOption] = useState("eyecatcher");

    // Customer selection
    const { selectedCustomer } = useCustomerStore();

    // Local state for selected items of each type
    const newBubble: BubbleWidget[] = newBubbleJson as unknown as BubbleWidget[];
    const newChatBar: ChatBarWidget[] = newChatBarJson as unknown as ChatBarWidget[];
    const newChatWidget: ChatWidgetOpen[] = newChatWidgetJson as unknown as ChatWidgetOpen[];

    const [selectedBubble, setSelectedBubble] = useState(newBubble[0]);
    const [selectedChatBar, setSelectedChatBar] = useState(newChatBar[0]);
    const [selectedChatWidget, setSelectedChatWidget] = useState(newChatWidget[0]);

    return (
        <div className="flex h-[calc(100vh-3.5rem)]">
            {/* Left Sidebar */}
            <aside className="w-[190px] border-r bg-gray-50 dark:bg-zinc-900 p-4 flex flex-col gap-4">
                <h2 className="text-normal font-semibold dark:text-white">---- Select User ----</h2>

                <CustomerSelect />

                <hr />

                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                    <TabsList className="flex flex-col w-full gap-1 mt-15 bg-transparent p-0">
                        {TABS.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={clsx(
                                    "w-full justify-start px-3 py-2 rounded-md text-sm font-medium capitalize",
                                    "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900",
                                    "dark:data-[state=active]:bg-blue-800 dark:data-[state=active]:text-white"
                                )}
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </aside>

            {/* Right Content */}
            <main className="flex-1 overflow-y-auto">
                {activeTab === "all" ? (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="mt-5">
                            <Tabs value={selectedOption} onValueChange={setSelectedOption}>
                                {/* Tabs Header */}
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    {/* Left: TabsList */}
                                    <TabsList className="flex flex-wrap gap-2">
                                        <TabsTrigger value="bubble">Bubble</TabsTrigger>
                                        <TabsTrigger value="chat-bar">Chat Bar</TabsTrigger>
                                        <TabsTrigger value="chat-widget-open">Chat Widget Open</TabsTrigger>
                                        <TabsTrigger value="eyecatcher">Eyecatcher</TabsTrigger>
                                        <TabsTrigger value="chat-widget-greeting">Greeting</TabsTrigger>
                                        <TabsTrigger value="chat-widget-contact">Contact</TabsTrigger>
                                    </TabsList>

                                    {/* Right: WidgetSelect (changes dynamically per tab) */}
                                    <div className="ml-auto">
                                        {selectedOption === "bubble" && (
                                            <WidgetSelect
                                                type="bubble"
                                                selectedId={selectedBubble._id}
                                                onSelect={setSelectedBubble}
                                            />
                                        )}

                                        {selectedOption === "chat-bar" && (
                                            <WidgetSelect
                                                type="chat"
                                                selectedId={selectedChatBar._id}
                                                onSelect={setSelectedChatBar}
                                            />
                                        )}

                                        {selectedOption === "chat-widget-open" && (
                                            <WidgetSelect
                                                type="chatwidgetopen"
                                                selectedId={selectedChatWidget._id}
                                                onSelect={setSelectedChatWidget}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Tabs Content */}
                                <div className="mt-4">
                                    <TabsContent value="bubble">
                                        <BubbleMain
                                            key={selectedBubble?._id}
                                            initialSettings={selectedBubble?.bubbleSettings || {}}
                                        />
                                    </TabsContent>

                                    <TabsContent value="chat-bar">
                                        <ChatBarMain
                                            key={selectedChatBar?._id}
                                            initialSettings={selectedChatBar?.chatBarSettings || {}}
                                        />
                                    </TabsContent>

                                    <TabsContent value="chat-widget-open">
                                        <ChatWidgetMain
                                            key={selectedChatWidget?._id}
                                            initialSettings={selectedChatWidget?.chatwidgetSettings || {}}
                                        />
                                    </TabsContent>

                                    <TabsContent value="eyecatcher">
                                        <EyecatcherMain />
                                    </TabsContent>

                                    <TabsContent value="chat-widget-greeting">
                                        <GreetingMain />
                                    </TabsContent>

                                    <TabsContent value="chat-widget-contact">
                                        <ContactMain />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>

                ) : (
                    <div className="text-lg text-gray-600 dark:text-gray-300">
                        <div className="p-6">
                            {selectedCustomer && activeTab !== "all" && (
                                <>
                                    {activeTab === "bubble" && (
                                        <WidgetSelect
                                            type="bubble"
                                            selectedId={selectedBubble._id}
                                            onSelect={setSelectedBubble}
                                        />
                                    )}

                                    {activeTab === "chat-bar" && (
                                        <WidgetSelect
                                            type="chat"
                                            selectedId={selectedChatBar._id}
                                            onSelect={setSelectedChatBar}
                                        />
                                    )}

                                    {activeTab === "chat-widget-open" && (
                                        <WidgetSelect
                                            type="chatwidgetopen"
                                            selectedId={selectedChatWidget._id}
                                            onSelect={setSelectedChatWidget}
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        {activeTab === "bubble" && <BubblePreview settings={selectedBubble?.bubbleSettings || {}} />}
                        {activeTab === "chat-bar" && <ChatBarPreview settings={selectedChatBar?.chatBarSettings || {}} />}
                        {activeTab === "chat-widget-open" && <ChatWidgetPreview settings={selectedChatWidget?.chatwidgetSettings || {}} />}
                    </div>
                )}
            </main>
        </div>
    );
}
