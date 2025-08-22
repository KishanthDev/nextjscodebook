"use client";

import { useState, useEffect, useRef } from "react";
import { useAIConfig } from "@/stores/aiConfig";
import { useDebounce } from "@/hooks/useDebounce";
import { ChatWidgetSettings } from "@/types/Modifier";
import ChatInputBox from "./ChatInputBox";
import ChatSendButton from "./ChatSendButton";
import SmartReplies from "./SmartReplies";
import UserExpressions from "./UserExpressions";

type Props = {
  settings: ChatWidgetSettings;
  onSend: (message: string) => void;
  suggestedReply?: string;
};

export function removeSurroundingQuotes(text: string) {
  return text.replace(/^"+|"+$/g, "");
}

export default function ChatInput({
  settings,
  suggestedReply,
  onSend,
}: Props) {
  const [message, setMessage] = useState("");
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [userExpressions, setUserExpressions] = useState<string[]>([]);

  const { smartReply: smartReplyEnabled, userExpression } = useAIConfig();

  const debouncedMessage = useDebounce(message, 2000);
  const rawInputRef = useRef("");
  const sentRef = useRef(false);

  // Handle sending
  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      rawInputRef.current = "";
      sentRef.current = true;
      setSmartReplies([]);
      setUserExpressions([]);
    }
  };

  // Suggested reply
  useEffect(() => {
    if (suggestedReply) setMessage(suggestedReply);
  }, [suggestedReply]);

  // Smart replies
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

  // User expressions
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
        if (Array.isArray(data.expressions)) setUserExpressions(data.expressions.slice(0, 3));
      } catch (err) {
        console.error("User expressions fetch failed:", err);
      }
    };
    fetchUserExpressions();
  }, [debouncedMessage, userExpression]);

  // Handle Smart Reply selection
  const handleSmartReplySelect = (reply: string) => {
    setMessage(reply);
    setSmartReplies([]);     // 🔹 remove smart replies
  };

  // Handle User Expression selection
  const handleUserExpressionSelect = (expression: string) => {
    setMessage(expression);
    setUserExpressions([]);  // 🔹 remove user expressions
  };



  return (
    <div className="m-2 w-[97%]">
      <div className="flex items-center">
        <ChatInputBox
          message={message}
          setMessage={setMessage}
          settings={settings}
          onSend={handleSend}
          footer={
            <SmartReplies replies={smartReplies} onSelect={handleSmartReplySelect} />
          }
        />
        <ChatSendButton
          message={message}
          settings={settings}
          onSend={handleSend}
        />
      </div>

      <div className="mt-2 max-h-16 overflow-y-auto no-scrollbar flex flex-wrap justify-center gap-2">
        <UserExpressions
          expressions={userExpressions}
          onSelect={handleUserExpressionSelect}
        />
      </div>

    </div>
  );
}
