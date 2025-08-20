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
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const { spellingCorrection, textFormatter, smartReply } = useAIConfig();
  const debouncedMessage = useDebounce(message, 2000);

  const lastCorrectedRef = useRef<string>("");
  const sentRef = useRef(false);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      lastCorrectedRef.current = "";
      sentRef.current = true;
      setSmartReplies([]);
    }
  };

  // Handle spelling correction / text formatting
  useEffect(() => {
    const processText = async () => {
      const textToProcess = debouncedMessage.trim();
      if (!textToProcess || textToProcess === lastCorrectedRef.current) return;
      if (sentRef.current) {
        sentRef.current = false;
        return;
      }

      let endpoint = "";
      if (spellingCorrection) endpoint = "/api/correct-spelling";
      if (textFormatter) endpoint = "/api/text-format";

      if (!endpoint) return;

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_text: textToProcess }),
        });
        const data = await res.json();
        const newText = data.corrected || data.result;
        if (newText && newText !== message) {
          const cleaned = removeSurroundingQuotes(newText);
          setMessage(cleaned);
          lastCorrectedRef.current = cleaned;
        }
      } catch (err) {
        console.error("Text processing failed:", err);
      }
    };

    processText();
  }, [debouncedMessage, spellingCorrection, textFormatter, message]);

  // Fetch smart replies
  useEffect(() => {
    const fetchSmartReplies = async () => {
      if (!smartReply || !message.trim()) return;

      try {
        const res = await fetch("/api/smart-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_text: message.trim() }),
        });
        const data = await res.json();
        if (Array.isArray(data.replies)) {
          setSmartReplies(data.replies);
        }
      } catch (err) {
        console.error("Smart reply fetch failed:", err);
      }
    };

    fetchSmartReplies();
  }, [debouncedMessage, smartReply]);

  return (
    <div className="flex flex-col gap-2 border-t bg-white px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-2">
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

      {/* Smart reply buttons */}
      <div className="flex gap-2 flex-wrap">
        {smartReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => setMessage(reply)} // fills input box
            className="bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 px-3 py-1 rounded-full text-sm"
          >
            {reply}
          </button>
        ))}
      </div>

    </div>
  );
}
