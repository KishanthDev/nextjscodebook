"use client";

import { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Smile, Paperclip, MessageCircleReplyIcon } from "lucide-react";
import { ChatWidgetSettings } from "@/types/Modifier";

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
        <button type="button" title="emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Smile size={20} style={{ color: settings.sendBtnIconColor }} />
        </button>
        <button type="button" title="attachment" onClick={handleAttachmentClick}>
          <Paperclip size={20} style={{ color: settings.sendBtnIconColor }} />
        </button>
        <button type="button" title="reply">
          <MessageCircleReplyIcon size={20} style={{ color: settings.sendBtnIconColor }} />
        </button>
      </div>
    </div>
  );
}
