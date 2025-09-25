'use client';
import { create } from 'zustand';
import mqtt, { MqttClient } from 'mqtt';
import { useAIConfig } from './aiConfig';

interface AIMessage {
  sender: string;
  text: string;
  id: string;
  name?: string;
}

interface AIHandlerState {
  messages: Record<string, AIMessage[]>;
  suggestedReply: string;
  client: MqttClient | null;
  clientId: string | null;
  topic: string | null;
  newMsgCount: number;
  connect: (topic: string, clientId: string) => void;
  disconnect: () => void;
  sendMessage: (text: string, target: string) => void;
  setSuggestedReply: (reply: string) => void;
  resetNewMsgCount: () => void;
}

export const useAIMessageHandler = create<AIHandlerState>((set, get) => ({
  messages: {},
  suggestedReply: '',
  client: null,
  clientId: null,
  topic: null,
  newMsgCount: 0,

  connect: (topic: string, clientId: string) => {
    if (get().client) return;

    const mqttClient = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_HOST!, {
      clientId,
      username: process.env.NEXT_PUBLIC_MQTT_USER!,
      password: process.env.NEXT_PUBLIC_MQTT_PASS!,
    });

    mqttClient.on('connect', () => {
      console.log(`✅ AI Handler Connected to HiveMQ as ${clientId}`);
      mqttClient.subscribe(topic, (err) => {
        if (err) console.error('Subscription error:', err);
        else console.log(`Subscribed to ${topic}`);
      });
    });

    // In the message handler of useAIMessageHandler
    mqttClient.on('message', async (topic, payload) => {
      console.log(`Received message on topic: ${topic}`, payload.toString());
      try {
        const parsed = JSON.parse(payload.toString());
        const msgId = parsed.id;

        // Fix: Extract user from the correct topic format
        let user = null;
        if (topic.startsWith('chat/users/')) {
          user = topic.split('/')[2]; // Extract from chat/users/{user}
        } else if (topic.startsWith('chat/agent/')) {
          user = topic.split('/')[2]; // Extract from chat/agent/{user}
        }

        if (!user) {
          console.error('Invalid topic format:', topic);
          return;
        }

        const currentMessages = get().messages[user] || [];
        if (currentMessages.some((m) => m.id === msgId)) {
          console.log(`Duplicate message ID ${msgId} for user ${user}, skipping`);
          return;
        }

        // Fix: Properly extract and use the name field
        const msg = {
          sender: parsed.sender,
          text: parsed.text,
          name: parsed.name || parsed.sender, // ✅ Use name if available, fallback to sender
          id: msgId
        };

        console.log(`Adding message for user ${user}:`, msg);
        set((state) => ({
          messages: {
            ...state.messages,
            [user]: [...currentMessages, msg],
          },
          newMsgCount: msg.sender !== clientId ? state.newMsgCount + 1 : state.newMsgCount,
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
        // Fix: Also handle user extraction in error case
        let user = null;
        if (topic.startsWith('chat/users/')) {
          user = topic.split('/')[2];
        } else if (topic.startsWith('chat/agent/')) {
          user = topic.split('/')[2];
        }

        if (!user) return;

        const msgId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          messages: {
            ...state.messages,
            [user]: [...(state.messages[user] || []), {
              sender: 'unknown',
              text: payload.toString(),
              id: msgId,
              name: 'Unknown User'
            }],
          },
          newMsgCount: state.newMsgCount + 1,
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
        messages: {},
        suggestedReply: '',
        clientId: null,
        topic: null,
        newMsgCount: 0,
      });
    }
  },

  sendMessage: (text: string, target: string) => {
    const { client, clientId } = get();
    if (client && clientId && text.trim()) {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const payload = JSON.stringify({
        sender: clientId,
        text,
        id,
        name: "Agent" // ✅ Add a display name for the agent
      });
      client.publish(`chat/agent/${target}`, payload, { qos: 1, retain: false });
      console.log(`Sent message to chat/agent/${target}: ${text}`);
      set((state) => ({
        messages: {
          ...state.messages,
          [target]: [...(state.messages[target] || []), {
            sender: clientId,
            text,
            id,
            name: "Agent" // ✅ Also store name in local state
          }],
        },
      }));
    }
  },
  setSuggestedReply: (reply: string) => set({ suggestedReply: reply }),

  resetNewMsgCount: () => set({ newMsgCount: 0 }),
}));