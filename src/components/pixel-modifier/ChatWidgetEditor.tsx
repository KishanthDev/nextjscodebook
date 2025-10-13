'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import ChatWidgetModifier from './ChatWidgetModifier';
import ChatWidgetPreview from './ChatWidgetPreview';
import { ChatWidgetSettings } from './chat-widget-types';

const defaultSettings: ChatWidgetSettings = {
  "width": 260,
  "height": 300,
  "borderRadius": 12,
  "bgColor": "#ffffff",
  "gradientEnabled": false,
  "gradientType": "linear",
  "gradientAngle": 90,
  "gradientStops": [
    {
      "color": "#ffffff",
      "pos": 0
    },
    {
      "color": "#f3f3f3",
      "pos": 100
    }
  ],
  "headerBgColor": "#ffffff",
  "headerTextColor": "#111827",
  "logoUrl": "data:image/png;base64,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",
  "chatTitle": "Support Chat",
  "userMsgBgColor": "#e5e7eb",
  "botMsgBgColor": "#f3f4f6",
  "messagesBgColor": "#ffffff",
  "msgTextColor": "#111827",
  "fontFamily": "Inter",
  "fontSize": 14,
  "inputBgColor": "#ffffff",
  "inputBorderColor": "#d1d5db",
  "inputTextColor": "#111827",
  "inputPlaceholder": "Type a message…",
  "sendBtnBgColor": "#3b82f6",
  "sendBtnIconColor": "#000000ff",
  "soundsEnabled": true,
  "soundProfile": "pop",
  "footerBgColor": "#f9fafb",
  "footerTextColor": "#6b7280",
  "footerText": "Powered by ChatWidget",
  "question": "👋 Hi there! How can I help you today?",
  "tags": [
    "📦 Track my order",
    "🔄 Return a product",
    "💳 Payment issues",
    "❓ Other questions"
  ],
  "inputBorderRadius": 24,
  "inputPadding": 8,
  "inputPlaceholderColor": "#9ca3af",
  "inputFontSize": 14,
  "inputFontFamily": "Inter",
  "inputFocusRingWidth": 2,
  "inputFocusRingColor": "#3b82f6",
  "sendBtnBorderRadius": 24,
  "sendBtnHoverBgColor": "#2563eb",
  "sendBtnHoverIconColor": "#ffffff",
  "sendBtnPadding": 4,
  "sendBtnIconSize": 20,
  "sendBtnHoverOpacity": 0.85
}

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
      <ChatWidgetModifier settings={settings} update={update}  />
      <ChatWidgetPreview settings={settings} />
    </div>
  );
}
