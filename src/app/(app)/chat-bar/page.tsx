'use client';

import { useSettings } from '@/hooks/useSettings';
import data from '../../../../data/modifier.json';
import Loader from '@/components/loader/Loader';

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

  if (loading) return (
    <div className="flex justify-center min-h-[calc(100vh-64px)] items-center">
      <Loader />
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
