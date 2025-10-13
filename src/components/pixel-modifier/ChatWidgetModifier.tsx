'use client';

import React from 'react';
import {
  TextInput,
  ColorInput,
  RangeInput,
  SelectInput,
} from './lib/inputs';
import { ChatWidgetSettings } from './chat-widget-types';
import { CHAT_WIDGET_CONSTRAINTS, FONT_SIZE_OPTIONS } from './ChatWidgetConstraints';

interface Props {
  settings: ChatWidgetSettings;
  update: <K extends keyof ChatWidgetSettings>(
    key: K,
    value: ChatWidgetSettings[K]
  ) => void;
  isDarkMode: boolean;
}

export default function ChatWidgetModifier({
  settings,
  update,
}: Props) {
  return (
    <div className="lg:w-96 space-y-6 bg-white p-6 rounded-lg shadow-sm overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Chat Widget Modifier
      </h2>

      {/* Dimensions Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Dimensions</h3>
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

      {/* Header Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Header</h3>
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
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Message Bubbles</h3>
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

      {/* Input Area Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Input Area</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColorInput
            label="Input Background"
            value={settings.inputBgColor || '#ffffff'}
            onChange={v => update('inputBgColor', v)}
          />
          <ColorInput
            label="Input Border Color"
            value={settings.inputBorderColor || '#d1d5db'}
            onChange={v => update('inputBorderColor', v)}
          />
        </div>
        <ColorInput
          label="Input Text Color"
          value={settings.inputTextColor || '#111827'}
          onChange={v => update('inputTextColor', v)}
        />
        <TextInput
          label="Placeholder Text"
          value={settings.inputPlaceholder}
          onChange={v => update('inputPlaceholder', v)}
          placeholder="Type a message…"
        />
      </section>

      {/* Send Button Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Send Button</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColorInput
            label="Button Background"
            value={settings.sendBtnBgColor}
            onChange={v => update('sendBtnBgColor', v)}
          />
          <ColorInput
            label="Button Icon Color"
            value={settings.sendBtnIconColor}
            onChange={v => update('sendBtnIconColor', v)}
          />
        </div>
      </section>

      {/* Footer Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Footer</h3>
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
