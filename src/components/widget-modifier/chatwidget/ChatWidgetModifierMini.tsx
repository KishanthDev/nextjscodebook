'use client';

import React, { useState } from 'react';
import {
  TextInput,
  ColorInput,
  RangeInput,
  SelectInput,
} from '@/components/widget-builder/lib/inputs';
import { ChatWidgetSettings } from '@/components/widget-builder/chatwidget/chat-widget-types';
import { CHAT_WIDGET_CONSTRAINTS, FONT_SIZE_OPTIONS } from '@/components/widget-builder/chatwidget/ChatWidgetConstraints';

interface Props {
  settings: ChatWidgetSettings;
  update: <K extends keyof ChatWidgetSettings>(
    key: K,
    value: ChatWidgetSettings[K]
  ) => void;
}

export default function ChatWidgetModifier({ settings, update }: Props) {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    const tags = settings.tags ? [...settings.tags, tag] : [tag];
    update('tags', tags as any);
    setNewTag('');
  };

  const removeTag = (idx: number) => {
    if (!settings.tags) return;
    const tags = settings.tags.filter((_, i) => i !== idx);
    update('tags', tags as any);
  };

  return (
    <div className="lg:w-96 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm dark:shadow-gray-800/30 overflow-y-auto space-y-6 border border-gray-300 dark:border-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Widget Modifier</h2>

      {/* Dimensions */}
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">Dimensions</h3>
        <div className="grid grid-cols-2 gap-4">
          <RangeInput
            label="Width"
            value={settings.width}
            onChange={v => update('width', v)}
            {...CHAT_WIDGET_CONSTRAINTS.width}
          />
          <RangeInput
            label="Height"
            value={settings.height}
            onChange={v => update('height', v)}
            {...CHAT_WIDGET_CONSTRAINTS.height}
          />
        </div>
        <RangeInput
          label="Border Radius"
          value={settings.borderRadius}
          onChange={v => update('borderRadius', v)}
          {...CHAT_WIDGET_CONSTRAINTS.borderRadius}
        />
      </section>

      {/* Header */}
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">Header</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColorInput
            label="Header Background"
            value={settings.headerBgColor}
            onChange={v => update('headerBgColor', v)}
          />
          <ColorInput
            label="Header Text Color"
            value={settings.headerTextColor}
            onChange={v => update('headerTextColor', v)}
          />
        </div>
        <TextInput
          label="Logo URL"
          value={settings.logoUrl}
          onChange={v => update('logoUrl', v)}
          placeholder="https://..."
        />
        <TextInput
          label="Chat Title"
          value={settings.chatTitle}
          onChange={v => update('chatTitle', v)}
          placeholder="Support Chat"
        />
      </section>

      {/* Message Bubbles Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Message Bubbles</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColorInput
            label="User Bubble Color"
            value={settings.userMsgBgColor}
            onChange={v => update('userMsgBgColor', v)}
          />
          <ColorInput
            label="Bot Bubble Color"
            value={settings.botMsgBgColor}
            onChange={v => update('botMsgBgColor', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ColorInput
            label="Messages Background"
            value={settings.messagesBgColor || settings.botMsgBgColor}
            onChange={v => update('messagesBgColor', v)}
          />
          <ColorInput
            label="Message Text Color"
            value={settings.msgTextColor}
            onChange={v => update('msgTextColor', v)}
          />
        </div>
        <SelectInput
          label="Font Size"
          value={String(settings.fontSize)}
          onChange={v => update('fontSize', Number(v))}
          options={FONT_SIZE_OPTIONS}
        />
      </section>

      {/* Question Prompt */}
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">Bot Question</h3>
        <TextInput
          label="Question"
          value={settings.question}
          onChange={v => update('question', v)}
          placeholder="How can I assist you?"
        />
      </section>

      {/* Tags */}
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">Quick-Reply Tags</h3>
        <div className="flex flex-wrap gap-2">
          {(settings.tags || []).map((tag, idx) => (
            <div
              key={idx}
              className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800"
            >
              {tag}
              <button
                onClick={() => removeTag(idx)}
                className="ml-2 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <TextInput
              label="New Tag"
              value={newTag}
              onChange={setNewTag}
              placeholder="Add tag"
            />
          </div>
          <button
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Add
          </button>
        </div>
      </section>

      {/* Input Area */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">Input Area</h3>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <ColorInput
            label="Background"
            value={settings.inputBgColor ?? ''}
            onChange={v => update('inputBgColor', v)}
          />
          <ColorInput
            label="Border Color"
            value={settings.inputBorderColor ?? ''}
            onChange={v => update('inputBorderColor', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ColorInput
            label="Text Color"
            value={settings.inputTextColor ?? ''}
            onChange={v => update('inputTextColor', v)}
          />
        </div>

        {/* Dimensions & Typography */}
        <div className="grid grid-cols-2 gap-4">
          <RangeInput
            label="Border Radius"
            value={settings.inputBorderRadius}
            onChange={v => update('inputBorderRadius', v)}
            min={0}
            max={24}
            step={1}
            unit="px"
          />
          <RangeInput
            label="Padding"
            value={settings.inputPadding}
            onChange={v => update('inputPadding', v)}
            min={4}
            max={20}
            step={1}
            unit="px"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <RangeInput
            label="Font Size"
            value={settings.inputFontSize}
            onChange={v => update('inputFontSize', v)}
            min={12}
            max={20}
            step={1}
            unit="px"
          />
          <RangeInput
            label="Focus Ring Width"
            value={settings.inputFocusRingWidth}
            onChange={v => update('inputFocusRingWidth', v)}
            min={0}
            max={4}
            step={1}
            unit="px"
          />
        </div>
        <ColorInput
          label="Focus Ring Color"
          value={settings.inputFocusRingColor}
          onChange={v => update('inputFocusRingColor', v)}
        />

        {/* Placeholder text */}
        <TextInput
          label="Placeholder Text"
          value={settings.inputPlaceholder}
          onChange={v => update('inputPlaceholder', v)}
          placeholder="Type a message…"
        />
      </section>

      {/* Send Button */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">Send Button</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColorInput
            label="Button Background"
            value={settings.sendBtnBgColor}
            onChange={v => update('sendBtnBgColor', v)}
          />
          <ColorInput
            label="Icon Color"
            value={settings.sendBtnIconColor}
            onChange={v => update('sendBtnIconColor', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <RangeInput
            label="Border Radius"
            value={settings.sendBtnBorderRadius}
            onChange={v => update('sendBtnBorderRadius', v)}
            min={0}
            max={24}
            step={1}
            unit="px"
          />
          <RangeInput
            label="Padding"
            value={settings.sendBtnPadding}
            onChange={v => update('sendBtnPadding', v)}
            min={4}
            max={16}
            step={1}
            unit="px"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <RangeInput
            label="Icon Size"
            value={settings.sendBtnIconSize}
            onChange={v => update('sendBtnIconSize', v)}
            min={16}
            max={32}
            step={1}
            unit="px"
          />
        </div>
      </section>

      {/* Footer */}
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">Footer</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColorInput
            label="Footer Background"
            value={settings.footerBgColor}
            onChange={v => update('footerBgColor', v)}
          />
          <ColorInput
            label="Footer Text Color"
            value={settings.footerTextColor}
            onChange={v => update('footerTextColor', v)}
          />
        </div>
        <TextInput
          label="Footer Text"
          value={settings.footerText}
          onChange={v => update('footerText', v)}
          placeholder="Powered by ChatWidget"
        />
      </section>
    </div>
  );
}