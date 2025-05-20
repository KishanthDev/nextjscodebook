'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSettingsStore } from '@/stores/settingsStore';
import defaultConfig from '../../../../data/modifier.json';
import { BubbleSettings } from '@/types/Modifier';
import BubbleIcon from '@/components/icons/BubbleIcon';

export default function Bubble() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const { settings, loading, fetchSettings } = useSettingsStore();

  const defaultSettings: BubbleSettings = defaultConfig.bubble;

  useEffect(() => {
    setMounted(true);
    console.log('Fetching bubble settings...');
    fetchSettings('bubble', defaultSettings);
  }, [fetchSettings]);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  const bubbleSettings: BubbleSettings = {
    ...defaultSettings,
    ...settings.bubble,
  };

  console.log('Bubble settings:', bubbleSettings);

  if (!mounted) return null;

  if (loading) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-center items-center">
            <Skeleton circle height={64} width={64} />
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-center items-center">
        <div
          data-testid="bubble-container"
          className="relative flex items-center justify-center rounded-full w-16 h-16 transition-colors duration-300 cursor-pointer"
          style={{ backgroundColor: bubbleSettings.bgColor || '#ff5101' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <BubbleIcon
            iconColor={bubbleSettings.iconColor}
            bgColor={bubbleSettings.bgColor}
            dotsColor={bubbleSettings.dotsColor}
            hovered={isHovered}
          />
        </div>
      </div>
    </div>
  );
}