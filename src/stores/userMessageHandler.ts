'use client';
import { create } from 'zustand';
import mqtt, { MqttClient } from 'mqtt';

export type Message = { sender: "agent" | "user"; text: string; id: string; name?: string; timestamp: number; };

export type UserBox = {
  username: string;
  client: MqttClient | null;
  messages: Message[];
  input: string;
  connected: boolean;
};

interface UserMessageHandlerState {
  users: UserBox[];
  setUsername: (index: number, username: string) => void;
  connectUser: (index: number) => void;
  sendMessage: (index: number) => void;
  updateUser: (index: number, updates: Partial<UserBox> | ((prev: UserBox) => Partial<UserBox>)) => void;
}

export const useUserMessageHandler = create<UserMessageHandlerState>((set, get) => ({
  users: Array(4).fill(null).map(() => ({
    username: '',
    client: null,
    messages: [],
    input: '',
    connected: false,
  })),

  setUsername: (index, username) => {
    get().updateUser(index, { username });
  },

  updateUser: (index, updates) => {
    set((prev) => {
      const newArr = [...prev.users];
      const current = newArr[index];
      const newUpdates = typeof updates === "function" ? updates(current) : updates;
      newArr[index] = { ...current, ...newUpdates };
      return { users: newArr };
    });
  },

  connectUser: (index) => {
    const user = get().users[index];
    if (!user.username.trim()) return;

    const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_HOST!, {
      clientId: user.username + "-" + Math.random().toString(16).slice(2),
      username: process.env.NEXT_PUBLIC_MQTT_USER!,
      password: process.env.NEXT_PUBLIC_MQTT_PASS!,
    });

    client.on("connect", () => {
      console.log(user.username, "connected");
      client.subscribe(`chat/agent/${user.username}`);
      get().updateUser(index, { client, connected: true });
    });

    client.on("message", (_, payload) => {
      let msg: Message;
      try {
        const parsed = JSON.parse(payload.toString());
        msg = {
          sender: "agent",
          text: parsed.text,
          id: parsed.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: parsed.name || "Agent",
          timestamp: parsed.timestamp || Date.now(),
        };
      } catch (err) {
        console.error("Parse error:", err);
        msg = { sender: "agent", text: payload.toString(), id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, timestamp: Date.now() };
      }
      get().updateUser(index, (prev) => ({
        messages: [...prev.messages, msg],
      }));
    });
  },

  sendMessage: (index) => {
    const user = get().users[index];
    if (!user.client || !user.input.trim()) return;

    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const payload = JSON.stringify({
      sender: user.username,
      text: user.input,
      id,
      name: user.username,
      timestamp: Date.now(),
    });

    user.client.publish(`chat/users/${user.username}`, payload, { qos: 1, retain: false });

    get().updateUser(index, (prev) => ({
      messages: [...prev.messages, { sender: "user", text: user.input, id, name: user.username, timestamp:Date.now(), }],
      input: "",
    }));
  },
}));
