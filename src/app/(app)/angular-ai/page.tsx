'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';

export default function Page() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/openai',
    }),
  });
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-55px)] bg-gray-100">
      {/* Header */}
      <header className="bg-green-500 text-white p-4 text-lg font-semibold shadow-md">
        Angular AI Chat
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && !error && (
          <p className="text-gray-500 text-center mt-10 italic">
            No messages yet — start the conversation!
          </p>
        )}

        {error && (
          <div className="text-red-600 text-center mt-6 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="font-semibold">⚠️ Oops, something went wrong</p>
            <p className="text-sm mt-1">
              {error.message || 'Unknown error occurred.'}
            </p>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow whitespace-pre-line
                ${
                  message.role === 'user'
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}
            >
              {/* Render message text directly */}
              {message.parts
                .filter(part => part.type === 'text')
                .map((part, index) => (
                  <p key={index} className="text-sm leading-relaxed">
                    {part.text}
                  </p>
                ))}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
        className="p-4 bg-white border-t border-gray-300 flex gap-3"
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={status !== 'ready'}
          placeholder="Type a message..."
          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status !== 'ready'}
          className="px-5 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition disabled:opacity-50"
        >
          {status === 'streaming' ? '...' : 'Send 🚀'}
        </button>
      </form>
    </div>
  );
}
