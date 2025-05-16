'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { useSettings } from '@/hooks/useSettings';

type ChatWidgetSettings = {
  headingColor: string;
  paraColor: string;
  freeTrialBtnColor: string;
  expertBtnColor: string;
  headingText: string;
  paraText: string;
  imageUrl: string;
};

const CloseIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
    <path d="M17.4,16l5.3,5.3c0.4,0.4,0.4,1,0,1.4c-0.4,0.4-1,0.4-1.4,0L16,17.4l-5.3,5.3c-0.4,0.4-1,0.4-1.4,0 c-0.4-0.4-0.4-1,0-1.4l5.3-5.3l-5.3-5.3c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4,0.4,1-0.4,1.4,0 c0.4,0.4,0.4,1,0,1.4L17.4,16z" />
  </svg>
);

export default function Greeting() {
  const defaultSettings: ChatWidgetSettings = {
    headingColor: '#333333',
    paraColor: '#666666',
    freeTrialBtnColor: '#f97316',
    expertBtnColor: '#000000',
    headingText: 'Welcome to LiveChat!',
    paraText: 'Sign up free or talk with our product experts',
    imageUrl: '/landingpage/hello01.png',
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  const { settings, loading } = useSettings<ChatWidgetSettings>({
    section: 'greeting',
    defaultSettings,
  });

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
        <div className="flex justify-center items-center p-6">
          <div className="relative w-[230px] mx-auto">
            <div className="absolute -top-7 right-0">
              <Skeleton width={24} height={24} circle />
            </div>
            <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
              <Skeleton width={230} height={150} />
              <div className="p-3.5 space-y-2">
                <Skeleton width={180} height={20} />
                <Skeleton width={200} height={16} />
              </div>
              <div className="px-2 pb-2 pt-[7px] space-y-2">
                <Skeleton width={206} height={40} borderRadius={6} />
                <Skeleton width={206} height={40} borderRadius={6} />
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

 return (
  <div className="flex justify-center items-center p-6">
    <div
      className="relative w-[230px] mx-auto group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute -top-7 right-0 z-20 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button aria-label="Hide greeting" style={{ color: settings.headingColor }}>
          <CloseIcon />
        </button>
      </div>

      <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex">
          <Image
            src={settings.imageUrl || "/landingpage/hello01.png"}
            alt="Hello"
            width={230}
            height={150}
            className="object-cover w-full"
          />
        </div>

        <div className="p-3.5 text-sm leading-snug break-words w-full overflow-hidden">
          <h2 className="mb-2 font-semibold" style={{ color: settings.headingColor }}>
            {settings.headingText}
          </h2>
          <p style={{ color: settings.paraColor }}>
            {settings.paraText}
          </p>
        </div>

        <ul className="flex flex-col gap-2 px-2 pb-2 pt-[7px]">
          <li>
            <button
              className="w-full flex justify-center px-4 py-2 text-white rounded-md transition text-sm"
              style={{ backgroundColor: settings.freeTrialBtnColor }}
            >
              Free trial
            </button>
          </li>
          <li>
            <button
              className="w-full flex justify-center items-center px-4 py-2 text-white rounded-md transition text-sm"
              style={{ backgroundColor: settings.expertBtnColor }}
            >
              <span className="mr-2">💬</span> Product expert
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

}
