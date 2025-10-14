'use client';
import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ChatWidgetSettings } from './chatwidget/chat-widget-types';

// Dynamically import these so SSR doesn't break on window-dependent code
const ChatWidgetModifier = dynamic(() => import('./chatwidget/ChatWidgetModifier'), {
  ssr: false, loading: () => <div className="h-100 w-full bg-gray-100 animate-pulse" />
});
const ChatWidgetPreview = dynamic(() => import('./chatwidget/ChatWidgetPreview'), {
  ssr: false, loading: () => <div className="h-100 w-full bg-gray-100 animate-pulse" />
});

interface ChatWidgetEditorProps {
  initialSettings: ChatWidgetSettings;
}

export default function ChatWidgetEditor({ initialSettings }: ChatWidgetEditorProps) {
  const [settings, setSettings] = useState<ChatWidgetSettings>(initialSettings);

  const update = useCallback(
    <K extends keyof ChatWidgetSettings>(key: K, value: ChatWidgetSettings[K]) => {
      setSettings(s => ({ ...s, [key]: value }));
    },
    []
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 rounded-lg h-[calc(100vh-114px)]">
      <ChatWidgetModifier settings={settings} update={update} />
      <ChatWidgetPreview settings={settings} />
    </div>
  );
}
