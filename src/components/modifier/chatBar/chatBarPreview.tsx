'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSettingsStore } from '@/stores/settingsStore';
import defaultConfig from '../../../../data/modifier.json';
import { ChatbarSettings } from '@/types/Modifier';
import BubbleIcon from '@/components/icons/BubbleIcon';

interface ChatBarPreviewProps {
  settings?: ChatbarSettings;
  loading?: boolean;
}

export default function ChatBarPreview({ settings, loading: propLoading }: ChatBarPreviewProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { resolvedTheme } = useTheme();
  const { settings: storeSettings, loading: storeLoading, fetchSettings } = useSettingsStore();

  const defaultSettings: ChatbarSettings = {
    text: defaultConfig.chatBar.text || 'Chat with us',
    bgColor: defaultConfig.chatBar.bgColor || '#007bff',
    textColor: defaultConfig.chatBar.textColor || '#ffffff',
    iconColor: defaultConfig.chatBar.iconColor || defaultConfig.chatBar.textColor || '#ffffff',
    bubbleBgColor: defaultConfig.chatBar.bubbleBgColor || defaultConfig.chatBar.bgColor || '#007bff',
    dotsColor: defaultConfig.chatBar.dotsColor || defaultConfig.chatBar.textColor || '#ffffff',
  };

  const chatbarSettings: ChatbarSettings = {
    ...defaultSettings,
    ...(settings || storeSettings.chatBar),
  };

  useEffect(() => {
    setMounted(true);
    if (!settings) {
      console.log('Fetching chatbar settings...');
      fetchSettings('chatBar', defaultSettings);
    }
  }, [fetchSettings, settings]);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  console.log('ChatBarPreview settings:', chatbarSettings);

  if (!mounted) return null;

  if (propLoading || (!settings && storeLoading)) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="flex justify-center items-start">
          <Skeleton width={254.983} height={39.992} borderRadius={12.8} />
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className="flex justify-center items-start">
      <div
        data-testid="chatbar-container"
        className="w-[254.983px] h-[39.992px] rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md flex justify-between pl-4 pr-4 items-center"
        style={{
          backgroundColor: chatbarSettings.bgColor || '#007bff',
          color: chatbarSettings.textColor || '#ffffff',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span data-testid="chatbar-text" className="font-medium">
          {chatbarSettings.text || 'Chat with us'}
        </span>
        <span>
          <BubbleIcon
            iconColor={chatbarSettings.iconColor || chatbarSettings.textColor || '#ffffff'}
            bgColor={chatbarSettings.bubbleBgColor || chatbarSettings.bgColor || '#007bff'}
            dotsColor={chatbarSettings.dotsColor || chatbarSettings.textColor || '#ffffff'}
            hovered={isHovered}
            width={20}
            height={20}
          />
        </span>
      </div>
    </div>
  );
}