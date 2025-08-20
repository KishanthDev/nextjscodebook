"use client";

import { Paperclip, Send, Smile } from "lucide-react";
import { ChatWidgetSettings } from "@/types/Modifier";
import { useState, useEffect, useRef } from "react";
import { useAIConfig } from "@/stores/aiConfig";
import { useDebounce } from "@/hooks/useDebounce";

// Remove surrounding quotes helper
export function removeSurroundingQuotes(text: string) {
  return text.replace(/^"+|"+$/g, "");
}

type Props = {
  settings: ChatWidgetSettings;
  onSend: (message: string) => void;
  onEmojiClick?: () => void;
  onAttachmentClick?: () => void;
  suggestedReply?: string
};

export default function ChatInput({ settings, suggestedReply, onSend, onEmojiClick, onAttachmentClick }: Props) {
  const [message, setMessage] = useState("");
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [userExpressions, setUserExpressions] = useState<string[]>([]);

  const { spellingCorrection, textFormatter, smartReply: smartReplyEnabled, userExpression } = useAIConfig();

  const debouncedMessage = useDebounce(message, 2000);
  const lastCorrectedRef = useRef<string>(""); // tracks last corrected/formatted text
  const sentRef = useRef(false); // prevent effect from firing right after send

  // Handle sending message
  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      lastCorrectedRef.current = "";
      sentRef.current = true; // prevent immediate debounce correction
      setSmartReplies([]);
      setUserExpressions([]);
    }
  };

  useEffect(() => {
    if (suggestedReply) {
      setMessage(suggestedReply);
    }
  }, [suggestedReply]);

  /** Spelling Correction / Text Formatting */
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
        const newText = data.corrected ?? data.result;
        if (newText && newText !== lastCorrectedRef.current) {
          const cleaned = removeSurroundingQuotes(newText);
          setMessage(cleaned);
          lastCorrectedRef.current = cleaned;
        }
      } catch (err) {
        console.error("Text processing failed:", err);
      }
    };
    processText();
  }, [debouncedMessage, spellingCorrection, textFormatter]);

  /** Smart Replies */
  useEffect(() => {
    const fetchSmartReplies = async () => {
      if (!smartReplyEnabled || !message.trim()) return;

      try {
        const res = await fetch("/api/smart-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_text: message.trim() }),
        });
        const data = await res.json();
        if (Array.isArray(data.replies)) setSmartReplies(data.replies.slice(0, 3));
      } catch (err) {
        console.error("Smart replies fetch failed:", err);
      }
    };
    fetchSmartReplies();
  }, [debouncedMessage, smartReplyEnabled]);

  /** User Expressions */
  useEffect(() => {
    const fetchUserExpressions = async () => {
      if (!userExpression || !message.trim()) return;

      try {
        const res = await fetch("/api/user-expressions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message.trim() }),
        });
        const data = await res.json();
        if (Array.isArray(data.expressions)) setUserExpressions(data.expressions.slice(0, 5));
      } catch (err) {
        console.error("User expressions fetch failed:", err);
      }
    };
    fetchUserExpressions();
  }, [debouncedMessage, userExpression]);

  return (
    <div className="flex flex-col gap-2 border-t bg-white px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Input row */}
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

      {/* Smart Replies */}
      {smartReplies.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {smartReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => setMessage(reply)}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* User Expressions */}
      {userExpressions.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {userExpressions.map((expr, idx) => (
            <button
              key={idx}
              onClick={() => setMessage(expr)}
              className="bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-100"
            >
              {expr}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
