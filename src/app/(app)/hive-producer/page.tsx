"use client";
import { useState, useEffect } from "react";
import mqtt from "mqtt";

export default function HiveProducer() {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const mqttClient = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");
    setClient(mqttClient);

    mqttClient.on("connect", () => {
      console.log("✅ Producer connected to HiveMQ");
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  const sendMessage = () => {
    if (client && input) {
      client.publish("nextjs/poc/test", input);
      setInput("");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">HiveMQ Producer</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
        className="border p-2 mr-2"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}
