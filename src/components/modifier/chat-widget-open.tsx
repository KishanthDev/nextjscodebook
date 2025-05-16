'use client';
import { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import Loader from '../loader/Loader';

type Message = {
  text: string;
  isUser: boolean;
};

type ChatWidgetSettings = {
  botMsgBgColor: string;
  userMsgBgColor: string;
  sendBtnBgColor: string;
  sendBtnIconColor: string;
  footerBgColor: string;
  footerTextColor: string;
  footerText: string;
  inputPlaceholder: string;
  logoUrl: string;
  chatTitle: string;
};

type Props = {
  defaultSettings: ChatWidgetSettings;
  initialMessages: Message[];
};

export default function ChatWidgetOpenComponent({ defaultSettings, initialMessages }: Props) {
  const [settings, setSettings] = useState<ChatWidgetSettings>(defaultSettings);
  const [messages, setMessages] = useState<Message[]>(initialMessages.length > 0 ? initialMessages : [{ text: "Hi, I have a question!", isUser: true }]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsDarkMode(resolvedTheme === 'dark');
    }
  }, [mounted, resolvedTheme]);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings?section=chatWidget');
        if (res.ok) {
          const json = await res.json();
          if (json.settings) {
            setSettings({ ...defaultSettings, ...json.settings });
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [defaultSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    setMessages((prev) => [
      ...prev,
      { text: newMessage, isUser: true },
    ]);
    setNewMessage('');
    setTimeout(() => {
      const messagesContainer = document.getElementById('messagesContainer');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 10);
  };

  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'chatWidget', data: settings }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Settings saved!');
      } else {
        toast.error('Failed to save settings: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Error saving settings');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSoundsToggle = () => {
    setSoundsEnabled((prev) => !prev);
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <Skeleton width={240} height={32} />
            <Skeleton width={80} height={40} borderRadius={6} />
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4 pr-4 border-r border-gray-300 dark:border-gray-700">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton width={180} height={16} />
                  <div className="flex items-center">
                    <Skeleton width="100%" height={40} borderRadius={6} containerClassName="flex-1" />
                    {i < 6 && <Skeleton width={48} height={40} borderRadius={0} />}
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
          <h2 className="text-2xl font-bold">Chat Widget Customization</h2>
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
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Company Name:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="chatTitle"
                  placeholder="LiveChat"
                  maxLength={20}
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={settings.chatTitle}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Logo URL:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="logoUrl"
                  placeholder="https://example.com/logo.png"
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={settings.logoUrl}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Input Placeholder:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="inputPlaceholder"
                  placeholder="Type a message..."
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={settings.inputPlaceholder}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Footer Text:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="footerText"
                  placeholder="Powered by LiveChat"
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={settings.footerText}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Bot Message Background Color:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="botMsgBgColor"
                  placeholder="#f3f4f6"
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={settings.botMsgBgColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <input
                  type="color"
                  name="botMsgBgColor"
                  className="w-12 h-12 cursor-pointer border-l"
                  value={settings.botMsgBgColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">User Message Background Color:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="userMsgBgColor"
                  placeholder="#fef08a"
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={settings.userMsgBgColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <input
                  type="color"
                  name="userMsgBgColor"
                  className="w-12 h-12 cursor-pointer border-l"
                  value={settings.userMsgBgColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Send Button Background Color:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="sendBtnBgColor"
                  placeholder="#000000"
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={settings.sendBtnBgColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <input
                  type="color"
                  name="sendBtnBgColor"
                  className="w-12 h-12 cursor-pointer border-l"
                  value={settings.sendBtnBgColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Send Button Icon Color:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="sendBtnIconColor"
                  placeholder="#ffffff"
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={settings.sendBtnIconColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <input
                  type="color"
                  name="sendBtnIconColor"
                  className="w-12 h-12 cursor-pointer border-l"
                  value={settings.sendBtnIconColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Footer Background Color:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="footerBgColor"
                  placeholder="#ffffff"
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={settings.footerBgColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <input
                  type="color"
                  name="footerBgColor"
                  className="w-12 h-12 cursor-pointer border-l"
                  value={settings.footerBgColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Footer Text Color:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  name="footerTextColor"
                  placeholder="#374151"
                  className="w-full px-2 py-2 text-sm focus:outline-none"
                  value={settings.footerTextColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
                <input
                  type="color"
                  name="footerTextColor"
                  className="w-12 h-12 cursor-pointer border-l"
                  value={settings.footerTextColor}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-start">
            <div className="w-[370px] h-[700px] border rounded-lg overflow-hidden shadow-lg flex flex-col">
              <div className="p-3 border-b flex justify-between items-center bg-white dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center gap-2">
                    <img
                      src={settings.logoUrl}
                      alt={`${settings.chatTitle} Logo`}
                      className="w-8 h-8 rounded-full border"
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/32')}
                    />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{settings.chatTitle}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <button
                    className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 relative"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>

                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => alert('Send transcript clicked')}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-5 w-5 mr-2 fill-current"
                              aria-hidden="true"
                            >
                              <path d="M5.5,6l6.5,5.7L18.5,6H5.5z M20,7.3l-7.3,6.4c-0.4,0.3-0.9,0.3-1.3,0L4,7.3V17c0,0.6,0.4,1,1,1h14 c0.6,0,1-0.4,1-1V7.3z M5,4h14c1.7,0,3,1.3,3,3v10c0,1.7-1.3,3-3,3H5c-1.7,0-3-1.3-3-3V7C2,5.3,3.3,4,5,4z" />
                            </svg>
                            Send transcript
                          </button>
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => alert('Move chat to mobile clicked')}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-5 w-5 mr-2 fill-current"
                              aria-hidden="true"
                            >
                              <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16zm-5-3c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
                            </svg>
                            Move chat to mobile
                          </button>
                          <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="flex items-center">
                              <svg
                                viewBox="0 0 24 24"
                                className="h-5 w-5 mr-2 fill-current"
                                aria-hidden="true"
                              >
                                <path d="M15,19v-2c2.8,0,5-2.2,5-5s-2.2-5-5-5V5c3.9,0,7,3.1,7,7S18.9,19,15,19z M15,16v-2c1.1,0,2-0.9,2-2s-0.9-2-2-2 V8c2.2,0,4,1.8,4,4S17.2,16,15,16z M7,8l4.3-3.7C11.9,3.7,13,4.1,13,5v14c0,0.9-1.1,1.3-1.7,0.7L7.2,16H4c-0.6,0-1-0.4-1-1V9 c0-0.6,0.4-1,1-1H7z M11,7.4L8.3,9.7C8.1,9.9,7.9,10,7.6,10H5v4h2.6c0.3,0,0.5,0.1,0.7,0.3l2.7,2.3V7.4z" />
                              </svg>
                              Sounds
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={soundsEnabled}
                                onChange={handleSoundsToggle}
                                className="sr-only peer"
                                disabled={isSaving}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>

                  <button className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                id="messagesContainer"
                className="p-4 flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-900"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`px-3 py-2 rounded-lg max-w-xs break-all whitespace-normal ${message.isUser ? 'rounded-br-none' : 'rounded-bl-none'}`}
                        style={{
                          backgroundColor: message.isUser ? settings.userMsgBgColor : settings.botMsgBgColor,
                        }}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 border-t relative bg-white dark:bg-gray-800">
                <div className="flex items-center relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={settings.inputPlaceholder}
                    className="flex-1 max-w-full border rounded-lg px-3 py-2 pr-24 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isSaving}
                  />
                  <div className="absolute right-2 flex gap-1">
                    <button
                      className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      disabled={isSaving}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                      disabled={isSaving}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                    </button>
                    <button
                      className={`p-1 rounded-lg ${newMessage.trim() ? 'bg-black text-white' : 'text-gray-400'}`}
                      style={{
                        backgroundColor: settings.sendBtnBgColor,
                        color: settings.sendBtnIconColor,
                      }}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSaving}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {showEmojiPicker && (
                  <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1">
                    {['😊', '👍', '❤️', '😂', '😢', '😎', '🤔', '👋', '🎉', '💯', '🔥', '🚀'].map((emoji) => (
                      <button
                        key={emoji}
                        className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"
                        onClick={() => addEmoji(emoji)}
                        disabled={isSaving}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
        </div>
      </div>
    </div>
  );
}
