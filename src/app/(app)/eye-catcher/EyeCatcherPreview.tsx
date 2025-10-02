'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSettingsStore } from '@/stores/settingsStore';
import { EyecatcherSettings } from '@/types/Modifier';

type Props = {
  defaultSettings: EyecatcherSettings; // SSR-injected
};

export default function EyecatcherPreview({ defaultSettings }: Props) {
  const { settings } = useSettingsStore();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) setIsDarkMode(resolvedTheme === 'dark');
  }, [mounted, resolvedTheme]);

  // ✅ Merge SSR defaults with store settings (if any)
  const eyeCatcherSettings: EyecatcherSettings = {
    ...defaultSettings,
    ...settings?.eyeCatcher,
  };

  if (!mounted) return null;

  // ✅ Never show skeleton if we have SSR defaults
  // Skeleton can be used only during theme mount
  const showSkeleton = false; 

  if (showSkeleton) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="flex justify-center items-start p-6">
          <Skeleton width={208} height={96} borderRadius={8} />
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className="flex justify-center items-start p-6">
      <div
        className="flex w-[13rem] p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md"
        style={{
          backgroundColor: eyeCatcherSettings.bgColor || '#007bff',
          color: eyeCatcherSettings.textColor || '#ffffff',
        }}
      >
        <span
          className="text-3xl animate-wave flex-shrink-0 mr-3"
          style={{ animationDuration: '1.5s' }}
        >
          👋
        </span>
        <div className="flex flex-col min-w-0">
          <h3 className="font-bold text-sm leading-tight break-words">
            {eyeCatcherSettings.title || 'Hello'}
          </h3>
          <p className="text-xs break-words whitespace-normal">
            {eyeCatcherSettings.text || 'Click to chat with us'}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
        }
        .animate-wave {
          display: inline-block;
          animation: wave 1.5s infinite;
          transform-origin: 70% 70%;
        }
      `}</style>
    </div>
  );
}
