// hooks/useMqtt.ts
'use client';
import { useEffect, useState } from "react";
import mqtt, { MqttClient } from "mqtt";

export default function useMqtt(topic: string, clientId: string) {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

useEffect(() => {
  const mqttClient = mqtt.connect("wss://broker.hivemq.com:8884/mqtt", { clientId });

  mqttClient.on("connect", () => {
    console.log(`✅ Connected to HiveMQ as ${clientId}`);
    mqttClient.subscribe(topic);
  });

  mqttClient.on("message", (_, payload) => {
    try {
      const msg = JSON.parse(payload.toString());
      setMessages(prev => [...prev, msg]);
    } catch {
      setMessages(prev => [...prev, { sender: "unknown", text: payload.toString() }]);
    }
  });

  setClient(mqttClient);

  return () => {
    mqttClient.end();
  }; // ✅ Now returns void
}, []);

  const sendMessage = (text: string) => {
    if (client && text.trim()) {
      const payload = JSON.stringify({ sender: clientId, text });
      client.publish(topic, payload, { qos: 1, retain: true });
    }
  };

  return { messages, sendMessage };
}
