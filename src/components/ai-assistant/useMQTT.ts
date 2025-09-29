'use client';
import { useEffect, useState } from "react";
import { createMQTTClient } from "./mqttClient";

export type Message = { sender: string; text: string };

export interface UserPair {
    user: string;
    ai: string;
}

export function useMQTTChat(
    pairs: UserPair[],
    brokerUrl: string,
    keyBy: "user" | "ai" = "user"
) {
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [clients, setClients] = useState<Record<string, any>>({});

    useEffect(() => {
        const tempClients: Record<string, any> = {};
        const tempMessages: Record<string, Message[]> = {};
        const tempInputs: Record<string, string> = {};

        pairs.forEach(({ user, ai }) => {
            const client = createMQTTClient(brokerUrl);
            const key = keyBy === "user" ? user : ai;

            tempClients[key] = client;
            tempMessages[key] = [];
            tempInputs[key] = "";

            client.on("connect", () => {
                client.subscribe(`${ai}/agent`);     // user → AI
                client.subscribe(`${ai}/${user}`);  // AI → user
            });

            client.on("message", async (topic, msg) => {
  const text = msg.toString();
  let sender = "";
  let messageKey = key;

  if (topic === `${ai}/agent`) {
    // User sent a message
    sender = user;

    setMessages((prev) => ({
      ...prev,
      [messageKey]: [...(prev[messageKey] || []), { sender, text }],
    }));

    // Call Assistant API
    const res = await fetch("/api/multi-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, message: text }),
    });

    if (res.ok) {
      const data = await res.json();
      const reply =
        data?.messages?.find((m: any) => m.role === "assistant")?.content ||
        "No reply";

      // Push reply into messages state
      setMessages((prev) => ({
        ...prev,
        [messageKey]: [
          ...(prev[messageKey] || []),
          { sender: ai, text: reply },
        ],
      }));

      // (Optional) publish reply back via MQTT so other clients see it
      client.publish(`${ai}/${user}`, reply);
    }
  } else if (topic === `${ai}/${user}`) {
    // Assistant message from broker
    sender = ai;
    if (keyBy === "ai") messageKey = ai;
    else messageKey = user;

    setMessages((prev) => ({
      ...prev,
      [messageKey]: [...(prev[messageKey] || []), { sender, text }],
    }));
  }
});


        });

        setClients(tempClients);
        setMessages(tempMessages);
        setInputs(tempInputs);

        return () => {
            Object.values(tempClients).forEach((c) => c.end());
        };
    }, [pairs, brokerUrl, keyBy]);

    const sendMessage = (key: string) => {
        const pair = pairs.find((p) =>
            keyBy === "user" ? p.user === key : p.ai === key
        );
        if (!pair) return;

        const client = clients[key];
        const msg = inputs[key];
        if (!client || !msg) return;

        if (keyBy === "user") {
            client.publish(`${pair.ai}/agent`, msg);
        } else {
            client.publish(`${pair.ai}/${pair.user}`, msg);
        }

        setMessages((prev) => ({
            ...prev,
            [key]: [
                ...(prev[key] || []),
                { sender: keyBy === "user" ? pair.user : pair.ai, text: msg },
            ],
        }));

        setInputs((prev) => ({ ...prev, [key]: "" }));
    };

    return { messages, inputs, setInputs, sendMessage };
}
