'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { RangeInput, ColorInput, SelectInput, TextInput, CheckboxInput, GradientStopEditor } from './inputs';

type EntryAnim = 'none' | 'fadeIn' | 'pop' | 'slideUp' | 'slideIn' | 'rise';
type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double';
type GradientType = 'none' | 'linear' | 'radial' | 'conic';
type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

type BubblePixelSettings = {
  // Dimensions (converted to numbers for range inputs)
  width: number; // px
  height: number; // px
  borderRadius: { tl: number; tr: number; bl: number; br: number }; // px

  // Background
  backgroundColor: string;
  gradientType: GradientType;
  gradientAngle: number; // degrees
  gradientStops: { color: string; pos: number }[]; // pos as percentage 0-100
  backgroundImageUrl?: string;
  backgroundImageSize: 'contain' | 'cover' | 'auto';
  backgroundImageOpacity: number; // 0-1
  backgroundBlendMode: BlendMode;

  // Border
  border: { width: number; color: string; style: BorderStyle }; // width in px
  borderGradientEnabled: boolean;
  borderGradientAngle: number; // degrees
  borderGradientStops: { color: string; pos: number }[];
  borderOffsetAnim: boolean;
  outlineRing: { enabled: boolean; width: number; color: string; opacity: number };

  // Shadow and effects
  boxShadowBlur: number; // px
  boxShadowSpread: number; // px
  boxShadowOffsetX: number; // px
  boxShadowOffsetY: number; // px
  boxShadowOpacity: number; // 0-1
  innerShadow: { enabled: boolean; blur: number; opacity: number };
  glass: { enabled: boolean; blur: number; bgOpacity: number };
  neon: { enabled: boolean; color: string; intensity: number };

  // Entry / idle animation
  animation: { type: EntryAnim; duration: number; delay: number }; // duration/delay in ms
  idleAnim: { enabled: boolean; type: 'float' | 'bob'; amplitude: number; duration: number };

  // Center image/logo
  centerImageUrl?: string;
  centerImageSize: number; // px
  centerImageOpacity: number;
  centerImageHoverScale: number;
  centerImagePulse: boolean;

  // Loader dots (optional)
  dots?: { color: string; size: number; spacing: number; animation: 'bounce' | 'pulse' | 'none' };
};

// Constraint constants
const CONSTRAINTS = {
  width: { min: 0, max: 100, step: 2 },
  height: { min: 0, max: 100, step: 2 },
  padding: { min: 0, max: 50, step: 1 },
  margin: { min: 0, max: 100, step: 2 },
  borderRadius: { min: 0, max: 100, step: 1 },
  borderWidth: { min: 0, max: 20, step: 1 },
  shadowBlur: { min: 0, max: 50, step: 1 },
  shadowSpread: { min: -20, max: 20, step: 1 },
  shadowOffset: { min: -30, max: 30, step: 1 },
  imageSize: { min: 16, max: 200, step: 4 },
  cutCornerSize: { min: 0, max: 50, step: 1 },
  dotSize: { min: 2, max: 20, step: 1 },
  dotSpacing: { min: 0, max: 20, step: 1 },
  angle: { min: 0, max: 360, step: 5 },
  scale: { min: 0.5, max: 2, step: 0.01 },
  rotate: { min: -180, max: 180, step: 5 },
  duration: { min: 100, max: 5000, step: 50 },
  opacity: { min: 0, max: 1, step: 0.01 },
  intensity: { min: 0, max: 3, step: 0.1 },
  amplitude: { min: 1, max: 20, step: 1 },
};

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

  centerImageUrl: '',
  centerImageSize: 48,
  centerImageOpacity: 0.9,
  centerImageHoverScale: 1.08,
  centerImagePulse: false,

  dots: { color: '#F8FAFC', size: 6, spacing: 6, animation: 'bounce' },
};

const ease = 'cubic-bezier(.2,.8,.2,1)';

export const BubbleModifier: React.FC = () => {
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

  // Computed styles
  const gradient = useMemo(() => {
    if (settings.gradientType === 'none') return '';
    const stops = settings.gradientStops.map(s => `${s.color} ${s.pos}%`).join(', ');
    switch (settings.gradientType) {
      case 'linear':
        return `linear-gradient(${settings.gradientAngle}deg, ${stops})`;
      case 'radial':
        return `radial-gradient(circle, ${stops})`;
      case 'conic':
        return `conic-gradient(from ${settings.gradientAngle}deg, ${stops})`;
      default:
        return '';
    }
  }, [settings.gradientType, settings.gradientAngle, settings.gradientStops]);

  const boxShadow = useMemo(() => {
    const { boxShadowOffsetX, boxShadowOffsetY, boxShadowBlur, boxShadowSpread, boxShadowOpacity } = settings;
    return `${boxShadowOffsetX}px ${boxShadowOffsetY}px ${boxShadowBlur}px ${boxShadowSpread}px rgba(0,0,0,${boxShadowOpacity})`;
  }, [settings.boxShadowOffsetX, settings.boxShadowOffsetY, settings.boxShadowBlur, settings.boxShadowSpread, settings.boxShadowOpacity]);

  const innerShadowValue = useMemo(() => {
    if (!settings.innerShadow.enabled) return '';
    return `inset 0 6px ${settings.innerShadow.blur}px rgba(0,0,0,${settings.innerShadow.opacity})`;
  }, [settings.innerShadow]);

  const compositeBackground = useMemo(() => {
    return gradient || settings.backgroundColor;
  }, [gradient, settings.backgroundColor]);

  const borderImage = useMemo(() => {
    if (!settings.borderGradientEnabled) return undefined;
    const stops = settings.borderGradientStops.map(s => `${s.color} ${s.pos}%`).join(', ');
    return `linear-gradient(${settings.borderGradientAngle}deg, ${stops}) 1`;
  }, [settings.borderGradientEnabled, settings.borderGradientAngle, settings.borderGradientStops]);

  const entryAnimStyle: React.CSSProperties = useMemo(() => {
    const duration = `${settings.animation.duration}ms`;
    const delay = `${settings.animation.delay}ms`;
    switch (settings.animation.type) {
      case 'fadeIn':
        return { animation: `fadeIn ${duration} ${ease} ${delay} both` };
      case 'pop':
        return { animation: `popIn ${duration} ${ease} ${delay} both` };
      case 'slideUp':
        return { animation: `slideUp ${duration} ${ease} ${delay} both` };
      case 'slideIn':
        return { animation: `slideIn ${duration} ${ease} ${delay} both` };
      case 'rise':
        return { animation: `rise ${duration} ${ease} ${delay} both` };
      default:
        return {};
    }
  }, [settings.animation]);

  const borderStyle: React.CSSProperties = useMemo(() => ({
    borderWidth: `${settings.border.width}px`,
    borderStyle: settings.border.style,
    borderColor: settings.border.color,
    ...(settings.borderGradientEnabled
      ? {
          borderImage: borderImage,
          borderColor: 'transparent',
        }
      : {}),
  }), [settings.border, settings.borderGradientEnabled, borderImage]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 h-[calc(100vh-53px)]">
      {/* Controls Panel */}
      <div className="lg:w-96 space-y-6 bg-white p-6 rounded-lg shadow-sm overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bubble Modifier</h2>

        {/* Dimensions Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Dimensions</h3>
          <div className="grid grid-cols-2 gap-4">
            <RangeInput
              label="Width"
              value={settings.width}
              onChange={(width) => updateSetting('width', width)}
              {...CONSTRAINTS.width}
            />
            <RangeInput
              label="Height"
              value={settings.height}
              onChange={(height) => updateSetting('height', height)}
              {...CONSTRAINTS.height}
            />
          </div>
        </section>

        {/* Border Radius Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Border Radius</h3>
          <div className="grid grid-cols-2 gap-4">
            {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
              <RangeInput
                key={corner}
                label={corner.toUpperCase()}
                value={settings.borderRadius[corner]}
                onChange={(value) => updateNestedSetting('borderRadius', corner, value)}
                {...CONSTRAINTS.borderRadius}
              />
            ))}
          </div>
        </section>

        {/* Background Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Background</h3>
          <ColorInput
            label="Base Color"
            value={settings.backgroundColor}
            onChange={(backgroundColor) => updateSetting('backgroundColor', backgroundColor)}
          />
          <SelectInput
            label="Gradient Type"
            value={settings.gradientType}
            onChange={(gradientType) => updateSetting('gradientType', gradientType)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'linear', label: 'Linear' },
              { value: 'radial', label: 'Radial' },
              { value: 'conic', label: 'Conic' }
            ]}
          />
          {settings.gradientType !== 'none' && (
            <>
              <RangeInput
                label="Gradient Angle"
                value={settings.gradientAngle}
                onChange={(gradientAngle) => updateSetting('gradientAngle', gradientAngle)}
                {...CONSTRAINTS.angle}
                unit="°"
              />
              <GradientStopEditor
                stops={settings.gradientStops}
                onChange={(gradientStops) => updateSetting('gradientStops', gradientStops)}
              />
            </>
          )}
        </section>

        {/* Center Image Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Center Image</h3>
          <TextInput
            label="Image URL"
            value={settings.centerImageUrl || ''}
            onChange={(centerImageUrl) => updateSetting('centerImageUrl', centerImageUrl)}
            placeholder="https://..."
          />
          {settings.centerImageUrl && (
            <>
              <RangeInput
                label="Image Size"
                value={settings.centerImageSize}
                onChange={(centerImageSize) => updateSetting('centerImageSize', centerImageSize)}
                {...CONSTRAINTS.imageSize}
              />
              <RangeInput
                label="Image Opacity"
                value={settings.centerImageOpacity}
                onChange={(centerImageOpacity) => updateSetting('centerImageOpacity', centerImageOpacity)}
                {...CONSTRAINTS.opacity}
                unit=""
              />
              <RangeInput
                label="Hover Scale"
                value={settings.centerImageHoverScale}
                onChange={(centerImageHoverScale) => updateSetting('centerImageHoverScale', centerImageHoverScale)}
                {...CONSTRAINTS.scale}
                unit="x"
              />
              <CheckboxInput
                label="Pulse Effect"
                checked={settings.centerImagePulse}
                onChange={(centerImagePulse) => updateSetting('centerImagePulse', centerImagePulse)}
              />
            </>
          )}
        </section>

        {/* Background Overlay Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Background Overlay</h3>
          <TextInput
            label="Background Image URL"
            value={settings.backgroundImageUrl || ''}
            onChange={(backgroundImageUrl) => updateSetting('backgroundImageUrl', backgroundImageUrl)}
            placeholder="Overlay image url"
          />
          {settings.backgroundImageUrl && (
            <>
              <SelectInput
                label="Background Size"
                value={settings.backgroundImageSize}
                onChange={(backgroundImageSize) => updateSetting('backgroundImageSize', backgroundImageSize)}
                options={[
                  { value: 'contain', label: 'Contain' },
                  { value: 'cover', label: 'Cover' },
                  { value: 'auto', label: 'Auto' }
                ]}
              />
              <RangeInput
                label="Background Opacity"
                value={settings.backgroundImageOpacity}
                onChange={(backgroundImageOpacity) => updateSetting('backgroundImageOpacity', backgroundImageOpacity)}
                {...CONSTRAINTS.opacity}
                unit=""
              />
              <SelectInput
                label="Blend Mode"
                value={settings.backgroundBlendMode}
                onChange={(backgroundBlendMode) => updateSetting('backgroundBlendMode', backgroundBlendMode)}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'multiply', label: 'Multiply' },
                  { value: 'screen', label: 'Screen' },
                  { value: 'overlay', label: 'Overlay' },
                  { value: 'darken', label: 'Darken' },
                  { value: 'lighten', label: 'Lighten' },
                  { value: 'color-dodge', label: 'Color Dodge' },
                  { value: 'color-burn', label: 'Color Burn' },
                  { value: 'hard-light', label: 'Hard Light' },
                  { value: 'soft-light', label: 'Soft Light' },
                  { value: 'difference', label: 'Difference' },
                  { value: 'exclusion', label: 'Exclusion' }
                ]}
              />
            </>
          )}
        </section>

        {/* Border Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Border</h3>
          <div className="grid grid-cols-2 gap-4">
            <RangeInput
              label="Width"
              value={settings.border.width}
              onChange={(width) => updateNestedSetting('border', 'width', width)}
              {...CONSTRAINTS.borderWidth}
            />
            <SelectInput
              label="Style"
              value={settings.border.style}
              onChange={(style) => updateNestedSetting('border', 'style', style)}
              options={[
                { value: 'solid', label: 'Solid' },
                { value: 'dashed', label: 'Dashed' },
                { value: 'dotted', label: 'Dotted' },
                { value: 'double', label: 'Double' }
              ]}
            />
          </div>
          <ColorInput
            label="Border Color"
            value={settings.border.color}
            onChange={(color) => updateNestedSetting('border', 'color', color)}
          />
          
          <CheckboxInput
            label="Gradient Border"
            checked={settings.borderGradientEnabled}
            onChange={(borderGradientEnabled) => updateSetting('borderGradientEnabled', borderGradientEnabled)}
          />
          {settings.borderGradientEnabled && (
            <>
              <RangeInput
                label="Border Gradient Angle"
                value={settings.borderGradientAngle}
                onChange={(borderGradientAngle) => updateSetting('borderGradientAngle', borderGradientAngle)}
                {...CONSTRAINTS.angle}
                unit="°"
              />
              <GradientStopEditor
                stops={settings.borderGradientStops}
                onChange={(borderGradientStops) => updateSetting('borderGradientStops', borderGradientStops)}
              />
            </>
          )}

          <div className="mt-4">
            <CheckboxInput
              label="Outline Ring"
              checked={settings.outlineRing.enabled}
              onChange={(enabled) => updateNestedSetting('outlineRing', 'enabled', enabled)}
            />
            {settings.outlineRing.enabled && (
              <div className="mt-3 space-y-3 pl-6">
                <RangeInput
                  label="Ring Width"
                  value={settings.outlineRing.width}
                  onChange={(width) => updateNestedSetting('outlineRing', 'width', width)}
                  {...CONSTRAINTS.borderWidth}
                />
                <ColorInput
                  label="Ring Color"
                  value={settings.outlineRing.color}
                  onChange={(color) => updateNestedSetting('outlineRing', 'color', color)}
                />
                <RangeInput
                  label="Ring Opacity"
                  value={settings.outlineRing.opacity}
                  onChange={(opacity) => updateNestedSetting('outlineRing', 'opacity', opacity)}
                  {...CONSTRAINTS.opacity}
                  unit=""
                />
              </div>
            )}
          </div>
        </section>

        {/* Shadows & Effects Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Shadows & Effects</h3>
          <div className="grid grid-cols-2 gap-4">
            <RangeInput
              label="Shadow Blur"
              value={settings.boxShadowBlur}
              onChange={(boxShadowBlur) => updateSetting('boxShadowBlur', boxShadowBlur)}
              {...CONSTRAINTS.shadowBlur}
            />
            <RangeInput
              label="Shadow Spread"
              value={settings.boxShadowSpread}
              onChange={(boxShadowSpread) => updateSetting('boxShadowSpread', boxShadowSpread)}
              {...CONSTRAINTS.shadowSpread}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <RangeInput
              label="Shadow X"
              value={settings.boxShadowOffsetX}
              onChange={(boxShadowOffsetX) => updateSetting('boxShadowOffsetX', boxShadowOffsetX)}
              {...CONSTRAINTS.shadowOffset}
            />
            <RangeInput
              label="Shadow Y"
              value={settings.boxShadowOffsetY}
              onChange={(boxShadowOffsetY) => updateSetting('boxShadowOffsetY', boxShadowOffsetY)}
              {...CONSTRAINTS.shadowOffset}
            />
          </div>
          <RangeInput
            label="Shadow Opacity"
            value={settings.boxShadowOpacity}
            onChange={(boxShadowOpacity) => updateSetting('boxShadowOpacity', boxShadowOpacity)}
            {...CONSTRAINTS.opacity}
            unit=""
          />

          <CheckboxInput
            label="Inner Shadow"
            checked={settings.innerShadow.enabled}
            onChange={(enabled) => updateNestedSetting('innerShadow', 'enabled', enabled)}
          />
          {settings.innerShadow.enabled && (
            <div className="pl-6 space-y-3">
              <RangeInput
                label="Inner Blur"
                value={settings.innerShadow.blur}
                onChange={(blur) => updateNestedSetting('innerShadow', 'blur', blur)}
                {...CONSTRAINTS.shadowBlur}
              />
              <RangeInput
                label="Inner Opacity"
                value={settings.innerShadow.opacity}
                onChange={(opacity) => updateNestedSetting('innerShadow', 'opacity', opacity)}
                {...CONSTRAINTS.opacity}
                unit=""
              />
            </div>
          )}

          <CheckboxInput
            label="Glassmorphism"
            checked={settings.glass.enabled}
            onChange={(enabled) => updateNestedSetting('glass', 'enabled', enabled)}
          />
          {settings.glass.enabled && (
            <div className="pl-6 space-y-3">
              <RangeInput
                label="Backdrop Blur"
                value={settings.glass.blur}
                onChange={(blur) => updateNestedSetting('glass', 'blur', blur)}
                min={0}
                max={50}
                unit="px"
              />
              <RangeInput
                label="Background Opacity"
                value={settings.glass.bgOpacity}
                onChange={(bgOpacity) => updateNestedSetting('glass', 'bgOpacity', bgOpacity)}
                {...CONSTRAINTS.opacity}
                unit=""
              />
            </div>
          )}

          <CheckboxInput
            label="Neon Glow"
            checked={settings.neon.enabled}
            onChange={(enabled) => updateNestedSetting('neon', 'enabled', enabled)}
          />
          {settings.neon.enabled && (
            <div className="pl-6 space-y-3">
              <ColorInput
                label="Neon Color"
                value={settings.neon.color}
                onChange={(color) => updateNestedSetting('neon', 'color', color)}
              />
              <RangeInput
                label="Intensity"
                value={settings.neon.intensity}
                onChange={(intensity) => updateNestedSetting('neon', 'intensity', intensity)}
                {...CONSTRAINTS.intensity}
                unit=""
              />
            </div>
          )}
        </section>

        {/* Animation Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Animation</h3>
          <SelectInput
            label="Entry Animation"
            value={settings.animation.type}
            onChange={(type) => updateNestedSetting('animation', 'type', type)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'fadeIn', label: 'Fade In' },
              { value: 'pop', label: 'Pop' },
              { value: 'slideUp', label: 'Slide Up' },
              { value: 'slideIn', label: 'Slide In' },
              { value: 'rise', label: 'Rise' }
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <RangeInput
              label="Duration"
              value={settings.animation.duration}
              onChange={(duration) => updateNestedSetting('animation', 'duration', duration)}
              {...CONSTRAINTS.duration}
              unit="ms"
            />
            <RangeInput
              label="Delay"
              value={settings.animation.delay}
              onChange={(delay) => updateNestedSetting('animation', 'delay', delay)}
              {...CONSTRAINTS.duration}
              unit="ms"
            />
          </div>

          <CheckboxInput
            label="Idle Animation"
            checked={settings.idleAnim.enabled}
            onChange={(enabled) => updateNestedSetting('idleAnim', 'enabled', enabled)}
          />
          {settings.idleAnim.enabled && (
            <div className="pl-6 space-y-3">
              <SelectInput
                label="Type"
                value={settings.idleAnim.type}
                onChange={(type) => updateNestedSetting('idleAnim', 'type', type)}
                options={[
                  { value: 'float', label: 'Float' },
                  { value: 'bob', label: 'Bob' }
                ]}
              />
              <div className="grid grid-cols-2 gap-4">
                <RangeInput
                  label="Amplitude"
                  value={settings.idleAnim.amplitude}
                  onChange={(amplitude) => updateNestedSetting('idleAnim', 'amplitude', amplitude)}
                  {...CONSTRAINTS.amplitude}
                />
                <RangeInput
                  label="Duration"
                  value={settings.idleAnim.duration}
                  onChange={(duration) => updateNestedSetting('idleAnim', 'duration', duration)}
                  {...CONSTRAINTS.duration}
                  unit="ms"
                />
              </div>
            </div>
          )}
        </section>

        {/* Dots Loader Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Dots Loader</h3>
          <CheckboxInput
            label="Show Dots"
            checked={!!settings.dots}
            onChange={(checked) => {
              updateSetting('dots', checked ? { color: '#F8FAFC', size: 6, spacing: 6, animation: 'bounce' } : undefined);
            }}
          />
          {settings.dots && (
            <div className="pl-6 space-y-3">
              <ColorInput
                label="Dot Color"
                value={settings.dots.color}
                onChange={(color) => updateNestedSetting('dots', 'color', color)}
              />
              <div className="grid grid-cols-2 gap-4">
                <RangeInput
                  label="Dot Size"
                  value={settings.dots.size}
                  onChange={(size) => updateNestedSetting('dots', 'size', size)}
                  {...CONSTRAINTS.dotSize}
                />
                <RangeInput
                  label="Spacing"
                  value={settings.dots.spacing}
                  onChange={(spacing) => updateNestedSetting('dots', 'spacing', spacing)}
                  {...CONSTRAINTS.dotSpacing}
                />
              </div>
              <SelectInput
                label="Animation"
                value={settings.dots.animation}
                onChange={(animation) => updateNestedSetting('dots', 'animation', animation)}
                options={[
                  { value: 'bounce', label: 'Bounce' },
                  { value: 'pulse', label: 'Pulse' },
                  { value: 'none', label: 'None' }
                ]}
              />
            </div>
          )}
        </section>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8">
        <div className="relative group" style={{ perspective: '800px' }}>
          <div
            className="relative flex items-center justify-center transition-all duration-300"
            style={{
              width: `${settings.width}px`,
              height: `${settings.height}px`,
              borderRadius: `${settings.borderRadius.tl}px ${settings.borderRadius.tr}px ${settings.borderRadius.br}px ${settings.borderRadius.bl}px`,
              background: compositeBackground,
              backgroundBlendMode: settings.backgroundBlendMode,
              ...borderStyle,
              boxShadow: [boxShadow, innerShadowValue].filter(Boolean).join(', '),
              transformStyle: 'preserve-3d',
              ...(settings.glass.enabled ? { 
                backdropFilter: `blur(${settings.glass.blur}px)`, 
                backgroundColor: `rgba(255,255,255,${settings.glass.bgOpacity})` 
              } : {}),
              ...(settings.neon.enabled ? { 
                filter: `drop-shadow(0 0 ${10 * settings.neon.intensity}px ${settings.neon.color})`,
                boxShadow: `${boxShadow}, 0 0 ${10 * settings.neon.intensity}px ${settings.neon.color}, 0 0 ${25 * settings.neon.intensity}px ${settings.neon.color}` 
              } : {}),
              ...entryAnimStyle,
            }}
          >
            {/* Background image overlay */}
            {settings.backgroundImageUrl && (
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${settings.backgroundImageUrl})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: settings.backgroundImageSize,
                  opacity: settings.backgroundImageOpacity,
                  mixBlendMode: settings.backgroundBlendMode,
                  borderRadius: 'inherit',
                }}
              />
            )}

            {/* Center image/logo */}
            {settings.centerImageUrl && (
              <img
                src={settings.centerImageUrl}
                alt=""
                className="transition-transform duration-300 center-image"
                style={{
                  width: `${settings.centerImageSize}px`,
                  height: `${settings.centerImageSize}px`,
                  objectFit: 'contain',
                  opacity: settings.centerImageOpacity,
                  animation: settings.centerImagePulse ? 'imagePulse 2s ease-in-out infinite' : undefined,
                }}
              />
            )}

            {/* Dots loader */}
            {settings.dots && (
              <div
                className="absolute flex"
                style={{ gap: `${settings.dots.spacing}px` }}
              >
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className="rounded-full"
                    style={{
                      width: `${settings.dots?.size ?? 0}px`,
                      height: `${settings.dots?.size ?? 0}px`,
                      backgroundColor: settings.dots?.color ?? 'transparent',
                      animation:
                        settings.dots?.animation === 'bounce'
                          ? `dotBounce 1.2s ${ease} ${i * 0.12}s infinite`
                          : settings.dots?.animation === 'pulse'
                          ? `dotPulse 1.4s ${ease} ${i * 0.1}s infinite`
                          : undefined,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Outline ring */}
            {settings.outlineRing.enabled && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: 'inherit',
                  boxShadow: `0 0 0 ${settings.outlineRing.width}px ${hexToRgba(settings.outlineRing.color, settings.outlineRing.opacity)}`,
                }}
              />
            )}
          </div>

          {/* Keyframes */}
          <style>{cssKeyframes(settings)}</style>
        </div>
      </div>
    </div>
  );
};

// Utility functions
function hexToRgba(hex: string, alpha: number) {
  const v = hex.replace('#', '');
  const bigint = parseInt(v.length === 3 ? v.split('').map(c => c + c).join('') : v, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function cssKeyframes(settings: BubblePixelSettings) {
  return `
    @keyframes fadeIn { 
      from { opacity: 0; transform: translateY(6px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    @keyframes popIn { 
      0% { transform: scale(.9); opacity: 0; } 
      100% { transform: scale(1); opacity: 1; } 
    }
    @keyframes slideUp { 
      from { transform: translateY(16px); opacity: 0; } 
      to { transform: translateY(0); opacity: 1; } 
    }
    @keyframes slideIn { 
      from { transform: translateX(-16px); opacity: 0; } 
      to { transform: translateX(0); opacity: 1; } 
    }
    @keyframes rise { 
      from { transform: translateY(24px); filter: blur(6px); opacity: 0; } 
      to { transform: translateY(0); filter: blur(0); opacity: 1; } 
    }

    @keyframes idleFloat { 
      0%,100% { transform: translateY(0); } 
      50% { transform: translateY(-${settings.idleAnim.amplitude}px); } 
    }
    @keyframes idleBob { 
      0%,100% { transform: translateY(0); } 
      50% { transform: translateY(-${settings.idleAnim.amplitude}px) scale(1.01); } 
    }

    @keyframes imagePulse {
      0%,100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes dotBounce { 
      0%,100% { transform: translateY(0); } 
      50% { transform: translateY(-6px); } 
    }
    @keyframes dotPulse { 
      0%,100% { transform: scale(1); } 
      50% { transform: scale(1.25); } 
    }

    /* Custom slider styles */
    .slider::-webkit-slider-thumb {
      appearance: none;
      height: 18px;
      width: 18px;
      border-radius: 50%;
      background: #3B82F6;
      cursor: pointer;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 1px #e5e7eb;
    }

    .slider::-moz-range-thumb {
      height: 18px;
      width: 18px;
      border-radius: 50%;
      background: #3B82F6;
      cursor: pointer;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 1px #e5e7eb;
    }
  `;
}

export default BubbleModifier;