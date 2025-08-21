"use client";

import { useRef, useEffect } from "react";
import { Smile, Paperclip, MessageCircleReplyIcon } from "lucide-react";
import { ChatWidgetSettings } from "@/types/Modifier";

type Props = {
  message: string;
  setMessage: (msg: string) => void;
  settings: ChatWidgetSettings;
  onEmojiClick?: () => void;
  onAttachmentClick?: () => void;
  onSend: () => void;
};

export default function ChatInputBox({
  message,
  setMessage,
  settings,
  onEmojiClick,
  onAttachmentClick,
  onSend,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea until max height is reached
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px"; // 160px ≈ 5-6 lines
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent new line
      onSend();
    }
    // Shift+Enter = allow newline
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

      {/* Action buttons */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button title="emoji" onClick={onEmojiClick}>
          <Smile size={20} style={{ color: settings.sendBtnIconColor }} />
        </button>
        <button title="attachment" onClick={onAttachmentClick}>
          <Paperclip size={20} style={{ color: settings.sendBtnIconColor }} />
        </button>
        <button title="reply" onClick={onEmojiClick}>
          <MessageCircleReplyIcon size={20} style={{ color: settings.sendBtnIconColor }} />
        </button>
      </div>
    </div>
  );
}
