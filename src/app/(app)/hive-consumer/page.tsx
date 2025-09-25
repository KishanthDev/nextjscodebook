'use client';
import { useEffect, useState, useRef } from "react";
import mqtt, { MqttClient } from "mqtt";

type Message = { sender: "agent" | "user"; text: string };

type UserBox = {
  username: string;
  client: MqttClient | null;
  messages: Message[];
  input: string;
  connected: boolean;
};

export default function HiveConsumer() {
  const [users, setUsers] = useState<UserBox[]>([
    { username: "", client: null, messages: [], input: "", connected: false },
    { username: "", client: null, messages: [], input: "", connected: false },
    { username: "", client: null, messages: [], input: "", connected: false },
    { username: "", client: null, messages: [], input: "", connected: false },
  ]);

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  const connectUser = (index: number) => {
    const u = users[index];
    if (!u.username.trim()) return;

    const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_HOST!, {
      clientId: u.username + "-" + Math.random().toString(16).slice(2),
      username: process.env.NEXT_PUBLIC_MQTT_USER!,
      password: process.env.NEXT_PUBLIC_MQTT_PASS!,
    });

    client.on("connect", () => {
      console.log(u.username, "connected");
      client.subscribe(`chat/agent/${u.username}`);
      updateUser(index, { client, connected: true });
    });

    client.on("message", (_, payload) => {
      try {
        const parsed = JSON.parse(payload.toString());
        const text = parsed.text;
        updateUser(index, (prev) => ({
          messages: [...prev.messages, { sender: "agent", text }],
        }));
      } catch (err) {
        console.error("Parse error:", err);
        updateUser(index, (prev) => ({
          messages: [...prev.messages, { sender: "agent", text: payload.toString() }],
        }));
      }
      scrollToBottom(index);
    });
  };

  const sendMessage = (index: number) => {
    const u = users[index];
    if (!u.client || !u.input.trim()) return;

    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const payload = JSON.stringify({
      sender: u.username,
      name: u.username, // ✅ include display name
      text: u.input,
      id,
    });
    u.client.publish(`chat/users/${u.username}`, payload, { qos: 1, retain: false });
    updateUser(index, (prev) => ({
      messages: [...prev.messages, { sender: "user", text: u.input }],
      input: "",
    }));
    scrollToBottom(index);
  };

  const updateUser = (
    index: number,
    updates: Partial<UserBox> | ((prev: UserBox) => Partial<UserBox>)
  ) => {
    setUsers((prev) => {
      const newArr = [...prev];
      const current = newArr[index];
      const newUpdates =
        typeof updates === "function" ? updates(current) : updates;
      newArr[index] = { ...current, ...newUpdates };
      return newArr;
    });
  };

  const scrollToBottom = (index: number) => {
    setTimeout(() => {
      const div = scrollRefs.current[index];
      if (div) div.scrollTop = div.scrollHeight;
    }, 50);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 h-screen bg-gray-50">
      {users.map((u, i) => (
        <div key={i} className="flex flex-col border rounded bg-white shadow">
          {!u.connected ? (
            <div className="p-4">
              <h2 className="font-bold mb-2">User {i + 1}</h2>
              <input
                value={u.username}
                onChange={(e) => updateUser(i, { username: e.target.value })}
                placeholder="Enter username"
                className="border rounded px-2 py-1 mr-2"
              />
              <button
                onClick={() => connectUser(i)}
                className="bg-green-500 text-white px-3 py-1 rounded"
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
                    className={`mb-2 ${
                      msg.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`inline-block px-3 py-1 rounded ${
                        msg.sender === "user"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
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
                  onChange={(e) => updateUser(i, { input: e.target.value })}
                  placeholder="Type a message"
                  className="flex-1 border rounded px-2 py-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage(i);
                  }}
                />
                <button
                  onClick={() => sendMessage(i)}
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
