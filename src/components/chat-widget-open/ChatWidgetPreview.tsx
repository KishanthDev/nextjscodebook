'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSettingsStore } from '@/stores/settingsStore';
import { Message, ChatWidgetSettings } from '@/types/WidgetOpen';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import data from '../../../data/modifier.json';

export default function ChatWidgetPreview() {
  const defaultSettings: ChatWidgetSettings = data.chatwidgetopen

  const { settings, loading, fetchSettings } = useSettingsStore();
  const [messages, setMessages] = useState<Message[]>(data.chatwidgetopen.messages);
  const [newMessage, setNewMessage] = useState('');
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    fetchSettings('chatWidget', defaultSettings);
  }, [fetchSettings]);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    setMessages((prev) => [...prev, { text: newMessage, isUser: true }]);
    setNewMessage('');
    setTimeout(() => {
      const messagesContainer = document.getElementById('messagesContainer');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 10);
  };

  const toggleSounds = () => {
    setSoundsEnabled((prev) => !prev);
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="flex justify-center items-start p-6">
          <div className="w-[370px] h-[700px] border rounded-lg overflow-hidden">
            <div className="p-3 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton circle width={32} height={32} />
                <Skeleton width={80} height={16} />
              </div>
              <div className="flex gap-2">
                <Skeleton width={24} height={24} borderRadius={4} />
                <Skeleton width={24} height={24} borderRadius={4} />
                <Skeleton width={24} height={24} borderRadius={4} />
              </div>
            </div>
            <div className="p-4 flex-1">
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-start">
                    <Skeleton width={200} height={40} borderRadius={8} />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 border-t">
              <div className="flex">
                <Skeleton width="100%" height={40} borderRadius={8} />
              </div>
            </div>
            <div className="p-1 border-t">
              <Skeleton width={120} height={12} containerClassName="flex justify-center" />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  const chatSettings = settings.chatWidget ?? defaultSettings;

  return (
    <div className="flex justify-center items-start p-6">
      <div className="w-[370px] h-[700px] border rounded-lg overflow-hidden shadow-lg flex flex-col">
        <ChatHeader settings={chatSettings} soundsEnabled={soundsEnabled} toggleSounds={toggleSounds} />
        <ChatMessages messages={messages} settings={chatSettings} />
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          settings={chatSettings}
        />
        <div
          className="p-1 text-center text-xs border-t"
          style={{
            backgroundColor: chatSettings.footerBgColor,
            color: chatSettings.footerTextColor,
          }}
        >
          {chatSettings.footerText}
        </div>
      </div>
    </div>
  );
}