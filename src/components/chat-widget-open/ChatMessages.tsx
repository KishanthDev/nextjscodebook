'use client';
import { Message, ChatWidgetSettings } from '@/types/WidgetOpen';

type ChatMessagesProps = {
  messages: Message[];
  settings: ChatWidgetSettings;
};

export default function ChatMessages({ messages, settings }: ChatMessagesProps) {
    
  return (
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
                backgroundColor: message.isUser
                  ? settings.userMsgBgColor || '#fef08a'
                  : settings.botMsgBgColor || '#f3f4f6',
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}