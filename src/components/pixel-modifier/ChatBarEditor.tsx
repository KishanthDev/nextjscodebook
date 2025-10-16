'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ChatbarSettings } from './chatbar/chatbartype';

const ChatBarModifier = dynamic(() => import('./chatbar/ChatBarModifier'), {
  ssr: false, loading: () => <div className="h-100 w-full bg-gray-100 animate-pulse" />
});

const ChatBarPreview = dynamic(() => import('./chatbar/ChatBarPreview'), {
  ssr: false, loading: () => <div className="h-100 w-full bg-gray-100 animate-pulse" />
});

interface ChatBarEditorProps {
  initialSettings: ChatbarSettings;
}

export default function ChatBarEditor({ initialSettings }: ChatBarEditorProps) {
  const [settings, setSettings] = useState<ChatbarSettings>(initialSettings);

  const update = useCallback(
    <K extends keyof ChatbarSettings>(key: K, value: ChatbarSettings[K]) =>
      setSettings(s => ({ ...s, [key]: value })),
    []
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 rounded-lg dark:bg-neutral-900 h-[calc(100vh-114px)]">
      <ChatBarModifier settings={settings} update={update} />
      <ChatBarPreview settings={settings} />
    </div>
  );
}
