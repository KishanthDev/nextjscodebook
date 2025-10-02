"use client";

import { useState } from "react";
import clsx from "clsx";

import Bubble from "@/components/modifier/bubble";
import ChatBar from "@/components/modifier/chatBar/chatBarModifier";
import ChatWidgetOpen from "@/components/modifier/chat-widget/ChatWidgetOpenComponent";
import Eyecatcher from "@/components/modifier/eye-catcher";
import Greeting from "@/components/modifier/greeting";
import ChatWidgetContactComponent from "@/components/modifier/chat-widget-contact/ChatWidgetContactComponent";

import EyecatcherPreview from "@/app/(app)/eye-catcher/page";
import BubblePreview from "@/app/(app)/bubble/page";
import ChatBarPreview from "@/app/(app)/chat-bar/page";
import ChatWidgetPreview from "@/app/(app)/chat-widget-open/page";
import ChatWidgetContactPreview from "@/app/(app)/chat-contact-preview/page";
import GreetingPreview from "@/app/(app)/greeting/page";
import { AppSettings } from "@/types/Modifier";

const TABS = [
  { label: "All", value: "all" },
  { value: "eyecatcher", label: "Eyecatcher" },
  { value: "bubble", label: "Bubble" },
  { value: "chat-bar", label: "Chat Bar" },
  { value: "chat-widget-open", label: "Chat Widget Open" },
  { value: "chat-widget-greeting", label: "Chat Widget Greeting" },
  { value: "chat-widget-contact", label: "Chat Widget Contact" },
];

type Props = {
  initialSettings: AppSettings;
};

export default function ModifierClient({ initialSettings }: Props) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOption, setSelectedOption] = useState("eyecatcher");

  // Directly use the initialSettings prop for SSR-friendly display
  const settings = initialSettings;

  if (!settings) {
    return <div className="p-6">Loading settings...</div>;
  }

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case "eyecatcher":
        return <Eyecatcher defaultSettings={settings.eyeCatcher} />;
      case "bubble":
        return <Bubble defaultSettings={settings.bubble} />;
      case "chat-bar":
        return <ChatBar defaultSettings={settings.chatBar} />;
      case "chat-widget-open":
        return (
          <ChatWidgetOpen
            defaultSettings={settings.chatWidget}
            initialMessages={settings.chatWidget.messages}
          />
        );
      case "chat-widget-contact":
        return (
          <ChatWidgetContactComponent
            defaultSettings={settings.chatWidgetContact}
            initialMessages={settings.chatWidgetContact.messages}
          />
        );
      case "chat-widget-greeting":
        return <Greeting defaultSettings={settings.greeting} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left Sidebar */}
      <aside className="w-[220px] border-r bg-gray-50 dark:bg-zinc-900 p-4">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Settings</h2>
        <nav className="flex flex-col gap-2">
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
            <div>{renderSelectedComponent()}</div>
          </div>
        ) : (
          <div className="text-lg text-gray-600 dark:text-gray-300">
            {activeTab === "eyecatcher" && <EyecatcherPreview defaultSettings={settings.eyeCatcher} />}
            {activeTab === "bubble" && <BubblePreview defaultSettings={settings.bubble} />}
            {activeTab === "chat-bar" && <ChatBarPreview defaultSettings={settings.chatBar} />}
            {activeTab === "chat-widget-open" && <ChatWidgetPreview defaultSettings={settings.chatWidget} />}
            {activeTab === "chat-widget-contact" && <ChatWidgetContactPreview defaultSettings={settings.chatWidgetContact} />}
            {activeTab === "chat-widget-greeting" && <GreetingPreview defaultSettings={settings.greeting} />}
          </div>
        )}
      </main>
    </div>
  );
}
