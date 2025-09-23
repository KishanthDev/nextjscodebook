"use client";

import { useState } from "react";
import { useAIConfig } from "@/stores/aiConfig";
import { Switch } from "@/ui/switch";

export default function AISettingsDropdown() {
  const [open, setOpen] = useState(false);
  const {
    spellingCorrection,
    smartReply,
    textFormatter,
    userExpression,
    openaiReply,
    openaiGenerate,
    humanTakeOver,
    toggleFeature,
  } = useAIConfig();

  const features = {
    spellingCorrection,
    smartReply,
    textFormatter,
    userExpression,
    openaiGenerate,
    openaiReply,
    humanTakeOver,
  };

  // 🔹 Labels mapping
  const labels: Record<keyof typeof features, string> = {
    spellingCorrection: "Spelling Correction",
    smartReply: "Smart Reply",
    textFormatter: "Text Formatter",
    userExpression: "User Expression",
    openaiGenerate: "Human Monitored",
    openaiReply: "AI Assistant",
    humanTakeOver: "Human Takeover",
  };

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-2 border rounded bg-white dark:bg-zinc-800 dark:text-white focus:outline-none"
      >
        AI ▼
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 border rounded shadow-lg z-10 p-3 flex flex-col gap-3">
          {Object.entries(features).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span>{labels[key as keyof typeof features]}</span>
              <Switch
                checked={value}
                onCheckedChange={() =>
                  toggleFeature(key as keyof typeof features)
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
