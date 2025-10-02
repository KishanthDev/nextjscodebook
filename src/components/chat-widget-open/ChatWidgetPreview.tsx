'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSettingsStore } from '@/stores/settingsStore';
import { ChatWidgetSettings, Message } from '@/types/Modifier';
import ChatPreview from '../modifier/chat-widget/ChatPreview';

type Props = {
  defaultSettings: ChatWidgetSettings; // SSR-injected
};

export default function ChatWidgetPreview({ defaultSettings }: Props) {
  const { settings, loading } = useSettingsStore();
  const [previewMessages, setPreviewMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { resolvedTheme } = useTheme();
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  // mark mounted to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  // detect dark mode
  useEffect(() => {
    if (mounted) setIsDarkMode(resolvedTheme === 'dark');
  }, [mounted, resolvedTheme]);

  // initialize previewMessages from SSR or store
  useEffect(() => {
    const messagesFromStore = settings?.chatWidget?.messages;
    if (Array.isArray(messagesFromStore) && messagesFromStore.length > 0) {
      setPreviewMessages(messagesFromStore);
    } else {
      setPreviewMessages([
        {
          text: 'What would you like to do?',
          isUser: false,
          tags: ['View Products', 'Support', 'Pricing'],
        },
      ]);
    }
  }, [settings, defaultSettings]);

  const chatSettings: ChatWidgetSettings = {
    ...defaultSettings,
    ...settings?.chatWidget,
    messages: previewMessages,
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = { text: newMessage, isUser: true };
    setPreviewMessages((prev) => [...prev, newMsg]);
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
    ]);
  };

  const toggleSounds = () => setSoundsEnabled((prev) => !prev);

  if (!mounted) return null;

  if (loading || !chatSettings) {
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
