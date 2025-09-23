// stores/userMessageHandler.ts
'use client';
import { create } from 'zustand';
import mqtt, { MqttClient } from 'mqtt';

interface UserMessage {
  sender: string;
  text: string;
  id: string;
}

interface UserMessageHandlerState {
  messages: UserMessage[];
  client: MqttClient | null;
  clientId: string | null; // Store clientId
  topic: string | null; // Store topic
  connect: (topic: string, clientId: string) => void;
  disconnect: () => void;
  sendMessage: (text: string) => void;
}

export const useUserMessageHandler = create<UserMessageHandlerState>((set, get) => ({
  messages: [],
  client: null,
  clientId: null, // Initialize clientId
  topic: null, // Initialize topic
  connect: (topic: string, clientId: string) => {
    if (get().client) return; // Prevent multiple connections

    const mqttClient = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_HOST!, {
      clientId,
      username: process.env.NEXT_PUBLIC_MQTT_USER!,
      password: process.env.NEXT_PUBLIC_MQTT_PASS!,
    });

    mqttClient.on('connect', () => {
      console.log(`✅ User Handler Connected to HiveMQ as ${clientId}`);
      mqttClient.subscribe(topic, (err) => {
        if (err) console.error('Subscription error:', err);
      });
    });

    mqttClient.on('message', (_, payload) => {
      try {
        const parsed = JSON.parse(payload.toString());
        const msgId = parsed.id;
        const messageIds = new Set(get().messages.map((m) => m.id));
        if (!msgId || messageIds.has(msgId)) return; // Deduplicate

        const msg = { sender: parsed.sender, text: parsed.text, id: msgId };
        set((state) => ({ messages: [...state.messages, msg] }));
      } catch (err) {
        console.error('Message parsing error:', err);
        const msgId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          messages: [...state.messages, { sender: 'unknown', text: payload.toString(), id: msgId }],
        }));
      }
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT error:', err);
    });

    set({ client: mqttClient, clientId, topic }); // Store clientId and topic
  },
  disconnect: () => {
    const client = get().client;
    if (client) {
      client.end();
      set({ client: null, messages: [], clientId: null, topic: null });
    }
  },
  sendMessage: (text: string) => {
    const { client, clientId, topic } = get();
    if (client && clientId && topic && text.trim()) {
      const payload = JSON.stringify({
        sender: clientId,
        text,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      });
      client.publish(topic, payload, { qos: 1, retain: false });
    }
  },
}));