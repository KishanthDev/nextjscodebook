import { Send } from "lucide-react";
import { ChatWidgetSettings } from "@/types/Modifier";

type Props = {
  message: string;
  settings: ChatWidgetSettings;
  onSend: () => void;
};

export default function ChatSendButton({ message, settings, onSend }: Props) {
  return (
    <button
      title="send"
      onClick={onSend}
      disabled={!message.trim()}
      className="ml-2 rounded-full p-2 transition-colors"
      style={{
        backgroundColor: message.trim() ? settings.sendBtnBgColor : "transparent",
        color: settings.sendBtnIconColor,
      }}
    >
      <Send size={20} />
    </button>
  );
}
