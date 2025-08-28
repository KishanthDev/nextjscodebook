'use client';

import { useState } from 'react';
import clsx from 'clsx';

type Message = {
  fromUser: boolean;
  text: string;
};

export default function DialogflowTestChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Intent creation state
  const [intentName, setIntentName] = useState('');
  const [trainingPhrases, setTrainingPhrases] = useState('');
  const [responses, setResponses] = useState('');
  const [intentLoading, setIntentLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { fromUser: true, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/training/intents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', message: userMsg.text }),
      });

      const data = await res.json();
      const botMsg: Message = { fromUser: false, text: data.reply || 'No response' };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { fromUser: false, text: 'Error connecting to Dialogflow' }]);
    } finally {
      setLoading(false);
    }
  };

  const createIntent = async () => {
    if (!intentName.trim()) return;

    setIntentLoading(true);
    try {
      const res = await fetch('/api/training/intents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          displayName: intentName,
          trainingPhrases: trainingPhrases.split('\n').filter(Boolean),
          responses: responses.split('\n').filter(Boolean),
        }),
      });
      const data = await res.json();
      console.log('Created Intent:', data);
      setIntentName('');
      setTrainingPhrases('');
      setResponses('');
      alert('Intent created successfully!');
    } catch (err) {
      console.error(err);
      alert('Error creating intent');
    } finally {
      setIntentLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex h-[500px] w-full border rounded-lg overflow-hidden">
      {/* Chat Panel on the left */}
      <div className="flex-1 flex flex-col border-r">
        {/* Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-900">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={clsx(
                'px-3 py-2 rounded-lg max-w-[80%] break-words',
                msg.fromUser
                  ? 'self-end bg-blue-600 text-white'
                  : 'self-start bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
              )}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="self-start bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300">
              Typing...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex p-2 border-t bg-white dark:bg-gray-800">
          <input
            type="text"
            className="flex-1 border rounded-l-md px-3 py-2 dark:bg-gray-700 dark:text-white"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>

      {/* Intent creation panel on the right */}
      <div className="w-[350px] p-4 bg-gray-100 dark:bg-gray-800 space-y-3">
        <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Create Intent</h2>
        <input
          type="text"
          className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
          placeholder="Intent display name"
          value={intentName}
          onChange={(e) => setIntentName(e.target.value)}
        />
        <textarea
          className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
          placeholder="Training phrases (one per line)"
          value={trainingPhrases}
          onChange={(e) => setTrainingPhrases(e.target.value)}
          rows={3}
        />
        <textarea
          className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
          placeholder="Responses (one per line)"
          value={responses}
          onChange={(e) => setResponses(e.target.value)}
          rows={3}
        />
        <button
          className="w-full px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={createIntent}
          disabled={intentLoading}
        >
          {intentLoading ? 'Creating...' : 'Create Intent'}
        </button>
      </div>
    </div>
  );
}
