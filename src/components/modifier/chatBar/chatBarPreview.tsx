'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSettingsStore } from '@/stores/settingsStore';
import { ChatbarSettings } from '@/types/Modifier';
import BubbleIcon from '@/components/icons/BubbleIcon';

type ChatBarPreviewProps = {
  defaultSettings: ChatbarSettings; // SSR injected
};

export default function ChatBarPreview({ defaultSettings }: ChatBarPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { resolvedTheme } = useTheme();
  const { settings, loading } = useSettingsStore();

  // mark mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // detect dark mode
  useEffect(() => {
    if (mounted) setIsDarkMode(resolvedTheme === 'dark');
  }, [mounted, resolvedTheme]);

  const chatbarSettings: ChatbarSettings = {
    ...defaultSettings,
    ...settings?.chatBar,
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="flex justify-center items-center p-4">
          <Skeleton width={255} height={40} borderRadius={12} />
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className="w-[255px] h-[40px] rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md flex justify-between pl-4 pr-4 items-center"
        style={{
          backgroundColor: chatbarSettings.bgColor || '#007bff',
          color: chatbarSettings.textColor || '#ffffff',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="font-medium">{chatbarSettings.text || 'Chat with us'}</span>
        <BubbleIcon
          iconColor={chatbarSettings.iconColor || chatbarSettings.textColor || '#ffffff'}
          bgColor={chatbarSettings.bubbleBgColor || chatbarSettings.bgColor || '#007bff'}
          dotsColor={chatbarSettings.dotsColor || chatbarSettings.textColor || '#ffffff'}
          hovered={isHovered}
          width={20}
          height={20}
        />
      </div>
    </div>
  );
}
