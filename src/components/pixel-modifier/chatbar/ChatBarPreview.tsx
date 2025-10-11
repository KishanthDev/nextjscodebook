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
          width: `${settings.width}px`,
          height: `${settings.height}px`,
          background: backgroundStyle,
          color: settings.textColor,
          borderRadius: `${settings.borderRadius}px`,
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
            size={20}
            color={settings.iconColor}
            className={hovered ? 'opacity-100' : 'opacity-80'}
          />
        ) : settings.iconImageUrl ? (
          <img
            src={settings.iconImageUrl}
            alt="icon"
            width={20}
            height={20}
            style={{
              objectFit: settings.iconFit,
              opacity: settings.iconOpacity,
              mixBlendMode: settings.iconBlend as any,
            }}
            className="rounded"
          />
        ) : null}
      </div>
    </div>
  );
}
