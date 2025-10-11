'use client';
import React, { useState, useCallback } from 'react';
import { BubbleModifier } from './BubbleModifier';
import { BubblePreview } from './BubblePreview';
import { BubblePixelSettings } from './bubbletype';

// Default bubble configuration
const defaultBubble: BubblePixelSettings = {
  width: 50,
  height: 50,
  borderRadius: { tl: 50, tr: 50, bl: 50, br: 50 },

  backgroundColor: '#1E40AF',
  gradientType: 'linear',
  gradientAngle: 135,
  gradientStops: [
    { color: '#1E40AF', pos: 0 },
    { color: '#9333EA', pos: 100 },
  ],
  backgroundOverlayType: 'image',
  backgroundLucideColor: '#FFFFFF',
  backgroundLucideSize: 24,
  backgroundLucideOpacity: 0.2,
  backgroundLucideIcon: 'Star',
  backgroundImageUrl: 'https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg',
  backgroundImageSize: 'contain',
  backgroundImageOpacity: 0.25,
  backgroundBlendMode: 'normal',

  border: { width: 0, color: '#3B82F6', style: 'solid' },
  borderGradientEnabled: true,
  borderGradientAngle: 90,
  borderGradientStops: [
    { color: '#60A5FA', pos: 0 },
    { color: '#A78BFA', pos: 100 },
  ],
  borderOffsetAnim: false,
  outlineRing: { enabled: true, width: 3, color: '#22D3EE', opacity: 0.4 },

  boxShadowBlur: 20,
  boxShadowSpread: 0,
  boxShadowOffsetX: 0,
  boxShadowOffsetY: 8,
  boxShadowOpacity: 0.25,
  innerShadow: { enabled: true, blur: 12, opacity: 0.25 },
  glass: { enabled: false, blur: 10, bgOpacity: 0.3 },
  neon: { enabled: false, color: '#22D3EE', intensity: 0.8 },

  animation: { type: 'fadeIn', duration: 350, delay: 0 },
  idleAnim: { enabled: true, type: 'float', amplitude: 6, duration: 3200 },

  dots: { color: '#F8FAFC', size: 6, spacing: 6, animation: 'bounce' },
};

export const BubbleEditor: React.FC = () => {
  const [settings, setSettings] = useState<BubblePixelSettings>(defaultBubble);

  // Helper function to update settings
  const updateSetting = useCallback(<K extends keyof BubblePixelSettings>(
    key: K,
    value: BubblePixelSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Helper function to update nested settings
  const updateNestedSetting = useCallback(<
    K extends keyof BubblePixelSettings,
    NK extends keyof NonNullable<BubblePixelSettings[K]>
  >(
    key: K,
    nestedKey: NK,
    value: NonNullable<BubblePixelSettings[K]>[NK]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...(typeof prev[key] === 'object' && prev[key] !== null ? prev[key] : {}), [nestedKey]: value }
    }));
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 rounded-lg h-[calc(100vh-114px)]">
      {/* Controls Panel */}
      <BubbleModifier
        settings={settings}
        updateSetting={updateSetting}
        updateNestedSetting={updateNestedSetting}
      />

      {/* Preview Panel */}
      <BubblePreview settings={settings} />
    </div>
  );
};

export default BubbleEditor;