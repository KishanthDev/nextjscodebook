'use client';

import React, { useState } from 'react';
import ChatWidgetModifier from './ChatWidgetModifier';
import ChatWidgetPreview from './ChatWidgetPreview';
import { ChatWidgetSettings, DEFAULT_CHAT_WIDGET_SETTINGS } from './chatwidgettype';

export default function ChatWidgetMain() {
  const [settings, setSettings] = useState<ChatWidgetSettings>(DEFAULT_CHAT_WIDGET_SETTINGS);

  const updateSetting = <K extends keyof ChatWidgetSettings>(
    key: K,
    value: ChatWidgetSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 h-[calc(100vh-114px)]">
      <ChatWidgetModifier settings={settings} update={updateSetting} />
      <ChatWidgetPreview settings={settings} />
    </div>
  );
}