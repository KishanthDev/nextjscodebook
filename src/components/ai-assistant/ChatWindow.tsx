'use client';

import React from 'react';

interface Message {
  sender: string; // "user" or "AI Name"
  text: string;
}

interface ChatWindowProps {
  messages: Message[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="border h-96 overflow-auto p-2 mb-2">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`mb-1 ${m.sender === 'user' ? 'text-left' : 'text-right'}`}
        >
          <span
            className={`inline-block p-1 rounded ${
              m.sender === 'user' ? 'bg-gray-200' : 'bg-blue-200'
            }`}
          >
            {m.sender !== 'user' ? `${m.sender}: ` : ''}
            {m.text}
          </span>
        </div>
      ))}
    </div>
  );
};
