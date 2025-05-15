'use client';
import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import data from '../../../../data/modifier.json';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  if (!mounted) return null;

  if (loading) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-center items-start">
            <Skeleton width={448} height={48} borderRadius={8} />
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