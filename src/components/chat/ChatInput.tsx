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
  suggestedReply = "",
  onSend,
}: Props) {
  const [internalMessage, setInternalMessage] = useState(suggestedReply);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [userExpressions, setUserExpressions] = useState<string[]>([]);
  const { smartReply: smartReplyEnabled, userExpression } = useAIConfig();

  const debouncedMessage = useDebounce(internalMessage, 2000);

  // Keep internal message in sync with suggestedReply
  useEffect(() => {
    setInternalMessage(suggestedReply);
  }, [suggestedReply]);

  const handleSend = () => {
    if (internalMessage.trim()) {
      onSend(internalMessage.trim());
      setInternalMessage(""); // ✅ always clear after sending
      setSmartReplies([]);
      setUserExpressions([]);
    }
  };

  // Smart replies fetch
  useEffect(() => {
    const fetchSmartReplies = async () => {
      if (!smartReplyEnabled || !internalMessage.trim()) return;
      try {
        const res = await fetch("/api/smart-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_text: internalMessage.trim() }),
        });
        const data = await res.json();
        if (Array.isArray(data.replies)) setSmartReplies(data.replies.slice(0, 3));
      } catch (err) {
        console.error("Smart replies fetch failed:", err);
      }
    };
    fetchSmartReplies();
  }, [debouncedMessage, smartReplyEnabled]);

  // User expressions fetch
  useEffect(() => {
    const fetchUserExpressions = async () => {
      if (!userExpression || !internalMessage.trim()) return;
      try {
        const res = await fetch("/api/user-expressions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: internalMessage.trim() }),
        });
        const data = await res.json();
        if (Array.isArray(data.expressions)) setUserExpressions(data.expressions.slice(0, 3));
      } catch (err) {
        console.error("User expressions fetch failed:", err);
      }
    };
    fetchUserExpressions();
  }, [debouncedMessage, userExpression]);

  const handleSmartReplySelect = (reply: string) => {
    setInternalMessage(reply);
    setSmartReplies([]);
  };

  const handleUserExpressionSelect = (expression: string) => {
    setInternalMessage(expression);
    setUserExpressions([]);
  };

  return (
    <div className="m-5 w-[97%]">
      <div className="flex items-center">
        <ChatInputBox
          message={internalMessage}
          setMessage={setInternalMessage}
          settings={settings}
          onSend={handleSend}
          footer={
            smartReplyEnabled && smartReplies.length > 0 && (
              <SmartReplies replies={smartReplies} onSelect={handleSmartReplySelect} />
            )
          }
        />
        <ChatSendButton message={internalMessage} settings={settings} onSend={handleSend} />
      </div>

      {userExpression && userExpressions.length > 0 && (
        <div className="mt-2 max-h-16 overflow-y-auto no-scrollbar flex flex-wrap justify-center gap-2">
          <UserExpressions expressions={userExpressions} onSelect={handleUserExpressionSelect} />
        </div>
      )}
    </div>
  );
}

