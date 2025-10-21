'use client';

import React from 'react';
import { RangeInput, ColorInput, SelectInput, TextInput, CheckboxInput, GradientStopEditor } from '@/components/widget-builder/lib/inputs';
import { BubblePixelSettings, OverlayType } from '@/components/widget-builder/bubble/bubbletype';
import { LucideIconPicker } from '@/components/widget-builder/lib/LucideIconPicker';
import { CONSTRAINTS } from '@/components/widget-builder/bubble/BUBBLE_CONSTRAINTS';

interface BubbleModifierProps {
    settings: BubblePixelSettings;
    updateSetting: <K extends keyof BubblePixelSettings>(
        key: K,
        value: BubblePixelSettings[K]
    ) => void;
    updateNestedSetting: <
        K extends keyof BubblePixelSettings,
        NK extends keyof NonNullable<BubblePixelSettings[K]>
    >(
        key: K,
        nestedKey: NK,
        value: NonNullable<BubblePixelSettings[K]>[NK]
    ) => void;
}

export const BubbleModifier: React.FC<BubbleModifierProps> = ({
    settings,
    updateSetting,
    updateNestedSetting,
}) => {
    return (
        <div className="lg:w-96 space-y-6 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-gray-300 dark:border-neutral-700 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Bubble Modifier</h2>

            {/* Dimensions Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
                    Dimensions
                </h3>
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
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
                    Border Radius
                </h3>
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
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
                    Background
                </h3>
                <ColorInput
                    label="Base Color"
                    value={settings.backgroundColor}
                    onChange={(backgroundColor) => updateSetting('backgroundColor', backgroundColor)}
                />
            </section>

            {/* Background Overlay Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
                    Background Overlay
                </h3>

                <SelectInput
                    label="Overlay Type"
                    value={settings.backgroundOverlayType}
                    onChange={(v) => updateSetting('backgroundOverlayType', v as OverlayType)}
                    options={[
                        { value: 'image', label: 'Image URL' },
                        { value: 'lucide', label: 'Lucide Icon' },
                    ]}
                />

                {/* Image Controls */}
                {settings.backgroundOverlayType === 'image' && (
                    <>
                        <TextInput
                            label="Background Image URL"
                            value={settings.backgroundImageUrl || ''}
                            onChange={(backgroundImageUrl) => updateSetting('backgroundImageUrl', backgroundImageUrl)}
                            placeholder="Overlay image url"
                        />
                    </>
                )}

                {/* Lucide Controls */}
                {settings.backgroundOverlayType === 'lucide' && (
                    <>
                        <LucideIconPicker
                            value={settings.backgroundLucideIcon}
                            onChange={v => updateSetting('backgroundLucideIcon', v)}
                        />
                        <ColorInput
                            label="Icon Color"
                            value={settings.backgroundLucideColor}
                            onChange={(v) => updateSetting('backgroundLucideColor', v)}
                        />
                        <RangeInput
                            label="Icon Size"
                            value={settings.backgroundLucideSize}
                            onChange={v => updateSetting('backgroundLucideSize', v)}
                            min={16} max={128} step={4}
                        />
                        <RangeInput
                            label="Icon Opacity"
                            value={settings.backgroundLucideOpacity}
                            onChange={v => updateSetting('backgroundLucideOpacity', v)}
                            min={0.1} max={1} step={0.05}
                        />
                    </>
                )}
            </section>

            {/* Dots Loader Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
                    Dots Loader
                </h3>
                <CheckboxInput
                    label="Show Dots"
                    checked={!!settings.dots}
                    onChange={(checked) => {
                        updateSetting('dots', checked ? { color: '#F8FAFC', size: 6, spacing: 6, animation: 'bounce' } : undefined);
                    }}
                />
                {settings.dots && (
                    <div className="pl-6 space-y-3 border-l-2 border-gray-200 dark:border-neutral-700">
                        <ColorInput
                            label="Dot Color"
                            value={settings.dots.color}
                            onChange={(color) => updateNestedSetting('dots', 'color', color)}
                        />
                    </div>
                )}
            </section>
        </div>
    );
};

export default BubbleModifier;
