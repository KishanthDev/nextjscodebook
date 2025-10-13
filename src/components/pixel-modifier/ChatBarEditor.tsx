'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import ChatBarModifier from './chatbar/ChatBarModifier';
import ChatBarPreview from './chatbar/ChatBarPreview';
import { ChatbarSettings } from './chatbar/chatbartype';

const defaultSettings: ChatbarSettings = {
  text: 'Chat with us',
  bgColor: '#007bff',
  textColor: '#ffffff',
  gradientEnabled: false,
  gradientStops: [
    { color: '#007bff', pos: 0 },
    { color: '#a855f7', pos: 100 },
  ],
  gradientType: 'linear',
  gradientAngle: 90,
  iconType: 'lucide',
  iconColor: '#ffffff',
  lucideIcon: 'MessageCircle',
  iconImageUrl: '',
  iconFit: 'contain',
  iconOpacity: 1,
  iconBlend: 'normal',
  width: 255,
  height: 40,
  borderRadius: { tl: 20, tr: 20, bl: 20, br: 20 },
  shadow: true,
};

export default function ChatBarEditor() {
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    setIsDark(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const update = useCallback(
    <K extends keyof ChatbarSettings>(key: K, value: ChatbarSettings[K]) =>
      setSettings(s => ({ ...s, [key]: value })),
    []
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 rounded-lg h-[calc(100vh-114px)]">
      <ChatBarModifier settings={settings} update={update} />
      <ChatBarPreview settings={settings} isDark={isDark} />
    </div>
  );
}
