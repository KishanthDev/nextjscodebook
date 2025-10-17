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
import { EyecatcherSettings } from './eyecatchertype';
import { EYECATCHER_CONSTRAINTS } from './EYECATCHER_CONSTRAINTS';

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

      {/* Typography Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Typography
        </h3>

        <RangeInput
          label="Title Size"
          value={settings.titleSize}
          onChange={(v) => update('titleSize', v)}
          {...EYECATCHER_CONSTRAINTS.titleSize}
        />

        <RangeInput
          label="Text Size"
          value={settings.textSize}
          onChange={(v) => update('textSize', v)}
          {...EYECATCHER_CONSTRAINTS.textSize}
        />

        <RangeInput
          label="Title Weight"
          value={settings.titleWeight}
          onChange={(v) => update('titleWeight', v)}
          {...EYECATCHER_CONSTRAINTS.titleWeight}
        />

        <RangeInput
          label="Letter Spacing"
          value={settings.letterSpacing}
          onChange={(v) => update('letterSpacing', v)}
          {...EYECATCHER_CONSTRAINTS.letterSpacing}
        />
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

      {/* Gradient Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Gradient
        </h3>

        <CheckboxInput
          label="Enable Gradient"
          checked={settings.gradientEnabled}
          onChange={(v) => update('gradientEnabled', v)}
        />

        {settings.gradientEnabled && (
          <>
            <SelectInput
              label="Gradient Type"
              value={settings.gradientType}
              onChange={(v) => update('gradientType', v as any)}
              options={[
                { value: 'linear', label: 'Linear' },
                { value: 'radial', label: 'Radial' },
                { value: 'conic', label: 'Conic' },
              ]}
            />
            <RangeInput
              label="Gradient Angle"
              value={settings.gradientAngle}
              onChange={(v) => update('gradientAngle', v)}
              {...EYECATCHER_CONSTRAINTS.gradientAngle}
            />
            <GradientStopEditor
              stops={settings.gradientStops}
              onChange={(v) => update('gradientStops', v)}
            />
          </>
        )}
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

      {/* Border Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Border
        </h3>

        <CheckboxInput
          label="Enable Border"
          checked={settings.borderEnabled}
          onChange={(v) => update('borderEnabled', v)}
        />

        {settings.borderEnabled && (
          <>
            <ColorInput
              label="Border Color"
              value={settings.borderColor}
              onChange={(v) => update('borderColor', v)}
            />
            <RangeInput
              label="Border Width"
              value={settings.borderWidth}
              onChange={(v) => update('borderWidth', v)}
              {...EYECATCHER_CONSTRAINTS.borderWidth}
            />
          </>
        )}
      </section>

      {/* Shadow Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Shadow
        </h3>

        <CheckboxInput
          label="Enable Shadow"
          checked={settings.shadow}
          onChange={(v) => update('shadow', v)}
        />

        {settings.shadow && (
          <>
            <ColorInput
              label="Shadow Color"
              value={settings.shadowColor}
              onChange={(v) => update('shadowColor', v)}
            />
            <RangeInput
              label="Shadow Blur"
              value={settings.shadowBlur}
              onChange={(v) => update('shadowBlur', v)}
              {...EYECATCHER_CONSTRAINTS.shadowBlur}
            />
            <RangeInput
              label="Shadow X"
              value={settings.shadowX}
              onChange={(v) => update('shadowX', v)}
              {...EYECATCHER_CONSTRAINTS.shadowOffset}
            />
            <RangeInput
              label="Shadow Y"
              value={settings.shadowY}
              onChange={(v) => update('shadowY', v)}
              {...EYECATCHER_CONSTRAINTS.shadowOffset}
            />
          </>
        )}
      </section>

      {/* Layout Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Layout
        </h3>

        <SelectInput
          label="Emoji Position"
          value={settings.emojiPosition}
          onChange={(v) => update('emojiPosition', v as any)}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'top', label: 'Top' },
            { value: 'right', label: 'Right' },
          ]}
        />

        <RangeInput
          label="Emoji Size"
          value={settings.emojiSize}
          onChange={(v) => update('emojiSize', v)}
          {...EYECATCHER_CONSTRAINTS.emojiSize}
        />

        <SelectInput
          label="Content Alignment"
          value={settings.contentAlignment}
          onChange={(v) => update('contentAlignment', v as any)}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
        />

        <RangeInput
          label="Padding"
          value={settings.padding}
          onChange={(v) => update('padding', v)}
          {...EYECATCHER_CONSTRAINTS.padding}
        />

        <RangeInput
          label="Gap"
          value={settings.gap}
          onChange={(v) => update('gap', v)}
          {...EYECATCHER_CONSTRAINTS.gap}
        />
      </section>

      {/* Animation Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Animation
        </h3>

        <CheckboxInput
          label="Enable Animation"
          checked={settings.animationEnabled}
          onChange={(v) => update('animationEnabled', v)}
        />

        {settings.animationEnabled && (
          <>
            <SelectInput
              label="Animation Type"
              value={settings.animationType}
              onChange={(v) => update('animationType', v as any)}
              options={[
                { value: 'wave', label: 'Wave' },
                { value: 'bounce', label: 'Bounce' },
                { value: 'pulse', label: 'Pulse' },
                { value: 'rotate', label: 'Rotate' },
                { value: 'none', label: 'None' },
              ]}
            />
            <RangeInput
              label="Animation Duration (seconds)"
              value={settings.animationDuration}
              onChange={(v) => update('animationDuration', v)}
              {...EYECATCHER_CONSTRAINTS.animationDuration}
            />
          </>
        )}
      </section>
    </div>
  );
}