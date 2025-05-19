// File: src/app/(app)/chat-contact-preview/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { ChatWidgetContactSettings, Message } from '@/types/Modifier';
import { useSettingsStore } from '@/stores/settingsStore';
import ChatHeader from '@/components/modifier/chat-widget-contact/ChatHeader';
import MessagesContainer from '@/components/modifier/chat-widget-contact/MessagesContainer';
import ContactForm from '@/components/modifier/chat-widget-contact/ContactForm';
import ChatInputArea from '@/components/modifier/chat-widget-contact/ChatInputArea';
import ChatFooter from '@/components/modifier/chat-widget-contact/ChatFooter';

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hi, I have a question!', isUser: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const { settings, loading, fetchSettings } = useSettingsStore();

  useEffect(() => {
    setMounted(true);
    fetchSettings('chatWidgetContact', {} as ChatWidgetContactSettings); // Provide default settings if needed
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

  if (!mounted) return null;

  if (loading || !settings.chatWidgetContact) {
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
            <div className="flex">
              <Skeleton width="100%" height={40} borderRadius={8} />
            </div>
          </div>
          <div className="p-1 border-t">
            <Skeleton width={120} height={12} containerClassName="flex justify-center" />
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className="w-[370px] mx-auto mt-5 h-[700px] border rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-900 flex flex-col">
      <ChatHeader settings={settings.chatWidgetContact} isSaving={false} />
      <div className="flex-1 overflow-y-auto flex flex-col">
        <MessagesContainer messages={messages} settings={settings.chatWidgetContact} />
        <ContactForm settings={settings.chatWidgetContact} isSaving={isSaving} />
      </div>
      <ChatInputArea
        settings={settings.chatWidgetContact}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        isSaving={isSaving} onTyping={function (isTyping: boolean): void {
          throw new Error('Function not implemented.');
        } }      />
      <ChatFooter settings={settings.chatWidgetContact} />
    </div>
  );
}