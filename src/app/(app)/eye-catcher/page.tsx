'use client';

import { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { useSettingsStore } from '@/stores/settingsStore';

type EyecatcherSettings = {
  title: string;
  text: string;
  bgColor: string;
  textColor: string;
};

const defaultSettings: EyecatcherSettings = {
  title: 'Hello',
  text: 'Click to chat with us',
  bgColor: '#007bff',
  textColor: '#ffffff',
};

export default function EyecatcherPreview() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  const { settings, loading, fetchSettings } = useSettingsStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  useEffect(() => {
    fetchSettings('eyeCatcher', defaultSettings);
  }, [fetchSettings]);

  const eyeCatcherSettings = settings['eyeCatcher'] as EyecatcherSettings;

  if (!mounted) return null;

  if (loading || !eyeCatcherSettings) {
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
          backgroundColor: eyeCatcherSettings.bgColor,
          color: eyeCatcherSettings.textColor,
        }}
      >
        <span className="text-3xl animate-wave flex-shrink-0 mr-3" style={{ animationDuration: '1.5s' }}>
          👋
        </span>
        <div className="flex flex-col min-w-0">
          <h3 className="font-bold text-sm leading-tight break-words">{eyeCatcherSettings.title}</h3>
          <p className="text-xs break-words whitespace-normal">{eyeCatcherSettings.text}</p>
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
