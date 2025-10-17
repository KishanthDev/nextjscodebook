'use client';

import React, { useState, useMemo } from 'react';
import { LucideIconMap } from '@/lib/lucide-icons';
import { ChatbarSettings } from './chatbartype';
import { SaveButton } from '../lib/SaveButton';
import { CopyDownloadButtons } from '../lib/CopyDownloadButtons';

interface PreviewProps {
  settings: ChatbarSettings;
}

export default function ChatBarPreview({ settings }: PreviewProps) {
  const [hovered, setHovered] = useState(false);

  const backgroundStyle = useMemo(() => {
    if (!settings.gradientEnabled) return settings.bgColor;
    const stops = settings.gradientStops.map(s => `${s.color} ${s.pos}%`).join(', ');
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

  // Generate border radius CSS from individual corner values
  const borderRadiusStyle = `${settings.borderRadius.tl}px ${settings.borderRadius.tr}px ${settings.borderRadius.br}px ${settings.borderRadius.bl}px`;

  const IconComponent = settings.iconType === 'lucide'
    ? LucideIconMap[settings.lucideIcon]
    : null;

  return (
    <div className="flex-1 relative bg-gray-50 dark:bg-neutral-800 rounded p-6 border border-gray-300 dark:border-neutral-700 flex justify-center rounded-lg items-center transition-colors duration-200">
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <CopyDownloadButtons settings={settings} filename='chatbar-settings.json' />
        <SaveButton type='chatbar' data={settings} />
      </div>

      <div
        className="flex justify-between items-center transition-all duration-200 cursor-pointer"
        style={{
          width: settings.width,
          height: settings.height,
          background: backgroundStyle,
          color: settings.textColor,
          borderRadius: borderRadiusStyle,
          boxShadow: settings.shadow
            ? '0 2px 8px rgba(0,0,0,0.2)'
            : 'none',
          padding: '0 12px',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          style={{
            fontSize: `${settings.textSize || 16}px`,
            letterSpacing: `${settings.letterSpacing || 0}px`,
          }}
          className="inline-block"
        >
          {settings.text || 'Chat with us'}
        </span>
        {settings.iconType === 'lucide' && IconComponent ? (
          <IconComponent
            color={settings.iconColor}
            width={settings.iconWidth || 24}
            height={settings.iconHeight || 24}
            style={{
              opacity: hovered ? 1 : 0.8,
            }}
          />
        ) : settings.iconType === 'image' && settings.iconImageUrl ? (
          <img
            src={settings.iconImageUrl}
            alt="icon"
            style={{
              objectFit: settings.iconFit,
              opacity: settings.iconOpacity,
              width: settings.iconWidth || 24,
              height: settings.iconHeight || 24,
              mixBlendMode: settings.iconBlend as any,
            }}
            className="rounded"
          />
        ) : null}
      </div>
    </div>
  );
}