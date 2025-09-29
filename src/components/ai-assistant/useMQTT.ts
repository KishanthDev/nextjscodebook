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
                let messageKey = keyBy === "user" ? user : ai;

                if (topic === `${ai}/agent`) {
                    // User sent a message → call API
                    sender = user;

                    setMessages((prev) => ({
                        ...prev,
                        [messageKey]: [...(prev[messageKey] || []), { sender, text }],
                    }));

                    try {
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

                            // Push reply into state
                            setMessages((prev) => ({
                                ...prev,
                                [messageKey]: [...(prev[messageKey] || []), { sender: ai, text: reply }],
                            }));

                            // Publish only if other clients need it
                            // client.publish(`${ai}/${user}`, reply); // optional
                        }
                    } catch (err) {
                        console.error("Assistant API error:", err);
                    }
                } else if (topic === `${ai}/${user}`) {
                    // Incoming assistant message from MQTT → don't call API again
                    sender = ai;

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
        setInputs((prev) => ({ ...prev, [key]: "" }));
    };

    return { messages, inputs, setInputs, sendMessage };
}
