'use client';

import { useSettings } from '@/hooks/useSettings';
import data from '../../../../data/modifier.json';

type ChatBarSettings = {
  text: string;
  bgColor: string;
  textColor: string;
};


export default function ChatBarComponent() {
  const defaultSettings: ChatBarSettings = data.chatbar;

  const { settings, loading } = useSettings<ChatBarSettings>({
    section: 'chatBar',
    defaultSettings,
  });

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (!settings) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Preview Panel */}
      <div className="flex justify-center items-start">
        <div
          data-testid="chatbar-container"
          className="w-full max-w-md p-3 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md flex justify-center items-center"
          style={{
            backgroundColor: settings.bgColor,
            color: settings.textColor
          }}
        >
          <span data-testid="chatbar-text" className="font-medium">{settings.text}</span>
        </div>
      </div>
    </div>
  );
}
