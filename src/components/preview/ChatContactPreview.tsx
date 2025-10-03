'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSettingsStore } from '@/stores/settingsStore';
import { ChatWidgetContactSettings, Message } from '@/types/Modifier';
import ChatHeader from '@/components/modifier/chat-widget-contact/ChatHeader';
import MessagesContainer from '@/components/modifier/chat-widget-contact/MessagesContainer';
import ContactForm from '@/components/modifier/chat-widget-contact/ContactForm';
import ChatInputArea from '@/components/modifier/chat-widget-contact/ChatInputArea';
import ChatFooter from '@/components/modifier/chat-widget-contact/ChatFooter';

type Props = {
  defaultSettings: ChatWidgetContactSettings; // SSR-injected
};

export default function ChatWidgetContactPreview({ defaultSettings }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hi, I have a question!', isUser: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { resolvedTheme } = useTheme();
  const { settings, loading } = useSettingsStore();

  // mark mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // detect dark mode
  useEffect(() => {
    if (mounted) setIsDarkMode(resolvedTheme === 'dark');
  }, [mounted, resolvedTheme]);

  // Combine SSR defaults with Zustand store
  const contactSettings: ChatWidgetContactSettings = {
    ...defaultSettings,
    ...settings?.chatWidgetContact,
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [...prev, { text: newMessage, isUser: true }]);
    setNewMessage('');

    setTimeout(() => {
      const messagesContainer = document.getElementById('messagesContainer');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 10);
  };

  if (!mounted) return null;

  if (loading || !contactSettings) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="w-[370px] h-[700px] mx-auto mt-5 border rounded-lg overflow-hidden shadow-lg">
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
            <Skeleton width="100%" height={40} borderRadius={8} />
          </div>
          <div className="p-1 border-t">
            <Skeleton width={120} height={12} containerClassName="flex justify-center" />
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className="w-[370px] mx-auto mt-5 h-[700px] border rounded-lg shadow-lg bg-white dark:bg-gray-900 flex flex-col">
      {/* Fixed header */}
      <ChatHeader settings={contactSettings} isSaving={isSaving} />

      {/* Center scrollable area */}
      <div id="scrollArea" className="flex-1 overflow-y-auto p-2">
        {/* Messages */}
        <MessagesContainer messages={messages} settings={contactSettings} />

        {/* Contact form directly below messages */}
        <div className="mt-4 border-t pt-4">
          <ContactForm settings={contactSettings} isSaving={isSaving} />
        </div>
      </div>

      {/* Fixed input and footer */}
      <ChatInputArea
        settings={contactSettings}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        onTyping={setIsTyping}
        isSaving={isSaving}
      />
      <ChatFooter settings={contactSettings} />
    </div>
  );
}
