'use client';

import React, { useState } from 'react';
import ChatWidgetModifier from '@/components/widget-modifier/contact/ContactModifierMini';
import ChatWidgetPreview from '@/components/widget-builder/contact/ChatWidgetPreview';
import { ChatWidgetSettings, DEFAULT_CHAT_WIDGET_SETTINGS } from '@/components/widget-builder/contact/chatwidgettype';

export default function ContactMain() {
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