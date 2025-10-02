'use client';

import { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import Loader from '@/components/loader/Loader';
import { useSettingsStore } from '@/stores/settingsStore';
import { ChatWidgetContactSettings, Message } from '@/types/Modifier';
import SettingsInput from './SettingsInput';
import ChatPreview from './ChatPreview';

type Props = {
  defaultSettings: ChatWidgetContactSettings;
  initialMessages: Message[];
};

const INPUT_FIELDS = [
  { label: 'Chat Title', name: 'chatTitle', placeholder: 'LiveChat', maxLength: 20 },
  { label: 'Form Title', name: 'formTitle', placeholder: 'Contact Us', maxLength: 30 },
  { label: 'Form Message 1', name: 'formMessage1', placeholder: 'Please fill in the form we will reach out', maxLength: 100 },
  { label: 'Form Message 2', name: 'formMessage2', placeholder: 'We are sorry our chat experts are busy right now', maxLength: 100 },
  { label: 'Logo URL', name: 'logoUrl', placeholder: 'https://example.com/logo.png' },
  { label: 'Bot Message Background Color', name: 'botMsgBgColor', placeholder: '#f3f4f6', isColor: true },
  { label: 'User Message Background Color', name: 'userMsgBgColor', placeholder: '#fef08a', isColor: true },
  { label: 'Input Placeholder', name: 'inputPlaceholder', placeholder: 'Type a message...' },
  { label: 'Send Button Background Color', name: 'sendBtnBgColor', placeholder: '#000000', isColor: true },
  { label: 'Send Button Icon Color', name: 'sendBtnIconColor', placeholder: '#ffffff', isColor: true },
  { label: 'Footer Text', name: 'footerText', placeholder: 'Powered by LiveChat' },
  { label: 'Footer Background Color', name: 'footerBgColor', placeholder: '#ffffff', isColor: true },
  { label: 'Footer Text Color', name: 'footerTextColor', placeholder: '#374151', isColor: true },
  { label: 'Submit Button Background Color', name: 'submitBtnBgColor', placeholder: '#3b82f6', isColor: true },
  { label: 'Submit Button Font Color', name: 'submitBtnFontColor', placeholder: '#ffffff', isColor: true },
  { label: 'Form Background Color', name: 'formBgColor', placeholder: '#ffffff', isColor: true },
  { label: 'Submit Button Text', name: 'submitBtnText', placeholder: 'Submit', maxLength: 20 },
  { label: 'Submit Button Submitted Text', name: 'submitBtnSubmittedText', placeholder: 'Submitted!', maxLength: 20 },
];

export default function ChatWidgetContactComponent({ defaultSettings, initialMessages }: Props) {
  const { resolvedTheme } = useTheme();
  const { settings, loading, updateSettings } = useSettingsStore();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  const [localSettings, setLocalSettings] = useState<ChatWidgetContactSettings>(defaultSettings);
  const [messages, setMessages] = useState<Message[]>(initialMessages.length > 0 ? initialMessages : [
    { text: 'Hi, I have a question!', isUser: true },
    { text: 'How can I assist you?', isUser: false }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // ✅ Mount for hydration
  useEffect(() => setMounted(true), []);

  // ✅ Dark mode
  useEffect(() => {
    if (mounted) setIsDarkMode(resolvedTheme === 'dark');
  }, [mounted, resolvedTheme]);

  // ✅ Sync store to localSettings if no local changes
  useEffect(() => {
    if (settings?.chatWidgetContact && !hasLocalChanges) {
      setLocalSettings(settings.chatWidgetContact as ChatWidgetContactSettings);
    }
  }, [settings, hasLocalChanges]);

  const handleInputChange = (fieldName: keyof ChatWidgetContactSettings, value: string) => {
    setLocalSettings((prev) => ({ ...prev, [fieldName]: value }));
    setHasLocalChanges(true);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    setMessages((prev) => [...prev, { text: newMessage, isUser: true }]);
    setNewMessage('');
    setTimeout(() => {
      const messagesContainer = document.getElementById('messagesContainer');
      if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 10);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings('chatWidgetContact', localSettings);
      setHasLocalChanges(false);
      toast.success('Settings saved!');
    } catch (err) {
      toast.error('Error saving settings');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <SkeletonTheme baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'} highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10">
          <Skeleton width={240} height={32} />
            <Skeleton width={80} height={40} borderRadius={6} />
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4 pr-4 border-r border-gray-300 dark:border-gray-700">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton width={180} height={16} />
                  <div className="flex items-center">
                    <Skeleton width="100%" height={40} borderRadius={6} containerClassName="flex-1" />
                    {i < 8 && <Skeleton width={48} height={40} borderRadius={0} />}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 flex justify-center items-start">
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
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className="relative p-6 max-w-4xl mx-auto">
      {isSaving && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}
      <div className={isSaving ? 'blur-sm' : ''}>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">Chat Widget Contact Customization</h2>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={isSaving}
          >
            Save
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4 border-r pr-4">
            {INPUT_FIELDS.map((field) => (
              <SettingsInput
                key={field.name}
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                isColor={field.isColor}
                value={(localSettings[field.name as keyof ChatWidgetContactSettings] as string) ?? ''}
                onChange={(value) => handleInputChange(field.name as keyof ChatWidgetContactSettings, value)}
                disabled={isSaving}
              />
            ))}
          </div>
          <ChatPreview
            settings={localSettings}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
