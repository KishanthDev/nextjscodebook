// stores/aiMessageHandler.ts
'use client';
import { create } from 'zustand';
import mqtt, { MqttClient } from 'mqtt';
import { useAIConfig } from './aiConfig';

interface AIMessage {
  sender: string;
  text: string;
  id: string;
}

interface AIHandlerState {
  messages: AIMessage[];
  suggestedReply: string;
  client: MqttClient | null;
  clientId: string | null;
  topic: string | null;
  newMsgCount: number; // 🔹 count of new incoming messages
  connect: (topic: string, clientId: string) => void;
  disconnect: () => void;
  sendMessage: (text: string) => void;
  setSuggestedReply: (reply: string) => void;
  resetNewMsgCount: () => void; // 🔹 reset counter
}

export const useAIMessageHandler = create<AIHandlerState>((set, get) => ({
  messages: [],
  suggestedReply: '',
  client: null,
  clientId: null,
  topic: null,
  newMsgCount: 0, // start with 0

  connect: (topic: string, clientId: string) => {
    if (get().client) return; // Prevent multiple connections

    const mqttClient = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', { clientId });

    mqttClient.on('connect', () => {
      console.log(`✅ AI Handler Connected to HiveMQ as ${clientId}`);
      mqttClient.subscribe(topic, (err) => {
        if (err) console.error('Subscription error:', err);
      });
    });

    mqttClient.on('message', async (_, payload) => {
      try {
        const parsed = JSON.parse(payload.toString());
        const msgId = parsed.id;
        const messageIds = new Set(get().messages.map((m) => m.id));
        if (!msgId || messageIds.has(msgId)) return;

        const msg = { sender: parsed.sender, text: parsed.text, id: msgId };
        set((state) => ({
          messages: [...state.messages, msg],
          newMsgCount: msg.sender !== clientId ? state.newMsgCount + 1 : state.newMsgCount, // 🔹 increment only for others
        }));

        // AI auto-processing
        const { openaiGenerate, openaiReply } = useAIConfig.getState();
        if (msg.sender !== clientId && (openaiGenerate || openaiReply)) {
          try {
            const res = await fetch('/api/ai-reply', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: msg.text }),
            });
            const data = await res.json();
            const aiSuggestion = data.reply || '';

            if (openaiGenerate) {
              set({ suggestedReply: aiSuggestion });
            }

            if (openaiReply && aiSuggestion) {
              const payload = JSON.stringify({
                sender: clientId,
                text: aiSuggestion,
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              });
              mqttClient.publish(topic, payload, { qos: 1, retain: false });
              set({ suggestedReply: '' });
            }
          } catch (err) {
            console.error('AI suggestion failed:', err);
            set({ suggestedReply: '' });
          }
        }
      } catch (err) {
        console.error('Message parsing error:', err);
        const msgId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          messages: [...state.messages, { sender: 'unknown', text: payload.toString(), id: msgId }],
          newMsgCount: state.newMsgCount + 1, // still count it
        }));
      }
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT error:', err);
    });

    set({ client: mqttClient, clientId, topic });
  },

  disconnect: () => {
    const client = get().client;
    if (client) {
      client.end();
      set({
        client: null,
        messages: [],
        suggestedReply: '',
        clientId: null,
        topic: null,
        newMsgCount: 0,
      });
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

  setSuggestedReply: (reply: string) => set({ suggestedReply: reply }),

  resetNewMsgCount: () => set({ newMsgCount: 0 }), // 🔹 manually reset
}));
