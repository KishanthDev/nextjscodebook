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

  const { spellingCorrection, textFormatter, smartReply: smartReplyEnabled, userExpression } = useAIConfig();

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

  // Spelling / formatting
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
        if (Array.isArray(data.expressions)) setUserExpressions(data.expressions.slice(0, 5));
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
        />
        <ChatSendButton
          message={message}
          settings={settings}
          onSend={handleSend}
        />
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <SmartReplies replies={smartReplies} onSelect={handleSmartReplySelect} />
        <UserExpressions expressions={userExpressions} onSelect={handleUserExpressionSelect} />
      </div>
    </div>
  );
}
