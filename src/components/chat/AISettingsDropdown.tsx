"use client";

import { useState } from "react";
import { useAIConfig } from "@/stores/aiConfig";

export default function AISettingsDropdown() {
  const [open, setOpen] = useState(false);
  const { spellingCorrection, smartReply, textFormatter, userExpression, AIReply, toggleFeature } =
    useAIConfig();

  const features = {
    spellingCorrection,
    smartReply,
    textFormatter,
    userExpression,
    AIReply,
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
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border rounded shadow-lg z-10 p-2 flex flex-col gap-2">
          {Object.entries(features).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="capitalize">{key}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleFeature(key as keyof typeof features)}
                  className="sr-only"
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors"></div>
                <div
                  className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    value ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
