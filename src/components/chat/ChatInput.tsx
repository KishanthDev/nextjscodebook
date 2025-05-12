import { Paperclip, Send, Smile } from "lucide-react";

export default function ChatInput() {
  return (
    <div className="flex items-center gap-2 border-t bg-white px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900">
      <button
        title="emoji"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
      >
        <Smile size={20} />
      </button>
      <button
        title="attachment"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
      >
        <Paperclip size={20} />
      </button>
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
      />
      <button
        title="send"
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
      >
        <Send size={20} />
      </button>
    </div>
  );
}
