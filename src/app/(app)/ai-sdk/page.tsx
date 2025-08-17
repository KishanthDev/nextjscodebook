"use client";

import { useState } from "react";
import clsx from "clsx";

const Message = () => {
  const [text, setText] = useState("");

  async function fetchText() {
    const res = await fetch("/api/sdk/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "What is ai?" }),
    });
    const data = await res.json();
    setText(data.text);
  }
  async function systemPromt() {
    const res = await fetch("/api/sdk/system-prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "What is ai?" }),
    });
    const data = await res.json();
    setText(data.text);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Message Component</h1>
      <button
        onClick={fetchText}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Ask OpenAI Generate
      </button>
      <button
        onClick={systemPromt}
        className="px-4 py-2 ml-10 bg-blue-500 text-white rounded"
      >
        Ask OpenAI System Prompts
      </button>
      <p className="mt-4">{text}</p>
    </div>
  );
};


// Define all tabs in one place
const tabs = [
  {
    id: 'message',
    label: 'Message',
    component: <Message />
  },
];

export default function OpenAIPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <div className="w-[150px] border-r p-2 bg-gray-50 dark:bg-zinc-900">
        <nav className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'text-left px-3 py-2 rounded-md text-sm font-medium capitalize',
                {
                  'bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-white':
                    activeTab === tab.id,
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800':
                    activeTab !== tab.id,
                }
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeComponent}
      </div>
    </div>
  );
}
