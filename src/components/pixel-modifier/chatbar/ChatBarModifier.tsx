'use client';

import React from 'react';
import {
    TextInput,
    ColorInput,
    RangeInput,
    SelectInput,
    CheckboxInput,
    GradientStopEditor,
} from '../lib/inputs';
import { LucideIconPicker } from '../lib/LucideIconPicker';
import { ChatbarSettings } from './chatbartype';


export const CONSTRAINTS = {
    width: { min: 0, max: 600, step: 2 },
    height: { min: 0, max: 100, step: 2 },
    borderRadius: { min: 0, max: 200, step: 1 },
};


interface ModifierProps {
    settings: ChatbarSettings;
    update: <K extends keyof ChatbarSettings>(key: K, value: ChatbarSettings[K]) => void;
}

export default function ChatBarModifier({ settings, update }: ModifierProps) {
    // Helper function for nested border radius updates
    const updateNestedSetting = (
        parent: 'borderRadius',
        key: 'tl' | 'tr' | 'bl' | 'br',
        value: number
    ) => {
        update(parent, {
            ...settings[parent],
            [key]: value,
        });
    };

    return (
        <div className="lg:w-96 space-y-6 bg-white p-6 rounded-lg shadow-sm overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat Bar Modifier</h2>

            {/* Dimensions Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Dimensions</h3>
                <div className="grid grid-cols-2 gap-4">
                    <RangeInput
                        label="Width"
                        value={settings.width}
                        onChange={(width) => update('width', width)}
                        {...CONSTRAINTS.width}
                    />
                    <RangeInput
                        label="Height"
                        value={settings.height}
                        onChange={(height) => update('height', height)}
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

            <TextInput
                label="Text"
                value={settings.text}
                onChange={v => update('text', v)}
                placeholder="Chat with us"
            />
            <ColorInput
                label="Background"
                value={settings.bgColor}
                onChange={v => update('bgColor', v)}
            />
            <ColorInput
                label="Text Color"
                value={settings.textColor}
                onChange={v => update('textColor', v)}
            />

            <CheckboxInput
                label="Enable Gradient?"
                checked={settings.gradientEnabled}
                onChange={v => update('gradientEnabled', v)}
            />
            {settings.gradientEnabled && (
                <>
                    <SelectInput
                        label="Gradient Type"
                        value={settings.gradientType}
                        onChange={v => update('gradientType', v as any)}
                        options={[
                            { value: 'linear', label: 'Linear' },
                            { value: 'radial', label: 'Radial' },
                            { value: 'conic', label: 'Conic' },
                        ]}
                    />
                    <RangeInput
                        label="Angle"
                        value={settings.gradientAngle}
                        onChange={v => update('gradientAngle', v)}
                        min={0}
                        max={360}
                        step={1}
                        unit="°"
                    />
                    <GradientStopEditor
                        stops={settings.gradientStops}
                        onChange={v => update('gradientStops', v)}
                    />
                </>
            )}

            <SelectInput
                label="Icon Type"
                value={settings.iconType}
                onChange={v => update('iconType', v as any)}
                options={[
                    { value: 'lucide', label: 'Lucide Icon' },
                    { value: 'image', label: 'Image URL' },
                ]}
            />

            {settings.iconType === 'lucide' ? (
                <>
                    <LucideIconPicker
                        value={settings.lucideIcon}
                        onChange={v => update('lucideIcon', v)}
                    />
                    <ColorInput
                        label="Icon Color"
                        value={settings.iconColor}
                        onChange={v => update('iconColor', v)}
                    />
                    <RangeInput
                        label="Icon Height"
                        value={settings.iconHeight || 24}
                        onChange={v => update('iconHeight', v)}
                        min={12}
                        max={64}
                        step={1}
                        unit="px"
                    />
                    <RangeInput
                        label="Icon Width"
                        value={settings.iconWidth || 24}
                        onChange={v => update('iconWidth', v)}
                        min={12}
                        max={64}
                        step={1}
                        unit="px"
                    />
                </>
            ) : (
                <>
                    <TextInput
                        label="Icon Image URL"
                        value={settings.iconImageUrl}
                        onChange={v => update('iconImageUrl', v)}
                        placeholder="https://..."
                    />
                    <SelectInput
                        label="Image Fit"
                        value={settings.iconFit}
                        onChange={v => update('iconFit', v as any)}
                        options={[
                            { value: 'contain', label: 'Contain' },
                            { value: 'cover', label: 'Cover' },
                        ]}
                    />
                    <RangeInput
                        label="Image Height"
                        value={settings.iconHeight || 24}
                        onChange={v => update('iconHeight', v)}
                        min={12}
                        max={64}
                        step={1}
                        unit="px"
                    />
                    <RangeInput
                        label="Image Width"
                        value={settings.iconWidth || 24}
                        onChange={v => update('iconWidth', v)}
                        min={12}
                        max={64}
                        step={1}
                        unit="px"
                    />
                    <RangeInput
                        label="Image Opacity"
                        value={settings.iconOpacity}
                        onChange={v => update('iconOpacity', v)}
                        min={0}
                        max={1}
                        step={0.05}
                    />
                    <SelectInput
                        label="Blend Mode"
                        value={settings.iconBlend}
                        onChange={v => update('iconBlend', v as any)}
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
                            { value: 'exclusion', label: 'Exclusion' },
                        ]}
                    />
                </>
            )}

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.shadow}
                    onChange={e => update('shadow', e.target.checked)}
                    id="shadowToggle"
                    className="h-4 w-4"
                />
                <label htmlFor="shadowToggle" className="text-sm">
                    Shadow
                </label>
            </div>
        </div>
    );
}
