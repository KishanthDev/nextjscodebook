"use client";

import { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Smile, Paperclip, MessageCircleReplyIcon, SpellCheck, Type } from "lucide-react";
import { ChatWidgetSettings } from "@/types/Modifier";
import { useAIConfig } from "@/stores/aiConfig"; // ✅ get AI feature toggles

type Props = {
  message: string;
  setMessage: (msg: string) => void;
  settings: ChatWidgetSettings;
  onSend: () => void;
};

export default function ChatInputBox({
  message,
  setMessage,
  settings,
  onSend,
}: Props) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ✅ grab config state
  const { spellingCorrection, textFormatter } = useAIConfig();

  // auto resize until max height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px"; // limit to ~6 lines
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

  const handleAttachmentClick = () => {
    fileInputRef.current?.click(); // open file dialog
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      alert(`Selected file: ${file.name}`);
      // 🚀file to backend upload
    }
  };

  // 🔹 click handlers for AI actions
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

        {/* Text Format button */}
        <button
          type="button"
          title="text format"
          onClick={handleFormatClick}
          disabled={!textFormatter} // 🔹 disable if feature not enabled
          className={`cursor-pointer ${!textFormatter ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Type size={20} style={{ color: settings.sendBtnIconColor }} />
        </button>

        {/* Spell Check button */}
        <button
          type="button"
          title="spelling check"
          onClick={handleSpellCheckClick}
          disabled={!spellingCorrection} // 🔹 disable if feature not enabled
          className={`cursor-pointer ${!spellingCorrection ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <SpellCheck size={20} style={{ color: settings.sendBtnIconColor }} />
        </button>
      </div>
    </div>
  );
}
