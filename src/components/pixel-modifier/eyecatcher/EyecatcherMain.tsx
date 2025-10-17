'use client';

import React, { useState } from 'react';
import EyecatcherModifier from './EyecatcherModifier';
import EyecatcherPreview from './EyecatcherPreview';
import { EyecatcherSettings, DEFAULT_EYECATCHER_SETTINGS } from './eyecatchertype';

export default function EyecatcherMain() {
    const [settings, setSettings] = useState<EyecatcherSettings>(DEFAULT_EYECATCHER_SETTINGS);

    const updateSetting = <K extends keyof EyecatcherSettings>(
        key: K,
        value: EyecatcherSettings[K]
    ) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6 h-[calc(100vh-114px)]">
            <EyecatcherModifier settings={settings} update={updateSetting} />
            <EyecatcherPreview settings={settings} />
        </div>
    );
}