'use client';

import { useState, useEffect } from 'react';
import data from '../../../../data/modifier.json';

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
};



export default function ChatWidgetPreview() {
  const [settings, setSettings] = useState<ChatWidgetSettings | null>(null);
  const [messages, setMessages] = useState<Message[]>(data.chatwidgetopen.messages);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chatWidgetSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error parsing localStorage settings:', error);
        setSettings({
          botMsgBgColor: '#f3f4f6',
          userMsgBgColor: '#fef08a',
          sendBtnBgColor: '#000000',
          sendBtnIconColor: '#ffffff',
          footerBgColor: '#ffffff',
          footerTextColor: '#374151',
        });
      }
    } else {
      setSettings({
        botMsgBgColor: '#f3f4f6',
        userMsgBgColor: '#fef08a',
        sendBtnBgColor: '#000000',
        sendBtnIconColor: '#ffffff',
        footerBgColor: '#ffffff',
        footerTextColor: '#374151',
      });
    }
  }, []);

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

  const handleSoundsToggle = () => {
    setSoundsEnabled((prev) => !prev);
  };

  // Avoid rendering until settings are initialized (hydration-safe)
  if (!settings) return null;

  return (
    <div className="flex justify-center items-start p-6">
      <div className="w-[370px] h-[700px] border rounded-lg overflow-hidden shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-3 border-b flex justify-between items-center bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center gap-2">
              <img
                src="https://res.cloudinary.com/dfbqxsiud/image/upload/v1720047961/users/663e7a3a159e95e303d68afb/ChatMatrix/66415c89d553dbb92bacbbf4/profile_picture.png"
                alt="LiveChat Logo"
                className="w-8 h-8 rounded-full border"
              />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">LiveChat</span>
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

        {/* Messages */}
        <div
          id="messagesContainer"
          className="p-4 flex-1 overflow-y-auto bg-white dark:bg-gray-900"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs ${message.isUser ? 'rounded-br-none' : 'rounded-bl-none'}`}
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

        {/* Input Area */}
        <div className="p-3 border-t relative bg-white dark:bg-gray-800">
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <div className="absolute right-5 top-1/2 transform -translate-y-1/2 flex gap-1">
              <button
                className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
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
              <button className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
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
                disabled={!newMessage.trim()}
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
          Powered by LiveChat
        </div>
      </div>
    </div>
  );
}