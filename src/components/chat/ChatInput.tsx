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
  suggestedReply?: string;
};

export default function ChatInput({
  settings,
  suggestedReply,
  onSend,
  onEmojiClick,
  onAttachmentClick,
}: Props) {
  const [message, setMessage] = useState("");
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [userExpressions, setUserExpressions] = useState<string[]>([]);
  const [showSmartReplies, setShowSmartReplies] = useState(false);

  const { spellingCorrection, textFormatter, smartReply: smartReplyEnabled, userExpression } = useAIConfig();

  const debouncedMessage = useDebounce(message, 2000);
  const lastCorrectedRef = useRef<string>("");
  const sentRef = useRef(false);

  /** Handle sending message */
  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      lastCorrectedRef.current = "";
      sentRef.current = true;
      setSmartReplies([]);
      setUserExpressions([]);
      setShowSmartReplies(false);
    }
  };

  /** Handle suggested reply */
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
          rawInputRef.current = textToProcess;
        }
      } catch (err) {
        console.error("Text processing failed:", err);
      }
    };

    processText();
  }, [debouncedMessage, spellingCorrection, textFormatter]);

  /** Fetch Smart Replies (popup) */
const fetchSmartReplies = async (prompt?: string) => {
  if (!smartReplyEnabled) return;
  try {
    const res = await fetch("/api/smart-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input_text: prompt || message.trim() }),
    });

    if (!res.ok) throw new Error("Failed to fetch smart replies");
    const data = await res.json();

    if (Array.isArray(data.replies)) {
      setSmartReplies(data.replies.slice(0, 3));
    }
  } catch (err) {
    console.error("Error fetching smart replies:", err);
  }
};


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
      {/* Row: Input (bordered) + Send Btn outside */}
      <div className="flex items-center relative">
        <div className="flex-1 border rounded-lg px-4 pt-2 pb-8 relative">
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

          {/* Emoji + Attachments + Reply (popup trigger) */}
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

            {/* Reply popup */}
            <div className="relative">
              <button
                title="reply"
                onClick={async () => {
                  try {
                    await fetchSmartReplies(); // always try fetch
                    setShowSmartReplies((prev) => !prev);
                  } catch (err) {
                    console.error("Smart reply fetch failed:", err);
                  }
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <MessageCircleReplyIcon size={20} style={{ color: settings.sendBtnIconColor }} />
              </button>

              {showSmartReplies && (
                <div className="absolute bottom-8 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-10 min-w-[200px]">
                  {smartReplies.length > 0 ? (
                    smartReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setMessage(reply);
                          setShowSmartReplies(false);
                        }}
                        className="block w-full text-left px-3 py-1 rounded-md 
                          hover:bg-gray-100 dark:hover:bg-gray-700 
                          text-gray-800 dark:text-gray-200"
                      >
                        {reply}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                      Loading smart replies...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Send button OUTSIDE */}
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

      {/* User Expressions BELOW */}
      {userExpressions.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
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
      )}
    </div>
  );
}
