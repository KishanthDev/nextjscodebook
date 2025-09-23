// HiveConsumer.tsx (with global connection)
'use client';
import { useEffect, useState } from 'react';
import { useUserMessageHandler } from '@/stores/userMessageHandler';

export default function HiveConsumer() {
  const [clientId] = useState(() => 'user-2');
  const { messages, sendMessage } = useUserMessageHandler();
  const [input, setInput] = useState('');
  
    // Initialize MQTT connection
    useEffect(() => {
      // Ensure connection only if not already connected
      if (!useUserMessageHandler.getState().client) {
        useUserMessageHandler.getState().connect("nextjs/poc/s", clientId);
      }
      return () => {
        // Keep connection alive to ensure AI works across routes
        // Optionally disconnect on app logout: useAIMessageHandler.getState().disconnect();
      };
    }, [clientId]);

  return (
    <div className="p-6 border rounded w-[400px]">
      <h2 className="text-xl font-bold mb-4">HiveMQ Consumer (User2)</h2>

      <div className="h-48 overflow-y-auto border p-2 mb-4">
        {messages.map((msg, i) => (
          <p
            key={msg.id || i}
            className={msg.sender === clientId ? 'text-right' : 'text-left'}
          >
            <b>{msg.sender === clientId ? 'Me' : msg.sender}:</b> {msg.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
        className="border p-2 mr-2 w-[70%]"
      />

      <button
        onClick={() => {
          sendMessage(input);
          setInput('');
        }}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}