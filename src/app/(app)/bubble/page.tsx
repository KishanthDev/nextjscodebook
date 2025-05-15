'use client';
import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import data from "../../../../data/modifier.json";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';

type BubbleSettings = {
  bgColor: string;
  iconColor: string;
  dotsColor: string;
};

export default function Page() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  const defaultSettings: BubbleSettings = data.bubble;
  const { settings, loading } = useSettings<BubbleSettings>({
    section: 'bubble',
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
          style={{ backgroundColor: settings.bgColor }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {!isHovered ? (
            <svg
              data-testid="bubble-icon"
              viewBox="0 0 32 32"
              width="28"
              height="28"
              aria-hidden="true"
            >
              <path
                fill={settings.iconColor}
                d="M12.63,26.46H8.83a6.61,6.61,0,0,1-6.65-6.07,89.05,89.05,0,0,1,0-11.2A6.5,6.5,0,0,1,8.23,3.25a121.62,121.62,0,0,1,15.51,0A6.51,6.51,0,0,1,29.8,9.19a77.53,77.53,0,0,1,0,11.2,6.61,6.61,0,0,1-6.66,6.07H19.48L12.63,31V26.46Z"
              />
              <path
                fill={settings.bgColor}
                d="M19.57,21.68h3.67a2.08,2.08,0,0,0,2.11-1.81,89.86,89.86,0,0,0,0-10.38,1.9,1.9,0,0,0-1.84-1.74,113.15,113.15,0,0,0-15,0A1.9,1.9,0,0,0,6.71,9.49a74.92,74.92,0,0,0-.06,10.38,2,2,0,0,0,2.1,1.81h3.81V26.5Z"
              />
            </svg>
          ) : (
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <span
                  data-testid="bubble-dot"
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: settings.dotsColor,
                    animation: `jump 1.2s infinite ease-in-out ${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes jump {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}