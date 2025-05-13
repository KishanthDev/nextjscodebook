'use client';

import { useState, useEffect } from 'react';

type EyecatcherSettings = {
  title: string;
  text: string;
  bgColor: string;
  textColor: string;
};

export default function EyecatcherPreview() {
  const [settings, setSettings] = useState<EyecatcherSettings | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('eyecatcherSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error parsing localStorage settings:', error);
        setSettings({
          title: 'Hello',
          text: 'Click to chat with us',
          bgColor: '#007bff',
          textColor: '#ffffff',
        });
      }
    } else {
      setSettings({
        title: 'Hello',
        text: 'Click to chat with us',
        bgColor: '#007bff',
        textColor: '#ffffff',
      });
    }
  }, []);

  if (!settings) return <p className="p-4 text-gray-500">Loading...</p>;

  return (
    <div className="flex justify-center items-start p-6">
      <div
        className="flex w-[13rem] p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md"
        style={{
          backgroundColor: settings.bgColor,
          color: settings.textColor,
        }}
      >
        {/* Emoji on the left */}
        <span className="text-3xl animate-wave flex-shrink-0 mr-3" style={{ animationDuration: '1.5s' }}>
          👋
        </span>

        {/* Text on the right */}
        <div className="flex flex-col min-w-0">
          <h3 className="font-bold text-sm leading-tight break-words">{settings.title}</h3>
          <p className="text-xs break-words whitespace-normal">{settings.text}</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          10% {
            transform: rotate(14deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          30% {
            transform: rotate(14deg);
          }
          40% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(10deg);
          }
          60% {
            transform: rotate(0deg);
          }
        }
        .animate-wave {
          display: inline-block;
          animation: wave 1.5s infinite;
          transform-origin: 70% 70%;
        }
      `}</style>
    </div>
  );
}