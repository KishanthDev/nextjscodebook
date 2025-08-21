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
  return (
    <div className="flex-1 border rounded-lg px-4 pt-2 pb-8 relative">
      <input
        type="text"
        placeholder={settings.inputPlaceholder || "Write a message..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        className="w-full bg-transparent text-black dark:text-white 
                   placeholder-gray-400 dark:placeholder-gray-500 
                   focus:outline-none pr-20"
      />

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
