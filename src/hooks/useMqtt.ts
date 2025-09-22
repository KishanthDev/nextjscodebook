// hooks/useMqtt.ts
'use client';
import { useEffect, useState, useRef } from "react";
import mqtt, { MqttClient } from "mqtt";

export default function useMqtt(topic: string, clientId: string) {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string; id: string }[]>([]);
  const messageIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const mqttClient = mqtt.connect("wss://broker.hivemq.com:8884/mqtt", { clientId });

    mqttClient.on("connect", () => {
      console.log(`✅ Connected to HiveMQ as ${clientId}`);
      mqttClient.subscribe(topic);
    });

    mqttClient.on("message", (_, payload) => {
      try {
        const parsed = JSON.parse(payload.toString());
        const msgId = parsed.id;
        if (!msgId || messageIdsRef.current.has(msgId)) {
          return; // Dedup
        }
        messageIdsRef.current.add(msgId);
        const msg = { sender: parsed.sender, text: parsed.text, id: msgId };
        setMessages(prev => [...prev, msg]);
      } catch {
        const msgId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        messageIdsRef.current.add(msgId);
        setMessages(prev => [...prev, { sender: "unknown", text: payload.toString(), id: msgId }]);
      }
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const sendMessage = (text: string) => {
    if (client && text.trim()) {
      const payload = JSON.stringify({ sender: clientId, text, id: generateId() });
      client.publish(topic, payload, { qos: 1, retain: true });
    }
  };

  return { messages, sendMessage };
}