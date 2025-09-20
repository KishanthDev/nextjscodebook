'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSettingsStore } from '@/stores/settingsStore';
import { Message, ChatWidgetSettings } from '@/types/Modifier';
import defaultConfig from '../../../data/modifier.json';
import ChatPreview from '@/components/modifier/chat-widget/ChatPreview';

export default function ChatWidgetPreview() {
  const { settings, loading, fetchSettings } = useSettingsStore();
  const [newMessage, setNewMessage] = useState('');
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  const defaultSettings: ChatWidgetSettings = defaultConfig.chatWidget;

  // ✅ keep preview messages in local state only
  const [previewMessages, setPreviewMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMounted(true);
    console.log('Fetching chatWidget settings...');
    fetchSettings('chatWidget', defaultSettings);
  }, [fetchSettings]);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  useEffect(() => {
    if (settings.chatWidget?.messages?.length > 0) {
      setPreviewMessages(settings.chatWidget.messages);
    } else {
      setPreviewMessages([
        {
          text: 'What would you like to do?',
          isUser: false,
          tags: ['View Products', 'Support', 'Pricing'],
        },
      ]);
    }
  }, [settings.chatWidget]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const newMsg: Message = { text: newMessage, isUser: true };
    setPreviewMessages((prev) => [...prev, newMsg]); // ✅ local only
    setNewMessage('');
    setTimeout(() => {
      const messagesContainer = document.getElementById('messagesContainer');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 10);
  };

  const handleTagClick = (tag: string, msgIndex: number) => {
    const newMsg: Message = { text: tag, isUser: true };
    setPreviewMessages((prev) => [
      ...prev.map((m, i) => (i === msgIndex ? { ...m, tags: [] } : m)),
      newMsg,
    ]); // ✅ local only
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

  const chatSettings: ChatWidgetSettings = {
    ...defaultSettings,
    ...settings.chatWidget,
    messages: previewMessages, // ✅ use local previewMessages
  };

  return (
    <div className="flex justify-center items-start p-6">
      <div className="w-[370px] h-[700px] border rounded-lg overflow-hidden shadow-lg flex flex-col">
        <ChatPreview
          settings={chatSettings}
          messages={chatSettings.messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
          isSaving={isSaving}
          onTagClick={handleTagClick}
        />
      </div>
    </div>
  );
}
