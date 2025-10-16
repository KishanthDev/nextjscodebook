'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChatWidgetSettings, Message } from './chat-widget-types';
import { Smile, Send, Paperclip, Mail, Smartphone, Volume2 } from 'lucide-react';
import { SaveButton } from '../lib/SaveButton';
import { CopyDownloadButtons } from '../lib/CopyDownloadButtons';

interface Props {
  settings: ChatWidgetSettings;
}

const EMOJIS = ['😊', '👍', '❤️', '😂', '😢', '😎', '🤔', '👋', '🎉', '💯', '🔥', '🚀'];

export default function ChatWidgetPreview({ settings }: Props) {
  const [messages, setMessages] = useState<Message[]>(
    settings.question
      ? [{ text: settings.question, isUser: false }]
      : []
  );
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(settings.soundsEnabled);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Typing indicator debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(!!newMessage.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [newMessage]);

  // Send message handler
  const onSendMessage = (text?: string) => {
    const messageText = text ?? newMessage.trim();
    if (!messageText) return;
    setMessages(prev => [...prev, { text: messageText, isUser: true }]);
    setNewMessage('');
    setShowEmojiPicker(false);
    scrollToBottom();
  };

  // Scroll helper
  const scrollToBottom = () => {
    setTimeout(() => {
      const container = document.getElementById('messagesContainer');
      if (container) container.scrollTop = container.scrollHeight;
    }, 10);
  };

  // Tag click handler (UI-only tags)
  const handleTagClick = (tag: string) => {
    onSendMessage(tag);
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          text: `Thanks for selecting "${tag}". How else can I assist you?`,
          isUser: false
        }
      ]);
      scrollToBottom();
    }, 1000);
  };

  // Background style memo
  const backgroundStyle = useMemo(() => {
    if (!settings.gradientEnabled) {
      return settings.bgColor;
    }
    const stops = settings.gradientStops
      ?.map(s => `${s.color} ${s.pos}%`)
      .join(', ') || '';
    return settings.gradientType === 'radial'
      ? `radial-gradient(circle, ${stops})`
      : `linear-gradient(${settings.gradientAngle || 0}deg, ${stops})`;
  }, [
    settings.bgColor,
    settings.gradientEnabled,
    settings.gradientType,
    settings.gradientAngle,
    settings.gradientStops,
  ]);

  return (
    <div className="flex-1 flex justify-center dark:bg-neutral-800 rounded-lg  items-start p-6 relative">
      {/* Actions */}
      <div className="absolute right-4 top-4 flex space-x-2 z-20">
        <CopyDownloadButtons settings={settings} filename='chatwidget-settings.json' />
        <SaveButton type='chatwidget' data={settings} />
      </div>

      {/* Widget Container */}
      <div
        className="flex flex-col mt-5 border rounded-lg shadow-lg overflow-hidden relative"
        style={{
          width: settings.width,
          height: settings.height,
          borderRadius: settings.borderRadius,
          background: backgroundStyle,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 border-b"
          style={{ backgroundColor: settings.headerBgColor }}
        >
          <div className="flex items-center gap-2">
            <img
              src={settings.logoUrl || 'https://via.placeholder.com/32'}
              alt="Logo"
              className="w-8 h-8 rounded-full border"
              onError={e => (e.currentTarget.src = 'https://via.placeholder.com/32')}
            />
            <span
              className="font-semibold"
              style={{ color: settings.headerTextColor, fontFamily: settings.fontFamily }}
            >
              {settings.chatTitle}
            </span>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(d => !d)}
              className="p-1"
              style={{ color: settings.headerTextColor }}
            >
              ⋮
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-3 min-w-[180px] bg-white rounded-lg shadow-md border border-gray-200 z-10">
                <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => alert('Send transcript')}>
                  <Mail size={18} className="text-gray-600" />
                  <span>Send transcript</span>
                </button>
                <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => alert('Move to mobile')}>
                  <Smartphone size={18} className="text-gray-600" />
                  <span>Move to mobile</span>
                </button>
                <div className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <Volume2 size={18} className="text-gray-600" />
                    <span>Sounds</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundsEnabled}
                    onChange={() => setSoundsEnabled(s => !s)}
                    disabled={!settings.soundsEnabled}
                    className="cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div
          id="messagesContainer"
          className="flex-1 p-4 overflow-y-auto overflow-x-hidden"
          style={{
            backgroundColor: settings.messagesBgColor || settings.botMsgBgColor,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style jsx>{`
            #messagesContainer::-webkit-scrollbar { display: none; }
            .typing-indicator { /* styling omitted for brevity */ }
          `}</style>

          <div className="space-y-3">
            {/* Render messages */}
            {messages.map((message, idx) => (
              <div key={idx} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-3 py-2 rounded-lg break-words whitespace-pre-line ${message.isUser ? 'rounded-br-none' : 'rounded-bl-none'}`}
                  style={{
                    backgroundColor: message.isUser ? settings.userMsgBgColor : settings.botMsgBgColor,
                    color: settings.msgTextColor,
                    fontFamily: settings.fontFamily,
                    fontSize: settings.fontSize,
                    width: 'fit-content',
                  }}
                >
                  {message.text}

                  {/* Display tags only on the very first bot message */}
                  {idx === 0 && !message.isUser && settings.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {settings.tags.map((tag, i) => (
                        <button
                          key={i}
                          onClick={() => handleTagClick(tag)}
                          className="px-3 py-1 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                          style={{
                            color: settings.sendBtnIconColor
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div
          className="flex-none relative p-3 border-t"
          style={{ backgroundColor: settings.inputBgColor || settings.headerBgColor }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSendMessage()}
            placeholder={settings.inputPlaceholder}
            className="w-full rounded-lg transition-all duration-200"
            style={{
              padding: `${settings.inputPadding}px`,
              paddingRight: `${settings.inputPadding + 120}px`, // Extra space for icons
              border: `1px solid ${settings.inputBorderColor}`,
              borderRadius: settings.inputBorderRadius,
              fontSize: settings.inputFontSize,
              fontFamily: settings.fontFamily,
              color: settings.inputTextColor,
              backgroundColor: settings.inputBgColor,
              outline: 'none'
            }}
            onFocus={e => {
              if (settings.inputFocusRingWidth) {
                e.target.style.outline = `${settings.inputFocusRingWidth}px solid ${settings.inputFocusRingColor}`;
              }
            }}
            onBlur={e => {
              e.target.style.outline = 'none';
            }}
          />
          <div
            className="absolute right-6"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <button
              className="p-1 rounded transition-all duration-200 hover:bg-gray-100"
              style={{
                color: settings.sendBtnIconColor,
                fontSize: settings.sendBtnIconSize
              }}
            >
              <Paperclip size={settings.sendBtnIconSize} />
            </button>
            <button
              onClick={() => setShowEmojiPicker(p => !p)}
              className="p-1 rounded transition-all duration-200 hover:bg-gray-100"
              style={{
                color: settings.sendBtnIconColor,
                fontSize: settings.sendBtnIconSize
              }}
            >
              <Smile size={settings.sendBtnIconSize} />
            </button>
            <button
              onClick={() => onSendMessage()}
              disabled={!newMessage.trim()}
              className="rounded transition-all duration-200"
              style={{
                backgroundColor: settings.sendBtnBgColor,
                color: settings.sendBtnIconColor,
                borderRadius: settings.sendBtnBorderRadius,
                padding: `${settings.sendBtnPadding}px`,
                fontSize: settings.sendBtnIconSize,
                opacity: 1
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = settings.sendBtnHoverOpacity.toString();
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <Send size={settings.sendBtnIconSize} />
            </button>
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-12 right-6 grid grid-cols-6 gap-1 bg-white border rounded shadow p-2 z-10">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setNewMessage(n => n + e);
                    setShowEmojiPicker(false);
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-1 text-center text-xs border-t"
          style={{ backgroundColor: settings.footerBgColor, color: settings.footerTextColor }}
        >
          {settings.footerText}
        </div>
      </div>
    </div>
  );
}
