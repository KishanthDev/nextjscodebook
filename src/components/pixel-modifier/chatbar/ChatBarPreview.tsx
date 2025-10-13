'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/ui/button';
import { toast } from 'sonner';
import { LucideIconMap } from '@/lib/lucide-icons';
import { ChatbarSettings } from './chatbartype';

interface PreviewProps {
  settings: ChatbarSettings;
  isDark: boolean;
}

export default function ChatBarPreview({ settings, isDark }: PreviewProps) {
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
      toast.success('ChatBar settings copied to clipboard!');
    } catch (err) {
      toast.error(`Failed to copy: ${String(err)}`);
      alert('Failed to copy settings. Check console.');
    }
  };

  const downloadSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatbar-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 relative bg-gray-50 rounded p-6 flex justify-center items-center">
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <Button size="sm" onClick={copyToClipboard}>
          Copy Settings
        </Button>
        <Button variant="outline" size="sm" onClick={downloadSettings}>
          Download
        </Button>
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
            ? isDark
              ? '0 2px 8px rgba(0,0,0,0.6)'
              : '0 2px 8px rgba(0,0,0,0.2)'
            : 'none',
          padding: '0 12px',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="font-medium">{settings.text}</span>
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
