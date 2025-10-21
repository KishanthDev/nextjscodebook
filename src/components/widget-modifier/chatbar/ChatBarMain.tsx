'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ChatbarSettings } from '@/components/widget-builder/chatbar/chatbartype';

const ChatBarModifier = dynamic(() => import('@/components/widget-modifier/chatbar/ChatBarModifierMini'), {
  ssr: false, loading: () => <div className="h-100 w-full bg-gray-100 animate-pulse" />
});

const ChatBarPreview = dynamic(() => import('@/components/widget-builder/chatbar/ChatBarPreview'), {
  ssr: false, loading: () => <div className="h-100 w-full bg-gray-100 animate-pulse" />
});

interface ChatBarMainProps {
  initialSettings: ChatbarSettings;
}

export default function ChatBarMain({ initialSettings }: ChatBarMainProps) {
  const [settings, setSettings] = useState<ChatbarSettings>(initialSettings);

  const update = useCallback(
    <K extends keyof ChatbarSettings>(key: K, value: ChatbarSettings[K]) =>
      setSettings(s => ({ ...s, [key]: value })),
    []
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 h-[calc(100vh-114px)]">
      <ChatBarModifier settings={settings} update={update} />
      <ChatBarPreview settings={settings} />
    </div>
  );
}
