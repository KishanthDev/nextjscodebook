'use client';
import { useEffect, useRef, useState } from "react";
import mqtt, { MqttClient } from "mqtt";
import { useChatStore } from "./chatStore";

export interface UserPair {
  user: string;
  ai: string;
}

export interface ChatMessage {
  sender: string;
  text: string;
  senderType: "user" | "ai" | "agent";
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
        client.subscribe(`${ai}/agent`);   // user or agent → AI
        client.subscribe(`${ai}/${user}`); // AI or agent → user
      });

      client.on("message", (topic, msg) => {
        const text = msg.toString();
        if (!text) return;

        if (topic === `${ai}/agent` && !triggerAI) {
          // Agent message on AI page
          addMessage(key, { sender: "Agent", text, senderType: "agent" });
        } else if (topic === `${ai}/${user}`) {
          // Incoming AI or agent message
          const senderType = triggerAI ? "ai" : "agent";
          const sender = senderType === "ai" ? ai : "Agent";
          addMessage(key, { sender, text, senderType });
        }
      });
    });

    return () => {
      Object.values(tempClients).forEach((c) => c.end());
    };
  }, [pairs, brokerUrl, addMessage, triggerAI]);

  const sendMessage = async (user: string, ai: string, senderType: "user" | "agent") => {
    const key = `${user}_${ai}`;
    const client = clientsRef.current[key];
    const text = inputs[key]?.trim();
    if (!client || !text) return;

    // Add message locally
    const sender = senderType === "user" ? user : "Agent";
    addMessage(key, { sender, text, senderType });

    // Publish via MQTT
    const topic = senderType === "user" ? `${ai}/agent` : `${ai}/${user}`;
    client.publish(topic, text, { retain: true });

    // Call AI API only if triggerAI is true and sender is user
    if (triggerAI && senderType === "user") {
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
          addMessage(key, { sender: ai, text: reply, senderType: "ai" });

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