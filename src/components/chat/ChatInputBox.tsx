// ChatInputBox.tsx
"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Smile, Paperclip, SpellCheck, Type } from "lucide-react";
import { ChatWidgetSettings } from "@/types/Modifier";
import { useAIConfig } from "@/stores/aiConfig";

type Props = {
  message: string;
  setMessage: (msg: string) => void;
  settings: ChatWidgetSettings;
  onSend: () => void;
  footer?: ReactNode; // 🔹 slot for smart replies / expressions
};

export default function ChatInputBox({
  message,
  setMessage,
  settings,
  onSend,
  footer,
}: Props) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { spellingCorrection, textFormatter } = useAIConfig();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(message + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachmentClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      alert(`Selected file: ${file.name}`);
    }
  };

  const handleFormatClick = async () => {
    if (!textFormatter || !message.trim()) return;
    try {
      const res = await fetch("/api/text-format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_text: message }),
      });
      const data = await res.json();
      setMessage(data.result || message);
    } catch (err) {
      console.error("Text format failed:", err);
    }
  };

  const handleSpellCheckClick = async () => {
    if (!spellingCorrection || !message.trim()) return;
    try {
      const res = await fetch("/api/correct-spelling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_text: message }),
      });
      const data = await res.json();
      setMessage(data.result || message);
    } catch (err) {
      console.error("Spell check failed:", err);
    }
  };

  return (
    <div className="flex-1 border rounded-lg px-4 pt-2 pb-10 relative">
      <textarea
        ref={textareaRef}
        placeholder={settings.inputPlaceholder || "Write a message..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        className="w-full resize-none overflow-y-auto bg-transparent text-black dark:text-white 
                   placeholder-gray-400 dark:placeholder-gray-500 
                   focus:outline-none pr-20 max-h-40"
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-12 right-2 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button
          type="button"
          title="emoji"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="cursor-pointer"
        >
          <Smile size={20} style={{ color: settings.sendBtnIconColor }} />
        </button>
        <button
          type="button"
          title="attachment"
          onClick={handleAttachmentClick}
          className="cursor-pointer"
        >
          <Paperclip size={20} style={{ color: settings.sendBtnIconColor }} />
        </button>
        <button
          type="button"
          title="text format"
          onClick={handleFormatClick}
          disabled={!textFormatter}
          className={`cursor-pointer ${!textFormatter ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <Type size={20} style={{ color: settings.sendBtnIconColor }} />
        </button>
        <button
          type="button"
          title="spelling check"
          onClick={handleSpellCheckClick}
          disabled={!spellingCorrection}
          className={`cursor-pointer ${!spellingCorrection ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <SpellCheck size={20} style={{ color: settings.sendBtnIconColor }} />
        </button>
      </div>

      {/* 🔹 Footer (Smart Replies etc.) */}
      {footer && (
        <div className="absolute bottom-2 left-2 flex gap-2 max-w-[70%] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
          <div className="flex gap-2">
            {footer}
          </div>
        </div>
      )}

    </div>
  );
}
