import { MessageSquare } from "lucide-react";
import clsx from "clsx";
import styles from "./ChatMessages.module.css";
import { ChatWidgetSettings } from "@/types/Modifier";

type Props = {
  selected: boolean;
  messages: { fromUser: boolean; text: string }[];
  settings: ChatWidgetSettings;
};

export default function ChatMessages({ selected, messages, settings }: Props) {
  if (!selected) {
    return (
      <div className="mt-10 flex-1 p-4 text-center text-lg text-gray-400 flex flex-col items-center justify-center">
        <MessageSquare className="w-20 h-20 mb-4 text-gray-300 dark:text-gray-600" />
        <p>Select a conversation or start a new chat</p>
      </div>
    );
  }

  return (
    <div className={clsx(styles.chatContainer, "dark:bg-black p-4 flex-1 overflow-y-auto")}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={clsx(
            "max-w-sm px-4 py-2 rounded-lg inline-block mb-3",
            msg.fromUser
              ? "self-end rounded-br-none text-white"
              : "self-start rounded-bl-none text-black dark:text-white",
            styles.message
          )}
          style={{
            backgroundColor: msg.fromUser
              ? settings.userMsgBgColor
              : settings.botMsgBgColor,
          }}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}