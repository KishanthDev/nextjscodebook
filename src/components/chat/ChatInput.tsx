import { Paperclip, Send, Smile } from "lucide-react";
import { ChatWidgetSettings } from "@/types/Modifier";
import { useState } from "react";

type Props = {
  settings: ChatWidgetSettings;
  onSend: (message: string) => void;
  onEmojiClick?: () => void;
  onAttachmentClick?: () => void;
};

export default function ChatInput({ settings, onSend, onEmojiClick, onAttachmentClick }: Props) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="flex items-center gap-2 border-t bg-white px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900">
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
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
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
  );
}