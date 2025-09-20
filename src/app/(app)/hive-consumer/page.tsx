
// HiveConsumer.tsx
'use client';
import { useState } from "react";
import useMqtt from "@/hooks/useMqtt";

export default function HiveConsumer() {
    const [clientId] = useState(() => "user2");
    const { messages, sendMessage } = useMqtt("nextjs/poc/new", clientId);
    const [input, setInput] = useState("");

    return (
        <div className="p-6 border rounded w-[400px]">
            <h2 className="text-xl font-bold mb-4">HiveMQ Consumer (User2)</h2>

            <div className="h-48 overflow-y-auto border p-2 mb-4">
                {messages.map((msg, i) => (
                    <p key={i} className={msg.sender === clientId ? "text-right" : "text-left"}>
                        <b>{msg.sender === clientId ? "Me" : msg.sender}:</b> {msg.text}
                    </p>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type message..."
                className="border p-2 mr-2 w-[70%]"
            />

            <button
                onClick={() => { sendMessage(input); setInput(""); }}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Send
            </button>
        </div>
    );
}
