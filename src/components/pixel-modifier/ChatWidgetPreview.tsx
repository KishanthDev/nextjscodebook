'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChatWidgetSettings, Message } from './chat-widget-types';
import { Button } from '@/ui/button';
import { Smile, Send ,Paperclip} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  settings: ChatWidgetSettings;
}

const EMOJIS = ['😊', '👍', '❤️', '😂', '😢', '😎', '🤔', '👋', '🎉', '💯', '🔥', '🚀'];

export default function ChatWidgetPreview({ settings }: Props) {
  const [messages, setMessages] = useState<Message[]>(settings.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(settings.soundsEnabled);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Sync incoming messages
  useEffect(() => {
    setMessages(settings.messages || []);
  }, [settings.messages]);

  // Typing indicator debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(!!newMessage.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [newMessage]);

  // Send message handler
  const onSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { text: newMessage, isUser: true }]);
    setNewMessage('');
    setShowEmojiPicker(false);
    setTimeout(() => {
      const c = document.getElementById('messagesContainer');
      if (c) c.scrollTop = c.scrollHeight;
    }, 10);
  };

  // Compute background (solid or gradient)
  const backgroundStyle = useMemo(() => {
    if (!settings.gradientEnabled) {
      return settings.bgColor;
    }
    const stops = settings.gradientStops
      .map(s => `${s.color} ${s.pos}%`)
      .join(', ');
    return settings.gradientType === 'radial'
      ? `radial-gradient(circle, ${stops})`
      : `linear-gradient(${settings.gradientAngle}deg, ${stops})`;
  }, [
    settings.bgColor,
    settings.gradientEnabled,
    settings.gradientType,
    settings.gradientAngle,
    settings.gradientStops,
  ]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
      toast.success('ChatWidget settings copied to clipboard!');
    } catch (err) {
      toast.error(`Failed to copy: ${String(err)}`);
      alert('Failed to copy settings. Check console.');
    }
  };

  const downloadSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-widget-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex justify-center items-start p-6 relative">
      {/* Actions area: make sure parent is relative */}
      <div className="absolute  right-3 top-0 flex space-x-2 z-20">
        <Button size="sm" onClick={copyToClipboard}>
          Copy Settings
        </Button>
        <Button variant="outline" size="sm" onClick={downloadSettings}>
          Download
        </Button>
      </div>

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
          <div className="relative">
            <button
              onClick={() => setShowDropdown(d => !d)}
              className="p-1"
              style={{ color: settings.headerTextColor }}
            >
              ⋮
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg min-w-[100px] z-10">
                <button
                  className="block w-full px-4 py-2 hover:bg-gray-100"
                  onClick={() => alert('Send transcript')}
                >
                  Send transcript
                </button>
                <button
                  className="block w-full px-4 py-2 hover:bg-gray-100"
                  onClick={() => alert('Move to mobile')}
                >
                  Move to mobile
                </button>
                <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-100">
                  <span>Sounds</span>
                  <input
                    type="checkbox"
                    checked={soundsEnabled}
                    onChange={() => setSoundsEnabled(s => !s)}
                    disabled={!settings.soundsEnabled}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div
          id="messagesContainer"
          className="flex-1 p-4 overflow-y-auto"
          style={{ backgroundColor: settings.messagesBgColor || settings.botMsgBgColor }}
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex mb-2 ${m.isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className="px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: m.isUser
                    ? settings.userMsgBgColor
                    : settings.botMsgBgColor,
                  color: settings.msgTextColor,
                  fontFamily: settings.fontFamily,
                  fontSize: settings.fontSize,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex mb-2 justify-start">
              <div
                className="flex items-center px-3 py-2 rounded-lg"
                style={{ backgroundColor: settings.botMsgBgColor }}
              >
                <span className="animate-ping h-2 w-2 bg-gray-500 rounded-full"></span>
                <span className="animate-ping h-2 w-2 bg-gray-500 rounded-full delay-200"></span>
                <span className="animate-ping h-2 w-2 bg-gray-500 rounded-full delay-400"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className="relative p-3 border-t"
          style={{ backgroundColor: settings.inputBgColor || settings.headerBgColor }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && onSendMessage()}
            placeholder={settings.inputPlaceholder}
            className="w-full px-3 py-2 rounded-lg border"
            style={{
              borderColor: settings.inputBorderColor,
              fontFamily: settings.fontFamily,
              color: settings.inputTextColor,
            }}
          />
          <div className="absolute right-5 top-5 flex items-center gap-2">
            <button
              style={{ color: settings.sendBtnIconColor }}
            >
              <Paperclip size={20}  /> {/* Lucide Smile icon */}
            </button>
            <button
              onClick={() => setShowEmojiPicker(e => !e)}
              style={{ color: settings.sendBtnIconColor }}
            >
              <Smile size={20} /> {/* Lucide Smile icon */}
            </button>
            <button
              onClick={onSendMessage}
              className="p-1 rounded"
              style={{
                backgroundColor: settings.sendBtnBgColor,
                color: settings.sendBtnIconColor,
              }}
            >
              <Send size={20} /> {/* Lucide Send icon */}
            </button>
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-12 right-3 grid grid-cols-6 gap-1 bg-white border rounded shadow p-2">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => {
                    setNewMessage(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-1 text-center text-xs border-t"
          style={{
            backgroundColor: settings.footerBgColor,
            color: settings.footerTextColor,
          }}
        >
          {settings.footerText}
        </div>
      </div>
    </div>
  );
}
