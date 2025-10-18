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
import { ChatWidgetSettings } from './chatwidgettype';
import { CHATWIDGET_CONSTRAINTS } from './CHATWIDGET_CONST';

interface ModifierProps {
  settings: ChatWidgetSettings;
  update: <K extends keyof ChatWidgetSettings>(
    key: K,
    value: ChatWidgetSettings[K]
  ) => void;
}

export default function ChatWidgetModifier({ settings, update }: ModifierProps) {
  return (
    <div className="lg:w-96 space-y-6 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm overflow-y-auto border border-gray-200 dark:border-neutral-700 max-h-[calc(100vh-2rem)]">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Chat Widget Modifier
      </h2>

      {/* Widget Dimensions */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Widget Dimensions
        </h3>
        <RangeInput
          label="Widget Width"
          value={settings.widgetWidth}
          onChange={(v) => update('widgetWidth', v)}
          {...CHATWIDGET_CONSTRAINTS.widgetWidth}
        />
      </section>

      {/* Header Settings */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Header
        </h3>
        <TextInput
          label="Logo URL"
          value={settings.logoUrl}
          onChange={(v) => update('logoUrl', v)}
          placeholder="https://..."
        />
        <TextInput
          label="Chat Title"
          value={settings.chatTitle}
          onChange={(v) => update('chatTitle', v)}
          placeholder="Support Chat"
        />
        <ColorInput
          label="Header Background"
          value={settings.headerBgColor}
          onChange={(v) => update('headerBgColor', v)}
        />
        <ColorInput
          label="Header Text Color"
          value={settings.headerTextColor}
          onChange={(v) => update('headerTextColor', v)}
        />
        <RangeInput
          label="Header Height"
          value={settings.headerHeight}
          onChange={(v) => update('headerHeight', v)}
          {...CHATWIDGET_CONSTRAINTS.headerHeight}
        />
        <CheckboxInput
          label="Show Back Button"
          checked={settings.showBackButton}
          onChange={(v) => update('showBackButton', v)}
        />
        <CheckboxInput
          label="Show Menu Button"
          checked={settings.showMenuButton}
          onChange={(v) => update('showMenuButton', v)}
        />
        <CheckboxInput
          label="Show Minimize Button"
          checked={settings.showMinimizeButton}
          onChange={(v) => update('showMinimizeButton', v)}
        />
      </section>

      {/* Chat Background */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Chat Background
        </h3>
        <ColorInput
          label="Background Color"
          value={settings.chatBgColor}
          onChange={(v) => update('chatBgColor', v)}
        />
        <CheckboxInput
          label="Enable Gradient"
          checked={settings.chatBgGradientEnabled}
          onChange={(v) => update('chatBgGradientEnabled', v)}
        />
        {settings.chatBgGradientEnabled && (
          <>
            <SelectInput
              label="Gradient Type"
              value={settings.chatBgGradientType}
              onChange={(v) => update('chatBgGradientType', v as any)}
              options={[
                { value: 'linear', label: 'Linear' },
                { value: 'radial', label: 'Radial' },
                { value: 'conic', label: 'Conic' },
              ]}
            />
            <RangeInput
              label="Gradient Angle"
              value={settings.chatBgGradientAngle}
              onChange={(v) => update('chatBgGradientAngle', v)}
              {...CHATWIDGET_CONSTRAINTS.gradientAngle}
            />
            <GradientStopEditor
              stops={settings.chatBgGradientStops}
              onChange={(v) => update('chatBgGradientStops', v)}
            />
          </>
        )}
      </section>

      {/* Message Settings */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Messages
        </h3>
        <ColorInput
          label="User Message Background"
          value={settings.userMsgBgColor}
          onChange={(v) => update('userMsgBgColor', v)}
        />
        <ColorInput
          label="User Message Text"
          value={settings.userMsgTextColor}
          onChange={(v) => update('userMsgTextColor', v)}
        />
        <ColorInput
          label="Bot Message Background"
          value={settings.botMsgBgColor}
          onChange={(v) => update('botMsgBgColor', v)}
        />
        <ColorInput
          label="Bot Message Text"
          value={settings.botMsgTextColor}
          onChange={(v) => update('botMsgTextColor', v)}
        />
        <RangeInput
          label="Font Size"
          value={settings.msgFontSize}
          onChange={(v) => update('msgFontSize', v)}
          {...CHATWIDGET_CONSTRAINTS.msgFontSize}
        />
        <RangeInput
          label="Border Radius"
          value={settings.msgBorderRadius}
          onChange={(v) => update('msgBorderRadius', v)}
          {...CHATWIDGET_CONSTRAINTS.msgBorderRadius}
        />
        <RangeInput
          label="Padding"
          value={settings.msgPadding}
          onChange={(v) => update('msgPadding', v)}
          {...CHATWIDGET_CONSTRAINTS.msgPadding}
        />
        <RangeInput
          label="Spacing"
          value={settings.msgSpacing}
          onChange={(v) => update('msgSpacing', v)}
          {...CHATWIDGET_CONSTRAINTS.msgSpacing}
        />
        <CheckboxInput
          label="Show Timestamp"
          checked={settings.showTimestamp}
          onChange={(v) => update('showTimestamp', v)}
        />
      </section>

      {/* Input Area */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Input Area
        </h3>
        <TextInput
          label="Placeholder"
          value={settings.inputPlaceholder}
          onChange={(v) => update('inputPlaceholder', v)}
          placeholder="Type a message..."
        />
        <ColorInput
          label="Input Background"
          value={settings.inputBgColor}
          onChange={(v) => update('inputBgColor', v)}
        />
        <ColorInput
          label="Input Text Color"
          value={settings.inputTextColor}
          onChange={(v) => update('inputTextColor', v)}
        />
        <ColorInput
          label="Input Border Color"
          value={settings.inputBorderColor}
          onChange={(v) => update('inputBorderColor', v)}
        />
        <RangeInput
          label="Input Height"
          value={settings.inputHeight}
          onChange={(v) => update('inputHeight', v)}
          {...CHATWIDGET_CONSTRAINTS.inputHeight}
        />
        <RangeInput
          label="Input Font Size"
          value={settings.inputFontSize}
          onChange={(v) => update('inputFontSize', v)}
          {...CHATWIDGET_CONSTRAINTS.inputFontSize}
        />
        <RangeInput
          label="Border Radius"
          value={settings.inputBorderRadius}
          onChange={(v) => update('inputBorderRadius', v)}
          {...CHATWIDGET_CONSTRAINTS.inputBorderRadius}
        />
      </section>

      {/* Send Button */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Send Button
        </h3>
        <ColorInput
          label="Button Background"
          value={settings.sendBtnBgColor}
          onChange={(v) => update('sendBtnBgColor', v)}
        />
        <ColorInput
          label="Icon Color"
          value={settings.sendBtnIconColor}
          onChange={(v) => update('sendBtnIconColor', v)}
        />
        <RangeInput
          label="Button Size"
          value={settings.sendBtnSize}
          onChange={(v) => update('sendBtnSize', v)}
          {...CHATWIDGET_CONSTRAINTS.sendBtnSize}
        />
        <RangeInput
          label="Border Radius"
          value={settings.sendBtnBorderRadius}
          onChange={(v) => update('sendBtnBorderRadius', v)}
          {...CHATWIDGET_CONSTRAINTS.sendBtnBorderRadius}
        />
      </section>

      {/* Emoji & Attachments */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Input Actions
        </h3>
        <CheckboxInput
          label="Show Emoji Picker"
          checked={settings.showEmojiPicker}
          onChange={(v) => update('showEmojiPicker', v)}
        />
        <CheckboxInput
          label="Show Attach Button"
          checked={settings.showAttachButton}
          onChange={(v) => update('showAttachButton', v)}
        />
        <ColorInput
          label="Emoji Button Color"
          value={settings.emojiButtonColor}
          onChange={(v) => update('emojiButtonColor', v)}
        />
        <ColorInput
          label="Attach Button Color"
          value={settings.attachButtonColor}
          onChange={(v) => update('attachButtonColor', v)}
        />
      </section>

      {/* Typing Indicator */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Typing Indicator
        </h3>
        <CheckboxInput
          label="Show Typing Indicator"
          checked={settings.showTypingIndicator}
          onChange={(v) => update('showTypingIndicator', v)}
        />
        <ColorInput
          label="Indicator Color"
          value={settings.typingIndicatorColor}
          onChange={(v) => update('typingIndicatorColor', v)}
        />
        <ColorInput
          label="Indicator Background"
          value={settings.typingIndicatorBgColor}
          onChange={(v) => update('typingIndicatorBgColor', v)}
        />
      </section>

      {/* Footer */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Footer
        </h3>
        <CheckboxInput
          label="Show Footer"
          checked={settings.showFooter}
          onChange={(v) => update('showFooter', v)}
        />
        {settings.showFooter && (
          <>
            <TextInput
              label="Footer Text"
              value={settings.footerText}
              onChange={(v) => update('footerText', v)}
              placeholder="Powered by ChatWidget"
            />
            <ColorInput
              label="Footer Background"
              value={settings.footerBgColor}
              onChange={(v) => update('footerBgColor', v)}
            />
            <ColorInput
              label="Footer Text Color"
              value={settings.footerTextColor}
              onChange={(v) => update('footerTextColor', v)}
            />
            <RangeInput
              label="Footer Height"
              value={settings.footerHeight}
              onChange={(v) => update('footerHeight', v)}
              {...CHATWIDGET_CONSTRAINTS.footerHeight}
            />
          </>
        )}
      </section>

      {/* Contact Form */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Contact Form
        </h3>
        <TextInput
          label="Form Title"
          value={settings.formTitle}
          onChange={(v) => update('formTitle', v)}
          placeholder="Contact Us"
        />
        <TextInput
          label="Message 1"
          value={settings.formMessage1}
          onChange={(v) => update('formMessage1', v)}
          placeholder="Please fill in the form"
        />
        <TextInput
          label="Message 2"
          value={settings.formMessage2}
          onChange={(v) => update('formMessage2', v)}
          placeholder="We are sorry..."
        />
        <ColorInput
          label="Form Background"
          value={settings.formBgColor}
          onChange={(v) => update('formBgColor', v)}
        />
        <ColorInput
          label="Form Border Color"
          value={settings.formBorderColor}
          onChange={(v) => update('formBorderColor', v)}
        />
        <ColorInput
          label="Title Color"
          value={settings.formTitleColor}
          onChange={(v) => update('formTitleColor', v)}
        />
        <ColorInput
          label="Message Color"
          value={settings.formMessageColor}
          onChange={(v) => update('formMessageColor', v)}
        />
        <ColorInput
          label="Label Color"
          value={settings.formLabelColor}
          onChange={(v) => update('formLabelColor', v)}
        />
        <ColorInput
          label="Input Background"
          value={settings.formInputBgColor}
          onChange={(v) => update('formInputBgColor', v)}
        />
        <ColorInput
          label="Input Border Color"
          value={settings.formInputBorderColor}
          onChange={(v) => update('formInputBorderColor', v)}
        />
        <RangeInput
          label="Form Border Radius"
          value={settings.formBorderRadius}
          onChange={(v) => update('formBorderRadius', v)}
          {...CHATWIDGET_CONSTRAINTS.formBorderRadius}
        />
        <RangeInput
          label="Input Border Radius"
          value={settings.formInputBorderRadius}
          onChange={(v) => update('formInputBorderRadius', v)}
          {...CHATWIDGET_CONSTRAINTS.inputBorderRadius}
        />
      </section>

      {/* Submit Button */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Submit Button
        </h3>
        <TextInput
          label="Button Text"
          value={settings.submitBtnText}
          onChange={(v) => update('submitBtnText', v)}
          placeholder="Submit"
        />
        <TextInput
          label="Submitted Text"
          value={settings.submitBtnSubmittedText}
          onChange={(v) => update('submitBtnSubmittedText', v)}
          placeholder="Submitted!"
        />
        <ColorInput
          label="Button Background"
          value={settings.submitBtnBgColor}
          onChange={(v) => update('submitBtnBgColor', v)}
        />
        <ColorInput
          label="Button Text Color"
          value={settings.submitBtnFontColor}
          onChange={(v) => update('submitBtnFontColor', v)}
        />
        <RangeInput
          label="Button Height"
          value={settings.submitBtnHeight}
          onChange={(v) => update('submitBtnHeight', v)}
          {...CHATWIDGET_CONSTRAINTS.submitBtnHeight}
        />
        <RangeInput
          label="Border Radius"
          value={settings.submitBtnBorderRadius}
          onChange={(v) => update('submitBtnBorderRadius', v)}
          {...CHATWIDGET_CONSTRAINTS.submitBtnBorderRadius}
        />
      </section>

      {/* Widget Styling */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Widget Styling
        </h3>
        <CheckboxInput
          label="Enable Shadow"
          checked={settings.widgetShadow}
          onChange={(v) => update('widgetShadow', v)}
        />
        {settings.widgetShadow && (
          <>
            <ColorInput
              label="Shadow Color"
              value={settings.widgetShadowColor}
              onChange={(v) => update('widgetShadowColor', v)}
            />
            <RangeInput
              label="Shadow Blur"
              value={settings.widgetShadowBlur}
              onChange={(v) => update('widgetShadowBlur', v)}
              {...CHATWIDGET_CONSTRAINTS.widgetShadowBlur}
            />
          </>
        )}
        <CheckboxInput
          label="Enable Border"
          checked={settings.widgetBorderEnabled}
          onChange={(v) => update('widgetBorderEnabled', v)}
        />
        {settings.widgetBorderEnabled && (
          <>
            <ColorInput
              label="Border Color"
              value={settings.widgetBorderColor}
              onChange={(v) => update('widgetBorderColor', v)}
            />
            <RangeInput
              label="Border Width"
              value={settings.widgetBorderWidth}
              onChange={(v) => update('widgetBorderWidth', v)}
              {...CHATWIDGET_CONSTRAINTS.widgetBorderWidth}
            />
          </>
        )}
        <RangeInput
          label="Border Radius"
          value={settings.widgetBorderRadius}
          onChange={(v) => update('widgetBorderRadius', v)}
          {...CHATWIDGET_CONSTRAINTS.widgetBorderRadius}
        />
      </section>

      {/* Scrollbar */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Scrollbar
        </h3>
        <RangeInput
          label="Scrollbar Width"
          value={settings.scrollbarWidth}
          onChange={(v) => update('scrollbarWidth', v)}
          {...CHATWIDGET_CONSTRAINTS.scrollbarWidth}
        />
        <ColorInput
          label="Thumb Color"
          value={settings.scrollbarThumbColor}
          onChange={(v) => update('scrollbarThumbColor', v)}
        />
        <ColorInput
          label="Track Color"
          value={settings.scrollbarTrackColor}
          onChange={(v) => update('scrollbarTrackColor', v)}
        />
      </section>

      {/* Animation */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Animation
        </h3>
        <CheckboxInput
          label="Enable Message Animation"
          checked={settings.messageAnimationEnabled}
          onChange={(v) => update('messageAnimationEnabled', v)}
        />
        {settings.messageAnimationEnabled && (
          <>
            <SelectInput
              label="Animation Type"
              value={settings.messageAnimationType}
              onChange={(v) => update('messageAnimationType', v as any)}
              options={[
                { value: 'fade', label: 'Fade' },
                { value: 'slide', label: 'Slide' },
                { value: 'scale', label: 'Scale' },
                { value: 'none', label: 'None' },
              ]}
            />
            <RangeInput
              label="Animation Duration"
              value={settings.animationDuration}
              onChange={(v) => update('animationDuration', v)}
              {...CHATWIDGET_CONSTRAINTS.animationDuration}
            />
          </>
        )}
      </section>
    </div>
  );
}