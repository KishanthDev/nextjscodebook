'use client';

import { useState, useMemo } from "react";
import clsx from "clsx";

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
            <aside className="w-[220px] border-r bg-gray-50 dark:bg-zinc-900 p-4 flex flex-col gap-4">
                <h2 className="text-lg font-semibold dark:text-white">Settings</h2>

                <CustomerSelect />

                {/* Tabs */}
                <nav className="flex flex-col gap-2 mt-4">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={clsx(
                                "px-3 py-2 rounded-md text-left text-sm font-medium capitalize",
                                activeTab === tab.value
                                    ? "bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-white"
                                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Right Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                {activeTab === "all" ? (
                    <div className="max-w-4xl mx-auto space-y-6">

                        <div>
                            <label className="block font-semibold text-lg mb-2">
                                Choose Setting Type:
                            </label>
                            <div className="flex gap-6 flex-wrap">
                                {[
                                    { value: "eyecatcher", label: "Eyecatcher" },
                                    { value: "bubble", label: "Bubble" },
                                    { value: "chat-bar", label: "Chat Bar" },
                                    { value: "chat-widget-open", label: "Chat Widget Open" },
                                    { value: "chat-widget-greeting", label: "Chat Widget Greeting" },
                                    { value: "chat-widget-contact", label: "Chat Widget Contact" },
                                ].map(({ value, label }) => (
                                    <label key={value} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="settingOption"
                                            value={value}
                                            checked={selectedOption === value}
                                            onChange={(e) => setSelectedOption(e.target.value)}
                                        />
                                        <span className="text-sm font-semibold">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        {selectedOption === "bubble" && (
                            <div className="mt-4">
                                <BubbleMain
                                    key={selectedBubble?._id}
                                    initialSettings={selectedBubble?.bubbleSettings || {}}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-lg text-gray-600 dark:text-gray-300">
                        <div className="pb-6">
                            {/* Widget Select (conditional on customer) */}
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
