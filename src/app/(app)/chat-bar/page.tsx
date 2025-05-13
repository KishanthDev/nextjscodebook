'use client';

import { useEffect, useState } from 'react';
import data from '../../../../data/modifier.json';

type ChatBarSettings = {
  text: string;
  bgColor: string;
  textColor: string;
};


export default function ChatBarComponent() {
  const [settings, setSettings] = useState<ChatBarSettings | null>(null);
  const defaultSettings: ChatBarSettings = data.chatbar;

  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chatBarSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Failed to parse settings from localStorage', error);
        setSettings(defaultSettings);
      }
    } else {
      setSettings(defaultSettings);
    }
  }, [defaultSettings]);

  // Avoid rendering anything until settings are initialized (hydration-safe)
  if (!settings) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Preview Panel */}
      <div className="flex justify-center items-start">
        <div
          className="w-full max-w-md p-3 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md flex justify-center items-center"
          style={{
            backgroundColor: settings.bgColor,
            color: settings.textColor
          }}
        >
          <span className="font-medium">{settings.text}</span>
        </div>
      </div>
    </div>
  );
}
