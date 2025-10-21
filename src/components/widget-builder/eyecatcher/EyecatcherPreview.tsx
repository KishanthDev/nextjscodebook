'use client';

import React, { useMemo } from 'react';
import { EyecatcherSettings } from './eyecatchertype';
import { SaveButton } from '../lib/SaveButton';
import { CopyDownloadButtons } from '../lib/CopyDownloadButtons';

interface PreviewProps {
  settings: EyecatcherSettings;
}

export default function EyecatcherPreview({ settings }: PreviewProps) {
  const backgroundStyle = useMemo(() => {
    if (!settings.gradientEnabled) return settings.bgColor;
    const stops = settings.gradientStops.map((s) => `${s.color} ${s.pos}%`).join(', ');
    switch (settings.gradientType) {
      case 'linear':
        return `linear-gradient(${settings.gradientAngle}deg, ${stops})`;
      case 'radial':
        return `radial-gradient(circle, ${stops})`;
      case 'conic':
        return `conic-gradient(from ${settings.gradientAngle}deg, ${stops})`;
      default:
        return settings.bgColor;
    }
  }, [
    settings.gradientEnabled,
    settings.gradientType,
    settings.gradientAngle,
    settings.gradientStops,
    settings.bgColor,
  ]);

  const borderRadiusStyle = `${settings.borderRadius.tl}px ${settings.borderRadius.tr}px ${settings.borderRadius.br}px ${settings.borderRadius.bl}px`;

  const shadowStyle = settings.shadow
    ? `${settings.shadowX}px ${settings.shadowY}px ${settings.shadowBlur}px ${settings.shadowColor}`
    : 'none';

  const borderStyle = settings.borderEnabled
    ? `${settings.borderWidth}px solid ${settings.borderColor}`
    : 'none';

  const getAnimationClass = () => {
    if (!settings.animationEnabled || settings.animationType === 'none') return '';
    return `animate-${settings.animationType}`;
  };

  const getFlexDirection = () => {
    if (settings.emojiPosition === 'top') return 'flex-col';
    if (settings.emojiPosition === 'right') return 'flex-row-reverse';
    return 'flex-row';
  };

  const getAlignmentClass = () => {
    if (settings.contentAlignment === 'center') return 'items-center text-center';
    if (settings.contentAlignment === 'right') return 'items-end text-right';
    return 'items-start text-left';
  };

  return (
    <div className="flex-1 relative bg-gray-50 dark:bg-neutral-800 rounded-lg p-6 flex justify-center items-center transition-colors duration-200">
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <CopyDownloadButtons settings={settings} filename="eyecatcher-settings.json" />
      </div>

      <div
        className={`flex cursor-pointer transition-all duration-300 hover:scale-105 ${getFlexDirection()} ${getAlignmentClass()}`}
        style={{
          width: settings.width,
          minHeight: settings.height,
          background: backgroundStyle,
          borderRadius: borderRadiusStyle,
          boxShadow: shadowStyle,
          border: borderStyle,
          padding: `${settings.padding}px`,
          gap: `${settings.gap}px`,
        }}
      >
        <span
          className={`flex-shrink-0 ${getAnimationClass()}`}
          style={{
            fontSize: `${settings.emojiSize}px`,
            animationDuration: `${settings.animationDuration}s`,
          }}
        >
          {settings.emoji}
        </span>
        <div className="flex flex-col min-w-0 justify-center flex-1">
          <h3
            className="font-bold leading-tight break-words"
            style={{
              fontSize: `${settings.titleSize}px`,
              fontWeight: settings.titleWeight,
              letterSpacing: `${settings.letterSpacing}px`,
              color: settings.titleColor,
            }}
          >
            {settings.title}
          </h3>
          <p
            className="break-words whitespace-normal"
            style={{
              fontSize: `${settings.textSize}px`,
              color: settings.textColor,
            }}
          >
            {settings.text}
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
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-wave {
          display: inline-block;
          animation: wave infinite;
          transform-origin: 70% 70%;
        }
        .animate-bounce {
          display: inline-block;
          animation: bounce infinite;
        }
        .animate-pulse {
          display: inline-block;
          animation: pulse infinite;
        }
        .animate-rotate {
          display: inline-block;
          animation: rotate infinite;
        }
      `}</style>
    </div>
  );
}