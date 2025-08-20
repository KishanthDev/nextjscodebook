"use client";

import { Paperclip, Send, Smile } from "lucide-react";
import { ChatWidgetSettings } from "@/types/Modifier";
import { useState, useEffect, useRef } from "react";
import { useAIConfig } from "@/stores/aiConfig";
import { useDebounce } from "@/hooks/useDebounce";

// Remove surrounding quotes
export function removeSurroundingQuotes(text: string) {
  return text.replace(/^"+|"+$/g, "");
}


type Props = {
  settings: ChatWidgetSettings;
  onSend: (message: string) => void;
  onEmojiClick?: () => void;
  onAttachmentClick?: () => void;
};

export default function ChatInput({ settings, onSend, onEmojiClick, onAttachmentClick }: Props) {
  const [message, setMessage] = useState("");
  const { spellingCorrection } = useAIConfig();
  const debouncedMessage = useDebounce(message, 2000);

  // Track last corrected message to avoid repeat API calls
  const lastCorrectedRef = useRef<string>("");

  const sentRef = useRef(false);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      lastCorrectedRef.current = ""; // reset last corrected
      sentRef.current = true; // mark that we just sent
    }
  };

  useEffect(() => {
    const fixSpelling = async () => {
      if (!spellingCorrection) return;
      const textToCorrect = debouncedMessage.trim();
      if (!textToCorrect || textToCorrect === lastCorrectedRef.current) return;

      // Skip if we just sent a message
      if (sentRef.current) {
        sentRef.current = false; // reset flag
        return;
      }

      try {
        const res = await fetch("/api/correct-spelling", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_text: textToCorrect }),
        });
        const data = await res.json();
        if (data.corrected && data.corrected !== message) {
          const cleaned = removeSurroundingQuotes(data.corrected);
          setMessage(cleaned);
          lastCorrectedRef.current = cleaned;
        }
      } catch (err) {
        console.error("Spelling correction failed:", err);
      }
    };

    fixSpelling();
  }, [debouncedMessage, spellingCorrection, message]);

  return (
    <div className="flex items-center gap-2 border-t bg-white px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900">
      <button
        title="emoji"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
        onClick={onEmojiClick}
      >
        <Smile size={20} style={{ color: settings.sendBtnIconColor }} />
      </button>
      <button
        title="attachment"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
        onClick={onAttachmentClick}
      >
        <Paperclip size={20} style={{ color: settings.sendBtnIconColor }} />
      </button>
      <input
        type="text"
        placeholder={settings.inputPlaceholder || "Type your message..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
      />
      <button
        title="send"
        className="rounded-lg p-1"
        style={{
          backgroundColor: message.trim() ? settings.sendBtnBgColor : "transparent",
          color: settings.sendBtnIconColor,
        }}
        onClick={handleSend}
        disabled={!message.trim()}
      >
        <Send size={20} />
      </button>
    </div>
  );
}
