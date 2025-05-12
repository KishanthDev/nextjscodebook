import { MessageSquare } from "lucide-react";
import clsx from "clsx";
import styles from "./ChatMessages.module.css"

export default function ChatMessages({
    selected,
    messages,
}: {
    selected: boolean;
    messages: { fromUser: boolean; text: string }[];
}) {
    if (!selected) {
        return (
            <div className="mt-10 flex-1 p-4 text-center text-lg text-gray-400 flex flex-col items-center justify-center">
                <MessageSquare className="w-20 h-20 mb-4 text-gray-300 dark:text-gray-600" />
                <p>Select a conversation or start a new chat</p>
            </div>
        );
    }

    return (
        <div className={clsx(styles.chatContainer, 'dark:bg-black')}>
            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={clsx(
                        "max-w-sm px-4 py-2 rounded-lg inline-block",
                        msg.fromUser
                            ? "bg-blue-500 text-white self-end"
                            : "bg-blue-100 dark:bg-blue-800 text-black dark:text-white self-start"
                    )}
                >
                    {msg.text}
                </div>
            ))}
        </div>
    );
}