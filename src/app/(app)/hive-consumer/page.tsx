'use client';
import { useRef } from "react";
import { useUserMessageHandler, UserBox } from "@/stores/userMessageHandler";

export default function HiveConsumer() {
  const { users, setUsername, connectUser, sendMessage, updateUser } = useUserMessageHandler();
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToBottom = (index: number) => {
    setTimeout(() => {
      const div = scrollRefs.current[index];
      if (div) div.scrollTop = div.scrollHeight;
    }, 50);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 h-screen bg-gray-50">
      {users.map((u: UserBox, i) => (
        <div key={i} className="flex flex-col border rounded bg-white shadow">
          {!u.connected ? (
            <div className="p-4">
              <h2 className="font-bold mb-2">User {i + 1}</h2>
              <input
                value={u.username}
                onChange={(e) => setUsername(i, e.target.value)}
                placeholder="Enter username"
                className="border rounded px-2 py-1 mr-2 w-full mb-2"
              />
              <button
                onClick={() => connectUser(i)}
                className="bg-green-500 text-white px-3 py-1 rounded w-full"
              >
                Join
              </button>
            </div>
          ) : (
            <>
              <div className="p-2 border-b font-bold">Chat as {u.username}</div>
              <div
                className="flex-1 p-2 overflow-y-auto"
              >
                {u.messages.map((msg, j) => (
                  <div
                    key={j}
                    className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                  >
                    <span
                      className={`inline-block px-3 py-1 rounded ${
                        msg.sender === "user"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t flex">
                <input
                  value={u.input}
                  onChange={(e) =>
                    updateUser(i, { input: e.target.value })
                  }
                  placeholder="Type a message"
                  className="flex-1 border rounded px-2 py-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage(i);
                      scrollToBottom(i);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    sendMessage(i);
                    scrollToBottom(i);
                  }}
                  className="ml-2 bg-green-500 text-white px-3 py-1 rounded"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
