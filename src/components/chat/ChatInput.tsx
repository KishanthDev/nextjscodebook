"use client";

import { MessageCircleReplyIcon, Paperclip, Send, Smile } from "lucide-react";
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
  const rawInputRef = useRef("");
  /** Spelling Correction / Text Formatting */
  useEffect(() => {
    const processText = async () => {
      const textToProcess = debouncedMessage.trim();
      if (!textToProcess || textToProcess === rawInputRef.current) return;
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
        if (newText) {
          const cleaned = removeSurroundingQuotes(newText);
          setMessage(cleaned);
          rawInputRef.current = textToProcess; // ✅ track last raw input
        }
      } catch (err) {
        console.error("Text processing failed:", err);
      }
    };

    processText(); // ✅ make sure it runs
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
    <div className="m-2 w-[97%]">
      {/* Row: Input (with border) + Send Btn outside */}
      <div className="flex items-center">
        {/* Typing area inside border */}
        <div className="flex-1 border rounded-lg px-4 pt-2 pb-8 relative">
          {/* Input */}
          <input
            type="text"
            placeholder={settings.inputPlaceholder || "Write a message..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full bg-transparent text-black dark:text-white 
                     placeholder-gray-400 dark:placeholder-gray-500 
                     focus:outline-none pr-20"
          />

          {/* Emoji + Attachments bottom-right */}
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              title="emoji"
              onClick={onEmojiClick}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <Smile size={20} style={{ color: settings.sendBtnIconColor }} />
            </button>
            <button
              title="attachment"
              onClick={onAttachmentClick}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <Paperclip size={20} style={{ color: settings.sendBtnIconColor }} />
            </button>
            <button
              title="reply"
              onClick={onEmojiClick}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <MessageCircleReplyIcon size={20} style={{ color: settings.sendBtnIconColor }} />
            </button>
          </div>
        </div>

        {/* Send button right OUTSIDE */}
        <button
          title="send"
          onClick={handleSend}
          disabled={!message.trim()}
          className="ml-2 rounded-full p-2 transition-colors"
          style={{
            backgroundColor: message.trim()
              ? settings.sendBtnBgColor
              : "transparent",
            color: settings.sendBtnIconColor,
          }}
        >
          <Send size={20} />
        </button>
      </div>

      {/* Smart Replies + User Expressions BELOW, centered */}
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {smartReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => setMessage(reply)}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg 
                     hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100"
          >
            {reply}
          </button>
        ))}

        {userExpressions.map((expr, idx) => (
          <button
            key={idx}
            onClick={() => setMessage(expr)}
            className="bg-green-100 text-green-800 px-3 py-1 rounded-lg 
                     hover:bg-green-200 dark:bg-green-900 dark:text-green-100"
          >
            {expr}
          </button>
        ))}
      </div>
    </div>
  );
}