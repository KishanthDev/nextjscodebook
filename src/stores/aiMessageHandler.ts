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
  clientId: string | null; // Store clientId
  topic: string | null; // Store topic
  connect: (topic: string, clientId: string) => void;
  disconnect: () => void;
  sendMessage: (text: string) => void;
  setSuggestedReply: (reply: string) => void;
}

export const useAIMessageHandler = create<AIHandlerState>((set, get) => ({
  messages: [],
  suggestedReply: '',
  client: null,
  clientId: null, // Initialize clientId
  topic: null, // Initialize topic
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
        if (!msgId || messageIds.has(msgId)) return; // Deduplicate

        const msg = { sender: parsed.sender, text: parsed.text, id: msgId };
        set((state) => ({ messages: [...state.messages, msg] }));

        // Process AI reply if not from this client
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
      set({ client: null, messages: [], suggestedReply: '', clientId: null, topic: null });
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
}));