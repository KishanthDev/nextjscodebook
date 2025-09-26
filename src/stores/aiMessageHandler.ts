'use client';
import { create } from 'zustand';
import mqtt, { MqttClient } from 'mqtt';
import { useAIConfig } from './aiConfig';

interface AIMessage {
  sender: string;
  text: string;
  id: string;
  name?: string;
  timestamp: number;
}

interface AIHandlerState {
  messages: Record<string, AIMessage[]>;
  suggestedReplies: Record<string, string>;
  client: MqttClient | null;
  clientId: string | null;
  topic: string | null;
  newMsgCount: number;
  unreadCounts: Record<string, number>;
  lastViewed: Record<string, number>; // ✅ Add lastViewed to store
  connect: (topic: string, clientId: string) => void;
  disconnect: () => void;
  sendMessage: (text: string, target: string) => void;
  setSuggestedReply: (reply: string, contactId: string) => void;
  resetNewMsgCount: () => void;
  resetUnread: (contactId: string) => void;
  setLastViewed: (contactId: string, timestamp: number) => void; // ✅ Add setter for lastViewed
}

export const useAIMessageHandler = create<AIHandlerState>((set, get) => ({
  messages: {},
  suggestedReplies: {},
  client: null,
  clientId: null,
  topic: null,
  newMsgCount: 0,
  unreadCounts: {},
  lastViewed: {}, // ✅ Initialize lastViewed

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

    mqttClient.on('message', async (topic, payload) => {
      const parsed = JSON.parse(payload.toString());
      const msgId = parsed.id;

      let user: string | null = null;
      if (topic.startsWith('chat/users/')) user = topic.split('/')[2];
      else if (topic.startsWith('chat/agent/')) user = topic.split('/')[2];
      if (!user) return;

      const currentMessages = get().messages[user] || [];
      if (currentMessages.some((m) => m.id === msgId)) return; // duplicate

      const msg: AIMessage = {
        sender: parsed.sender,
        text: parsed.text,
        name: parsed.name || parsed.sender,
        id: msgId,
        timestamp: parsed.timestamp || Date.now(),
      };

      // ✅ Calculate unread count based on lastViewed
      const lastViewed = get().lastViewed[user] || 0;
      const isUnread = msg.sender !== clientId && msg.timestamp > lastViewed;

      set((state) => ({
        messages: {
          ...state.messages,
          [user]: [...currentMessages, msg],
        },
        unreadCounts: {
          ...state.unreadCounts,
          [user]: isUnread
            ? (state.unreadCounts[user] || 0) + 1
            : state.unreadCounts[user] || 0,
        },
        newMsgCount: isUnread ? state.newMsgCount + 1 : state.newMsgCount,
      }));

      // AI auto-processing (unchanged)
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
            set((state) => ({
              suggestedReplies: {
                ...state.suggestedReplies,
                [user]: aiSuggestion,
              },
            }));
          }

          if (openaiReply && aiSuggestion) {
            const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const payload = JSON.stringify({
              sender: clientId,
              text: aiSuggestion,
              id,
              name: 'Agent',
              timestamp: Date.now(),
            });

            mqttClient.publish(`chat/agent/${user}`, payload, {
              qos: 1,
              retain: false,
            });

            const currentMessages = get().messages[user] || [];
            set({
              messages: {
                ...get().messages,
                [user]: [
                  ...currentMessages,
                  {
                    sender: clientId,
                    text: aiSuggestion,
                    id,
                    name: 'Agent',
                    timestamp: Date.now(),
                  },
                ],
              },
              suggestedReplies: {
                ...get().suggestedReplies,
                [user]: '',
              },
            });
          }
        } catch (err) {
          console.error('AI suggestion failed:', err);
          set((state) => ({
            suggestedReplies: { ...state.suggestedReplies, [user]: '' },
          }));
        }
      }
    });

    mqttClient.on('error', (err) => console.error('MQTT error:', err));

    set({ client: mqttClient, clientId, topic });
  },

  disconnect: () => {
    const client = get().client;
    if (client) {
      client.end();
      set({
        client: null,
        messages: {},
        suggestedReplies: {},
        clientId: null,
        topic: null,
        newMsgCount: 0,
        unreadCounts: {},
        lastViewed: {}, // ✅ Clear lastViewed on disconnect
      });
    }
  },

  sendMessage: (text: string, target: string) => {
    const { client, clientId } = get();
    if (client && clientId && text.trim()) {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = Date.now();
      const payload = JSON.stringify({
        sender: clientId,
        text,
        id,
        name: 'Agent',
        timestamp,
      });
      client.publish(`chat/agent/${target}`, payload, {
        qos: 1,
        retain: false,
      });

      const currentMessages = get().messages[target] || [];
      set({
        messages: {
          ...get().messages,
          [target]: [
            ...currentMessages,
            { sender: clientId, text, id, name: 'Agent', timestamp },
          ],
        },
        suggestedReplies: { ...get().suggestedReplies, [target]: '' },
      });
    }
  },

  setSuggestedReply: (reply: string, contactId: string) =>
    set((state) => ({
      suggestedReplies: { ...state.suggestedReplies, [contactId]: reply },
    })),

  resetNewMsgCount: () => set({ newMsgCount: 0 }),

  resetUnread: (contactId: string) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [contactId]: 0 },
    })),

  setLastViewed: (contactId: string, timestamp: number) =>
    set((state) => ({
      lastViewed: { ...state.lastViewed, [contactId]: timestamp },
      unreadCounts: { ...state.unreadCounts, [contactId]: 0 }, // ✅ Reset unread count when lastViewed is updated
    })),
}));