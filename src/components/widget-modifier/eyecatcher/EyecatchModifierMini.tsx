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
import { EyecatcherSettings } from '@/components/widget-builder/eyecatcher/eyecatchertype';
import { EYECATCHER_CONSTRAINTS } from '@/components/widget-builder/eyecatcher/EYECATCHER_CONSTRAINTS';

interface ModifierProps {
  settings: EyecatcherSettings;
  update: <K extends keyof EyecatcherSettings>(
    key: K,
    value: EyecatcherSettings[K]
  ) => void;
}

export default function EyecatcherModifier({ settings, update }: ModifierProps) {
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
    <div className="lg:w-96 space-y-6 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm overflow-y-auto border border-gray-200 dark:border-neutral-700 max-h-[calc(100vh-2rem)]">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Eyecatcher Modifier
      </h2>

      {/* Content Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Content
        </h3>

        <TextInput
          label="Title"
          value={settings.title}
          onChange={(v) => update('title', v)}
          placeholder="Welcome!"
        />

        <TextInput
          label="Description Text"
          value={settings.text}
          onChange={(v) => update('text', v)}
          placeholder="How can we help you today?"
        />

        <TextInput
          label="Emoji"
          value={settings.emoji}
          onChange={(v) => update('emoji', v)}
          placeholder="👋"
        />
      </section>

      {/* Dimensions Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Dimensions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <RangeInput
            label="Width"
            value={settings.width}
            onChange={(v) => update('width', v)}
            {...EYECATCHER_CONSTRAINTS.width}
          />
          <RangeInput
            label="Height"
            value={settings.height}
            onChange={(v) => update('height', v)}
            {...EYECATCHER_CONSTRAINTS.height}
          />
        </div>
      </section>

      {/* Colors Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Colors
        </h3>

        <ColorInput
          label="Background Color"
          value={settings.bgColor}
          onChange={(v) => update('bgColor', v)}
        />

        <ColorInput
          label="Title Color"
          value={settings.titleColor}
          onChange={(v) => update('titleColor', v)}
        />

        <ColorInput
          label="Text Color"
          value={settings.textColor}
          onChange={(v) => update('textColor', v)}
        />
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
              {...EYECATCHER_CONSTRAINTS.borderRadius}
            />
          ))}
        </div>
      </section>
    </div>
  );
}