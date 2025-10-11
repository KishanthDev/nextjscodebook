'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import ChatWidgetModifier from './ChatWidgetModifier';
import ChatWidgetPreview from './ChatWidgetPreview';
import { ChatWidgetSettings } from './chat-widget-types';

const defaultSettings: ChatWidgetSettings = {
  width: 260,
  height: 300,
  borderRadius: 12,

  bgColor: '#ffffff',
  gradientEnabled: false,
  gradientType: 'linear',
  gradientAngle: 90,
  gradientStops: [
    { color: '#ffffff', pos: 0 },
    { color: '#f3f3f3', pos: 100 },
  ],

  headerBgColor: '#ffffff',
  headerTextColor: '#111827',
  logoUrl: '',
  chatTitle: 'Support Chat',

  userMsgBgColor: '#e5e7eb',
  botMsgBgColor: '#f3f4f6',
  messagesBgColor: '#ffffff',
  msgTextColor: '#111827',
  fontFamily: 'Inter',
  fontSize: 14,

  inputBgColor: '#ffffff',
  inputBorderColor: '#d1d5db',
  inputTextColor: '#111827',
  inputPlaceholder: 'Type a message…',

  sendBtnBgColor: '#3b82f6',
  sendBtnIconColor: '#000000ff',

  soundsEnabled: true,
  soundProfile: 'pop',

  footerBgColor: '#f9fafb',
  footerTextColor: '#6b7280',
  footerText: 'Powered by ChatWidget',

  messages: [],
};

export default function ChatWidgetEditor() {
  const { resolvedTheme } = useTheme();
  const [settings, setSettings] = useState<ChatWidgetSettings>(defaultSettings);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const update = useCallback(
    <K extends keyof ChatWidgetSettings>(key: K, value: ChatWidgetSettings[K]) => {
      setSettings(s => ({ ...s, [key]: value }));
    },
    []
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 rounded-lg h-[calc(100vh-114px)]">
      <ChatWidgetModifier settings={settings} update={update} isDarkMode={isDarkMode} />
      <ChatWidgetPreview settings={settings} />
    </div>
  );
}
