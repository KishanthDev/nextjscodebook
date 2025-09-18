"use client";
import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function HiveConsumer() {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

        client.on("connect", () => {
            console.log("✅ Consumer connected to HiveMQ");
            client.subscribe("nextjs/poc/test");
        });

        client.on("message", (topic, payload) => {
            setMessages((prev) => [...prev, payload.toString()]);
        });

        return () => { client.end(); };
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">HiveMQ Consumer</h2>
            <div className="border p-2 h-48 overflow-y-auto">
                {messages.map((msg, i) => (
                    <p key={i}>{msg}</p>
                ))}
            </div>
        </div>
    );
}
