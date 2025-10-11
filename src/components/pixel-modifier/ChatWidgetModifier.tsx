'use client';

import React from 'react';
import {
  TextInput,
  ColorInput,
  RangeInput,
  SelectInput,
  CheckboxInput,
  GradientStopEditor,
} from './lib/inputs';
import { ChatWidgetSettings } from './chat-widget-types';

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
  isDarkMode,
}: Props) {
  return (
    <div className="lg:w-96 space-y-6 bg-white p-6 rounded-lg shadow-sm overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Chat Widget Modifier
      </h2>

      {/* Dimensions */}
      <RangeInput
        label="Width"
        value={settings.width}
        onChange={v => update('width', v)}
        min={260}
        max={600}
        step={10}
        unit="px"
      />
      <RangeInput
        label="Height"
        value={settings.height}
        onChange={v => update('height', v)}
        min={300}
        max={800}
        step={10}
        unit="px"
      />
      <RangeInput
        label="Border Radius"
        value={settings.borderRadius}
        onChange={v => update('borderRadius', v)}
        min={0}
        max={24}
        step={1}
        unit="px"
      />

      {/* Header */}
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

      {/* Message Bubbles */}
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
      <SelectInput
        label="Font Size"
        value={String(settings.fontSize)}
        onChange={v => update('fontSize', Number(v))}
        options={[
          { value: '12', label: '12px' },
          { value: '14', label: '14px' },
          { value: '16', label: '16px' },
          { value: '18', label: '18px' },
        ]}
      />

      {/* Input Area */}
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

      {/* Send Button */}
      <ColorInput
        label="Send Button Background"
        value={settings.sendBtnBgColor}
        onChange={v => update('sendBtnBgColor', v)}
      />
      <ColorInput
        label="Send Button Icon Color"
        value={settings.sendBtnIconColor}
        onChange={v => update('sendBtnIconColor', v)}
      />

      {/* Footer */}
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
      <TextInput
        label="Footer Text"
        value={settings.footerText}
        onChange={v => update('footerText', v)}
        placeholder="Powered by ChatWidget"
      />
    </div>
  );
}
