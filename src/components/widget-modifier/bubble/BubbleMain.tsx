'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { BubblePixelSettings } from '@/components/widget-builder/bubble/bubbletype'

const BubbleModifier = dynamic(() => import('@/components/widget-modifier/bubble/BubbleModifierMini'), {
  ssr: false, loading: () => <div className="h-100 w-full bg-gray-100 animate-pulse" />
});
const BubblePreview = dynamic(() => import('@/components/widget-builder//bubble/BubblePreview'), {
  ssr: false, loading: () => <div className="h-100 w-full bg-gray-100 animate-pulse" />
});

export interface BubbleMainProps {
  initialSettings: BubblePixelSettings;
}

export const BubbleMain: React.FC<BubbleMainProps> = ({ initialSettings }) => {
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
    <div className="flex flex-col lg:flex-row gap-8 p-6 h-[calc(100vh-114px)]">
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

export default BubbleMain;
