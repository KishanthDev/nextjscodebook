"use client";

import { useState, useRef, useEffect } from "react";

type Message =
  | { role: "user"; text: string }
  | { role: "assistant"; type: "text"; text: string }
  | {
      role: "assistant";
      type: "buttons";
      text: string;
      buttons: { label: string; action: string }[];
    }
  | {
      role: "assistant";
      type: "action";
      text: string;
      label: string;
      action: string;
    };

interface AskPageProps {
  botId: string;
  botName:string // 👈 accept botId
}

export default function AskPage({ botId ,botName }: AskPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async () => {
    if (!input.trim()) return;

    // add user msg
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          botId, // 👈 send botId to backend
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", ...data, type: data.type || "text" },
        ]);
      } else {
        // fallback streaming
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let botReply = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          botReply += decoder.decode(value, { stream: true });

          setMessages((prev) => {
            const copy = [...prev];
            if (copy[copy.length - 1]?.role === "assistant") {
              (copy[copy.length - 1] as any).text = botReply;
            } else {
              copy.push({ role: "assistant", type: "text", text: botReply });
            }
            return copy;
          });
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", type: "text", text: "❌ Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-55px)] bg-gray-100">
      {/* Header */}
      <header className="bg-green-500 text-white p-4 text-lg font-semibold shadow-md">
        🤖 Chat with Bot: {botName}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && !loading && (
          <p className="text-gray-500 text-center mt-10 italic">
            Ask me anything to get started!
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow ${
                msg.role === "user"
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.role === "assistant" && msg.type === "buttons" ? (
                <div>
                  <p className="mb-2">{msg.text}</p>
                  <div className="flex flex-col gap-2">
                    {msg.buttons.map((btn, j) => (
                      <button
                        key={j}
                        className="px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                        onClick={() => {
                          if (btn.action.startsWith("redirect:")) {
                            window.open(
                              btn.action.replace("redirect:", ""),
                              "_blank"
                            );
                          } else {
                            setInput(btn.label);
                          }
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : msg.role === "assistant" && msg.type === "action" ? (
                <div>
                  <p>{msg.text}</p>
                </div>
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-gray-300 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Type your question..."
          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="px-5 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition disabled:opacity-50"
        >
          {loading ? "..." : "Ask 🚀"}
        </button>
      </div>
    </div>
  );
}
