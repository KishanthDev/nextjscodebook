'use client';
import { useEffect, useRef, useState } from "react";
import mqtt, { MqttClient } from "mqtt";
import { useChatStore } from "./chatStore";

export interface UserPair {
  user: string;
  ai: string;
}

export function useMQTTChat(
  pairs: UserPair[],
  brokerUrl: string,
  triggerAI: boolean = false
) {
  const { messages, addMessage } = useChatStore();
  const clientsRef = useRef<Record<string, MqttClient>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const tempClients: Record<string, MqttClient> = {};

    pairs.forEach(({ user, ai }) => {
      const key = `${user}_${ai}`;
      const client = mqtt.connect(brokerUrl);
      tempClients[key] = client;
      clientsRef.current[key] = client;

      client.on("connect", () => {
        console.log(`MQTT connected for ${key}`);
        client.subscribe(`${ai}/agent`);   // user → AI
        client.subscribe(`${ai}/${user}`); // AI → user
      });

      client.on("message", (topic, msg) => {
        const text = msg.toString();
        if (!text) return;

        if (topic === `${ai}/agent` && !triggerAI) {
          // Ignore this on AI page
          return;
        } else if (topic === `${ai}/${user}`) {
          // Incoming AI message → store only
          addMessage(key, { sender: ai, text });
        }
      });
    });

    return () => {
      Object.values(tempClients).forEach((c) => c.end());
    };
  }, [pairs, brokerUrl, addMessage, triggerAI]);

  const sendMessage = async (user: string, ai: string) => {
    const key = `${user}_${ai}`;
    const client = clientsRef.current[key];
    const text = inputs[key]?.trim();
    if (!client || !text) return;

    // Add user message locally
    addMessage(key, { sender: user, text });

    // Publish via MQTT
    client.publish(`${ai}/agent`, text);

    // Call AI API only if triggerAI is true (user page)
    if (triggerAI) {
      try {
        const res = await fetch("/api/multi-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, message: text }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply =
            data?.messages?.find((m: any) => m.role === "assistant")?.content || "No reply";

          // Add AI reply locally
          addMessage(key, { sender: ai, text: reply });

          // Publish AI reply via MQTT
          client.publish(`${ai}/${user}`, reply, { retain: true });
        }
      } catch (err) {
        console.error("Assistant API error:", err);
      }
    }

    // Clear input
    setInputs((prev) => ({ ...prev, [key]: "" }));
  };

  return { messages, inputs, setInputs, sendMessage };
}
