import { MessageSquare, MoreVertical, X } from "lucide-react";
import clsx from "clsx";
import styles from "./ChatMessages.module.css";
import { ChatWidgetSettings } from "@/types/Modifier";
import { useState } from "react";

type Props = {
  selected: boolean;
  messages: { fromUser: boolean; text: string }[];
  settings: ChatWidgetSettings;
};

export default function ChatMessages({ selected, messages, settings }: Props) {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  // For popup
  const [popupData, setPopupData] = useState<{
    message: string;
    reply: string | null;
  } | null>(null);

  if (!selected) {
    return (
      <div className="mt-10 flex-1 p-4 text-center text-lg text-gray-400 flex flex-col items-center justify-center">
        <MessageSquare className="w-20 h-20 mb-4 text-gray-300 dark:text-gray-600" />
        <p>Select a conversation or start a new chat</p>
      </div>
    );
  }

  return (
    <>
      <div className={clsx(styles.chatContainer, "dark:bg-black p-4 flex-1 overflow-y-auto")}>
        {messages.map((msg, idx) => (
          <div key={idx} className="relative group flex flex-col">
            <div
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

              {/* 3-dot icon */}
              {/* 3-dot icon */}
              <button
                className={clsx(
                  "absolute top-1 opacity-0 group-hover:opacity-100 transition",
                  msg.fromUser ? "right-2" : "left-2" // ✅ dynamic placement
                )}
                onClick={() => setOpenMenuIndex(openMenuIndex === idx ? null : idx)}
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown */}
              {openMenuIndex === idx && (
                <div
                  className={clsx(
                    "absolute top-6 z-10 bg-white dark:bg-gray-800 border rounded-md shadow-lg",
                    msg.fromUser ? "right-2" : "left-2" // ✅ dropdown aligned accordingly
                  )}
                >
                  <button
                    className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    onClick={() => {
                      setOpenMenuIndex(null);

                      if (!msg.fromUser) {
                        // Left-side message (Question)
                        setPopupData({
                          message: msg.text,                  // Question
                          reply: messages[idx + 1]?.text || null, // Next msg is Answer
                        });
                      } else {
                        // Right-side message (Answer)
                        setPopupData({
                          message: messages[idx - 1]?.text || "", // Previous msg is Question
                          reply: msg.text,                          // Current is Answer
                        });
                      }
                    }}

                  >
                    Train chatbot
                  </button>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {popupData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-96 p-6 relative">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              onClick={() => setPopupData(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4">Train Chatbot</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              You can edit the message and reply before training:
            </p>

            {/* Editable Message */}
            <div className="mb-3">
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Message</p>
              <textarea
                className="w-full border rounded-md p-2 text-sm dark:bg-gray-800 dark:text-white"
                rows={3}
                value={popupData.message}
                onChange={(e) =>
                  setPopupData({ ...popupData, message: e.target.value })
                }
              />
            </div>

            {/* Editable Reply */}
            <div className="mb-3">
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Reply</p>
              <textarea
                className="w-full border rounded-md p-2 text-sm dark:bg-gray-800 dark:text-white"
                rows={3}
                value={popupData.reply || ""}
                onChange={(e) =>
                  setPopupData({ ...popupData, reply: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setPopupData(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/training/qa", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        question: popupData.message,
                        answer: popupData.reply,
                      }),
                    });

                    const data = await res.json();
                    if (res.ok) {
                      alert("✅ Training saved successfully!");
                      setPopupData(null);
                    } else {
                      alert("❌ Failed: " + (data.error || "Unknown error"));
                    }
                  } catch (err) {
                    console.error("Training error:", err);
                    alert("⚠️ Network or server error");
                  }
                }}
              >
                Train
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
