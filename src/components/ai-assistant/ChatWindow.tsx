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
        <div className="border h-96 overflow-auto p-2 mb-2 flex flex-col gap-1">
            {messages.map((m, i) => {
                const isUser = m.sender === 'user';
                return (
                    <div
                        key={i}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <span
                            className={`inline-block px-3 py-1 rounded-lg max-w-xs break-words ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                }`}
                        >
                            {!isUser && <strong>{m.sender}: </strong>}
                            {m.text}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
