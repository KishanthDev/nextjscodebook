'use client';

import { useState, useEffect } from 'react';
import Contact from '@/types/Contact';
import ContactData from '../../../data/Contact.json';
import ContactList from './ContactList';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ContactProfile from './ContactProfile';
import { useUserStatus } from '@/stores/useUserStatus';
import { useSettingsStore } from '@/stores/settingsStore';
import { ChatWidgetSettings } from '@/types/Modifier';
import ContactListSkeleton from './ContactListSkeleton';

export default function ChatUI() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const { acceptChats } = useUserStatus();
  const { settings, fetchSettings } = useSettingsStore();

  // Default settings
  const defaultSettings: ChatWidgetSettings = {
    chatTitle: 'LiveChat',
    logoUrl: 'https://via.placeholder.com/32',
    botMsgBgColor: '#f3f4f6',
    userMsgBgColor: '#fef08a',
    inputPlaceholder: 'Type a message...',
    sendBtnBgColor: '#000000',
    sendBtnIconColor: '#ffffff',
    footerText: 'Powered by LiveChat',
    footerBgColor: '#ffffff',
    footerTextColor: '#374151',
    messages: [{ text: 'Hi, I have a question!', isUser: true }],
  };

  useEffect(() => {
    fetchSettings('chatWidget', defaultSettings);
  }, [fetchSettings]);

  const chatWidgetSettings: ChatWidgetSettings = {
    ...defaultSettings,
    ...settings.chatWidget,
  };

  const sampleContacts: Contact[] = ContactData.map((contact) => ({
    ...contact,
    status: contact.status as 'online' | 'offline',
  }));

  const [messages, setMessages] = useState<{ fromUser: boolean; text: string }[]>([
    { fromUser: false, text: 'Hi!' },
    { fromUser: false, text: 'Sure thing! I\'m gonna call you in 5, is it okay?' },
    { fromUser: true, text: 'Awesome! Call me in 5 minutes..' },
    { fromUser: true, text: '👍🏻' },
    { fromUser: false, text: 'Great, talk soon!' },
    { fromUser: true, text: 'Hey, just checking — are we still on for tomorrow?' },
    { fromUser: false, text: 'Yes, absolutely! Looking forward to it.' },
    { fromUser: true, text: 'Perfect! Also, did you get a chance to look at the report?' },
    { fromUser: false, text: 'Not yet, I’ll review it tonight and send feedback.' },
    { fromUser: true, text: 'Cool, no rush. Let me know if you have questions.' },
    { fromUser: false, text: 'Thanks! Appreciate it.' },
    { fromUser: true, text: 'BTW, check out this meme 😂' },
    { fromUser: false, text: 'Haha, that’s hilarious!' },
    { fromUser: false, text: 'You always send the best ones.' },
    { fromUser: true, text: '😎' },
  ]);

  const userStatus = acceptChats ? 'online' : 'offline';

  const handleSendMessage = (text: string) => {
    setMessages((prev) => [...prev, { fromUser: true, text }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { fromUser: false, text: 'Got it! I\'ll reply soon.' },
      ]);
    }, 1000);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingContacts(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-[calc(100vh-3.3rem)] border border-gray-300 bg-white text-black transition-colors dark:border-gray-700 dark:bg-zinc-900 dark:text-white">
      {/* Left Sidebar - Fixed 30% */}
      <div className="w-[30%] min-w-[30%] max-w-[30%] border-r border-gray-300 dark:border-gray-700">
        {isLoadingContacts ? (
          <ContactListSkeleton />
        ) : (
          <ContactList
            contacts={sampleContacts}
            selectedContact={selectedContact}
            onSelect={setSelectedContact}
            userStatus={userStatus}
          />
        )}
      </div>

      {/* Chat Area - Dynamic width */}
      <div
        className={`flex flex-col min-h-0 transition-all duration-300 ${
          profileExpanded ? 'w-[40%]' : 'w-[70%]'
        }`}
      >
        <ChatHeader contact={selectedContact} />
        <ChatMessages
          selected={!!selectedContact}
          messages={messages}
          settings={chatWidgetSettings}
        />
        {selectedContact && (
          <ChatInput
            settings={chatWidgetSettings}
            onSend={handleSendMessage}
            onEmojiClick={() => alert('Emoji picker not implemented yet')}
            onAttachmentClick={() => alert('Attachment upload not implemented yet')}
          />
        )}
      </div>

      {/* Right Sidebar - Contact Profile */}
      <div
        className={`transition-all duration-300 ${
          profileExpanded ? 'w-[30%]' : 'w-12'
        } border-l border-gray-300 dark:border-gray-700`}
      >
        <ContactProfile
          contact={selectedContact}
          expanded={profileExpanded}
          setExpanded={setProfileExpanded}
        />
      </div>
    </div>
  );
}