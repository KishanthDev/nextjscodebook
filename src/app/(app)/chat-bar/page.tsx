'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSettingsStore } from '@/stores/settingsStore';
import defaultConfig from '../../../../data/modifier.json';
import { ChatbarSettings } from '@/types/Modifier';

export default function ChatBar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const { settings, loading, fetchSettings } = useSettingsStore();

  const defaultSettings: ChatbarSettings = defaultConfig.chatBar;

  useEffect(() => {
    setMounted(true);
    console.log('Fetching chatbar settings...');
    fetchSettings('chatBar', defaultSettings);
  }, [fetchSettings]);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  const chatbarSettings: ChatbarSettings = {
    ...defaultSettings,
    ...settings.chatBar,
  };

  console.log('ChatBar settings:', chatbarSettings);

  if (!mounted) return null;

  if (loading) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-center items-start">
            <Skeleton width={254.983} height={39.992} borderRadius={12.8} />
          </div>
        </div>
      </SkeletonTheme>

    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-center items-start">
        <div
          data-testid="chatbar-container"
          className="w-[254.983px] h-[39.992px]  rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md flex justify-center items-center"
          style={{
            backgroundColor: chatbarSettings.bgColor || '#007bff',
            color: chatbarSettings.textColor || '#ffffff',
          }}
        >
          <span data-testid="chatbar-text" className="font-medium">
            {chatbarSettings.text || 'Chat with us'}
          </span>
        </div>
      </div>
    </div>
  );
}