'use client';
import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ChatWidgetSettings } from '@/components/widget-builder/chatwidget/chat-widget-types';

// Dynamically import these so SSR doesn't break on window-dependent code
const ChatWidgetModifier = dynamic(() => import('@/components/widget-modifier/chatwidget/ChatWidgetModifierMini'), {
  ssr: false, loading: () => <div className="h-100 w-full bg-gray-100 animate-pulse" />
});
const ChatWidgetPreview = dynamic(() => import('@/components/widget-builder/chatwidget/ChatWidgetPreview'), {
  ssr: false, loading: () => <div className="h-100 w-full bg-gray-100 animate-pulse" />
});

interface ChatWidgetMainProps {
  initialSettings: ChatWidgetSettings;
}

export default function ChatWidgetMain({ initialSettings }: ChatWidgetMainProps) {
  const [settings, setSettings] = useState<ChatWidgetSettings>(initialSettings);

  const update = useCallback(
    <K extends keyof ChatWidgetSettings>(key: K, value: ChatWidgetSettings[K]) => {
      setSettings(s => ({ ...s, [key]: value }));
    },
    []
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 h-[calc(100vh-114px)]">
      <ChatWidgetModifier settings={settings} update={update} />
      <ChatWidgetPreview settings={settings} />
    </div>
  );
}
