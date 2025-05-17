'use client';
import { useState } from 'react';
import { ChatWidgetSettings } from '@/types/WidgetOpen';

type ChatHeaderProps = {
  settings: ChatWidgetSettings;
  soundsEnabled: boolean;
  toggleSounds: () => void;
};

export default function ChatHeader({ settings, soundsEnabled, toggleSounds }: ChatHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="p-3 border-b flex justify-between items-center bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <img
          src={settings.logoUrl}
          alt={`${settings.chatTitle} Logo`}
          className="w-8 h-8 rounded-full border"
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/32')}
        />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{settings.chatTitle}</span>
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

        <div className="relative">
          <button
            className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => alert('Send transcript clicked')}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current" aria-hidden="true">
                    <path d="M5.5,6l6.5,5.7L18.5,6H5.5z M20,7.3l-7.3,6.4c-0.4,0.3-0.9,0.3-1.3,0L4,7.3V17c0,0.6,0.4,1,1,1h14 c0.6,0,1-0.4,1-1V7.3z M5,4h14c1.7,0,3,1.3,3,3v10c0,1.7-1.3,3-3,3H5c-1.7,0-3-1.3-3-3V7C2,5.3,3.3,4,5,4z" />
                  </svg>
                  Send transcript
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => alert('Move chat to mobile clicked')}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current" aria-hidden="true">
                    <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16zm-5-3c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
                  </svg>
                  Move chat to mobile
                </button>
                <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex items-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current" aria-hidden="true">
                      <path d="M15,19v-2c2.8,0,5-2.2,5-5s-2.2-5-5-5V5c3.9,0,7,3.1,7,7S18.9,19,15,19z M15,16v-2c1.1,0,2-0.9,2-2s-0.9-2-2-2 V8c2.2,0,4,1.8,4,4S17.2,16,15,16z M7,8l4.3-3.7C11.9,3.7,13,4.1,13,5v14c0,0.9-1.1,1.3-1.7,0.7L7.2,16H4c-0.6,0-1-0.4-1-1V9 c0-0.6,0.4-1,1-1H7z M11,7.4L8.3,9.7C8.1,9.9,7.9,10,7.6,10H5v4h2.6c0.3,0,0.5,0.1,0.7,0.3l2.7,2.3V7.4z" />
                    </svg>
                    Sounds
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soundsEnabled}
                      onChange={toggleSounds}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

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
  );
}