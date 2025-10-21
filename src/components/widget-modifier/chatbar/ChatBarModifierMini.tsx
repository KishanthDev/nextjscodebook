'use client';

import React from 'react';
import {
    TextInput,
    ColorInput,
    RangeInput,
    SelectInput,
    CheckboxInput,
    GradientStopEditor,
} from '@/components/widget-builder/lib/inputs';
import { LucideIconPicker } from '@/components/widget-builder/lib/LucideIconPicker';
import { ChatbarSettings } from '@/components/widget-builder/chatbar/chatbartype';
import { CHAT_BAR_CONSTRAINTS } from '@/components/widget-builder/chatbar/CHAT_BAR_CONSTRAINTS';

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
        <div className="lg:w-96 space-y-6 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm overflow-y-auto border border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Chat Bar Modifier</h2>

            {/* Dimensions Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">Dimensions</h3>
                <div className="grid grid-cols-2 gap-4">
                    <RangeInput
                        label="Width"
                        value={settings.width}
                        onChange={(width) => update('width', width)}
                        {...CHAT_BAR_CONSTRAINTS.width}
                    />
                    <RangeInput
                        label="Height"
                        value={settings.height}
                        onChange={(height) => update('height', height)}
                        {...CHAT_BAR_CONSTRAINTS.height}
                    />
                </div>
            </section>

            {/* Border Radius Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">Border Radius</h3>
                <div className="grid grid-cols-2 gap-4">
                    {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
                        <RangeInput
                            key={corner}
                            label={corner.toUpperCase()}
                            value={settings.borderRadius[corner]}
                            onChange={(value) => updateNestedSetting('borderRadius', corner, value)}
                            {...CHAT_BAR_CONSTRAINTS.borderRadius}
                        />
                    ))}
                </div>
            </section>

            {/* Text Settings Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">Text Settings</h3>

                <TextInput
                    label="Text"
                    value={settings.text}
                    onChange={v => update('text', v)}
                    placeholder="Chat with us"
                />

            </section>

            {/* Background Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">Background</h3>

                <ColorInput
                    label="Background Color"
                    value={settings.bgColor}
                    onChange={v => update('bgColor', v)}
                />
            </section>
        </div>
    );
}