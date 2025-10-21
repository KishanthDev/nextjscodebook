'use client';

import React from 'react';
import {
  TextInput,
  ColorInput,
  RangeInput,
  SelectInput,
  CheckboxInput,
} from '@/components/widget-builder/lib/inputs';
import { GreetingSettings } from '@/components/widget-builder/greeting/greetingtype';
import { GREETING_CONSTRAINTS } from '@/components/widget-builder/greeting/GREETING_CONST';

interface ModifierProps {
  settings: GreetingSettings;
  update: <K extends keyof GreetingSettings>(
    key: K,
    value: GreetingSettings[K]
  ) => void;
}

export default function GreetingModifier({ settings, update }: ModifierProps) {
  const updateNestedSetting = (
    parent: 'borderRadius' | 'imageBorderRadius',
    key: string,
    value: number
  ) => {
    update(parent, {
      ...settings[parent],
      [key]: value,
    } as any);
  };

  return (
    <div className="lg:w-96 space-y-6 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm overflow-y-auto border border-gray-200 dark:border-neutral-700 max-h-[calc(100vh-2rem)]">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Greeting Modifier
      </h2>

      {/* Content Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Content
        </h3>

        <TextInput
          label="Heading Text"
          value={settings.headingText}
          onChange={(v) => update('headingText', v)}
          placeholder="Hello! 👋"
        />

        <TextInput
          label="Description Text"
          value={settings.paraText}
          onChange={(v) => update('paraText', v)}
          placeholder="How can we help you today?"
        />

        <TextInput
          label="Image URL"
          value={settings.imageUrl}
          onChange={(v) => update('imageUrl', v)}
          placeholder="https://..."
        />
      </section>

      {/* Dimensions Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Dimensions
        </h3>

        <RangeInput
          label="Card Width"
          value={settings.width}
          onChange={(v) => update('width', v)}
          {...GREETING_CONSTRAINTS.width}
        />

        <RangeInput
          label="Card Height"
          value={settings.cardHeight}
          onChange={(v) => update('cardHeight', v)}
          {...GREETING_CONSTRAINTS.cardHeight}
        />

        <RangeInput
          label="Image Height"
          value={settings.imageHeight}
          onChange={(v) => update('imageHeight', v)}
          {...GREETING_CONSTRAINTS.imageHeight}
        />
      </section>

      {/* Typography Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Typography
        </h3>

        <RangeInput
          label="Heading Size"
          value={settings.headingSize}
          onChange={(v) => update('headingSize', v)}
          {...GREETING_CONSTRAINTS.headingSize}
        />

        <RangeInput
          label="Paragraph Size"
          value={settings.paraSize}
          onChange={(v) => update('paraSize', v)}
          {...GREETING_CONSTRAINTS.paraSize}
        />

        <RangeInput
          label="Heading Weight"
          value={settings.headingWeight}
          onChange={(v) => update('headingWeight', v)}
          {...GREETING_CONSTRAINTS.fontWeight}
        />

        <RangeInput
          label="Paragraph Weight"
          value={settings.paraWeight}
          onChange={(v) => update('paraWeight', v)}
          {...GREETING_CONSTRAINTS.fontWeight}
        />

        <RangeInput
          label="Letter Spacing"
          value={settings.letterSpacing}
          onChange={(v) => update('letterSpacing', v)}
          {...GREETING_CONSTRAINTS.letterSpacing}
        />

        <RangeInput
          label="Line Height"
          value={settings.lineHeight}
          onChange={(v) => update('lineHeight', v)}
          {...GREETING_CONSTRAINTS.lineHeight}
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
          label="Heading Color"
          value={settings.headingColor}
          onChange={(v) => update('headingColor', v)}
        />

        <ColorInput
          label="Paragraph Color"
          value={settings.paraColor}
          onChange={(v) => update('paraColor', v)}
        />

        <ColorInput
          label="Close Icon Color"
          value={settings.closeIconColor}
          onChange={(v) => update('closeIconColor', v)}
        />
      </section>

      {/* Border Radius Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Card Border Radius
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
            <RangeInput
              key={corner}
              label={corner.toUpperCase()}
              value={settings.borderRadius[corner]}
              onChange={(value) => updateNestedSetting('borderRadius', corner, value)}
              {...GREETING_CONSTRAINTS.borderRadius}
            />
          ))}
        </div>
      </section>

      {/* Image Border Radius Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Image Border Radius
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <RangeInput
            label="Top Left"
            value={settings.imageBorderRadius.tl}
            onChange={(value) => updateNestedSetting('imageBorderRadius', 'tl', value)}
            {...GREETING_CONSTRAINTS.borderRadius}
          />
          <RangeInput
            label="Top Right"
            value={settings.imageBorderRadius.tr}
            onChange={(value) => updateNestedSetting('imageBorderRadius', 'tr', value)}
            {...GREETING_CONSTRAINTS.borderRadius}
          />
        </div>
      </section>

      {/* Image Settings Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Image Settings
        </h3>

        <SelectInput
          label="Image Fit"
          value={settings.imageFit}
          onChange={(v) => update('imageFit', v as any)}
          options={[
            { value: 'cover', label: 'Cover' },
            { value: 'contain', label: 'Contain' },
            { value: 'fill', label: 'Fill' },
          ]}
        />

        <SelectInput
          label="Image Position"
          value={settings.imagePosition}
          onChange={(v) => update('imagePosition', v as any)}
          options={[
            { value: 'top', label: 'Top' },
            { value: 'center', label: 'Center' },
            { value: 'bottom', label: 'Bottom' },
          ]}
        />
      </section>
      {/* Primary Button Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Primary Button
        </h3>

        <CheckboxInput
          label="Show Primary Button"
          checked={settings.showPrimaryBtn}
          onChange={(v) => update('showPrimaryBtn', v)}
        />

        {settings.showPrimaryBtn && (
          <>
            <TextInput
              label="Button Text"
              value={settings.primaryBtnText}
              onChange={(v) => update('primaryBtnText', v)}
              placeholder="Get Started"
            />

            <ColorInput
              label="Button Color"
              value={settings.primaryBtnColor}
              onChange={(v) => update('primaryBtnColor', v)}
            />

            <ColorInput
              label="Text Color"
              value={settings.primaryBtnTextColor}
              onChange={(v) => update('primaryBtnTextColor', v)}
            />

            <RangeInput
              label="Border Radius"
              value={settings.primaryBtnBorderRadius}
              onChange={(v) => update('primaryBtnBorderRadius', v)}
              {...GREETING_CONSTRAINTS.borderRadius}
            />
          </>
        )}
      </section>

      {/* Secondary Button Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Secondary Button
        </h3>

        <CheckboxInput
          label="Show Secondary Button"
          checked={settings.showSecondaryBtn}
          onChange={(v) => update('showSecondaryBtn', v)}
        />

        {settings.showSecondaryBtn && (
          <>
            <TextInput
              label="Button Text"
              value={settings.secondaryBtnText}
              onChange={(v) => update('secondaryBtnText', v)}
              placeholder="Chat with us"
            />

            <TextInput
              label="Button Icon"
              value={settings.secondaryBtnIcon}
              onChange={(v) => update('secondaryBtnIcon', v)}
              placeholder="💬"
            />

            <ColorInput
              label="Button Color"
              value={settings.secondaryBtnColor}
              onChange={(v) => update('secondaryBtnColor', v)}
            />

            <ColorInput
              label="Text Color"
              value={settings.secondaryBtnTextColor}
              onChange={(v) => update('secondaryBtnTextColor', v)}
            />

            <RangeInput
              label="Border Radius"
              value={settings.secondaryBtnBorderRadius}
              onChange={(v) => update('secondaryBtnBorderRadius', v)}
              {...GREETING_CONSTRAINTS.borderRadius}
            />
          </>
        )}
      </section>

      {/* Button Styling Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Button Styling
        </h3>

        <RangeInput
          label="Button Height"
          value={settings.buttonHeight}
          onChange={(v) => update('buttonHeight', v)}
          {...GREETING_CONSTRAINTS.buttonHeight}
        />

        <RangeInput
          label="Font Size"
          value={settings.buttonFontSize}
          onChange={(v) => update('buttonFontSize', v)}
          {...GREETING_CONSTRAINTS.buttonFontSize}
        />

        <RangeInput
          label="Font Weight"
          value={settings.buttonFontWeight}
          onChange={(v) => update('buttonFontWeight', v)}
          {...GREETING_CONSTRAINTS.fontWeight}
        />

        <CheckboxInput
          label="Enable Button Border"
          checked={settings.buttonBorderEnabled}
          onChange={(v) => update('buttonBorderEnabled', v)}
        />

        {settings.buttonBorderEnabled && (
          <>
            <ColorInput
              label="Border Color"
              value={settings.buttonBorderColor}
              onChange={(v) => update('buttonBorderColor', v)}
            />
            <RangeInput
              label="Border Width"
              value={settings.buttonBorderWidth}
              onChange={(v) => update('buttonBorderWidth', v)}
              {...GREETING_CONSTRAINTS.borderWidth}
            />
          </>
        )}
      </section>

      {/* Close Button Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Close Button
        </h3>

        <CheckboxInput
          label="Show Close Button"
          checked={settings.showCloseButton}
          onChange={(v) => update('showCloseButton', v)}
        />

        {settings.showCloseButton && (
          <>
            <SelectInput
              label="Position"
              value={settings.closeButtonPosition}
              onChange={(v) => update('closeButtonPosition', v as any)}
              options={[
                { value: 'top-left', label: 'Top Left' },
                { value: 'top-right', label: 'Top Right' },
              ]}
            />

            <RangeInput
              label="Icon Size"
              value={settings.closeButtonSize}
              onChange={(v) => update('closeButtonSize', v)}
              {...GREETING_CONSTRAINTS.closeButtonSize}
            />
          </>
        )}
      </section>
    </div>
  );
}