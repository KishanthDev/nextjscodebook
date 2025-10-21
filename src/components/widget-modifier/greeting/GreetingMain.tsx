'use client';

import React, { useState } from 'react';
import GreetingModifier from '@/components/widget-modifier/greeting/GreetingModifierMini';
import GreetingPreview from '@/components/widget-builder/greeting/GreetingPreview';
import { GreetingSettings, DEFAULT_GREETING_SETTINGS } from '@/components/widget-builder/greeting/greetingtype';

export default function GreetingMain() {
    const [settings, setSettings] = useState<GreetingSettings>(DEFAULT_GREETING_SETTINGS);

    const updateSetting = <K extends keyof GreetingSettings>(
        key: K,
        value: GreetingSettings[K]
    ) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6 h-[calc(100vh-114px)]">
            <GreetingModifier settings={settings} update={updateSetting} />
            <GreetingPreview settings={settings} />
        </div>
    );
}