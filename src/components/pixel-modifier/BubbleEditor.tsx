'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { BubblePixelSettings } from './bubble/bubbletype';

const BubbleModifier = dynamic(() => import('./bubble/BubbleModifier'), {
  ssr: false, loading: () => <div className="h-100 w-full bg-gray-100 animate-pulse" />
});
const BubblePreview = dynamic(() => import('./bubble/BubblePreview'), {
  ssr: false, loading: () => <div className="h-100 w-full bg-gray-100 animate-pulse" />
});

export interface BubbleEditorSSRProps {
  initialSettings: BubblePixelSettings;
}

export const BubbleEditorSSR: React.FC<BubbleEditorSSRProps> = ({ initialSettings }) => {
  const [settings, setSettings] = useState<BubblePixelSettings>(initialSettings);

  // Update functions
  const updateSetting = useCallback(<K extends keyof BubblePixelSettings>(
    key: K,
    value: BubblePixelSettings[K]
  ) => setSettings(prev => ({ ...prev, [key]: value })), []);

  const updateNestedSetting = useCallback(<
    K extends keyof BubblePixelSettings,
    NK extends keyof NonNullable<BubblePixelSettings[K]>
  >(key: K, nestedKey: NK, value: NonNullable<BubblePixelSettings[K]>[NK]) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...(typeof prev[key] === 'object' && prev[key] !== null ? prev[key] : {}), [nestedKey]: value }
    }));
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 rounded-lg dark:bg-neutral-900 h-[calc(100vh-114px)]">
      {/* Controls Panel */}
      <BubbleModifier
        settings={settings}
        updateSetting={updateSetting}
        updateNestedSetting={updateNestedSetting}
      />
      <BubblePreview settings={settings} />
    </div>
  );
};

export default BubbleEditorSSR;
