import { ChatWidgetSettings, Message } from '@/types/Modifier';

type Props = {
  messages: Message[];
  settings: ChatWidgetSettings;
  isTyping?: boolean; 
};

export default function MessagesContainer({ messages, settings, isTyping }: Props) {
  return (
    <div
      id="messagesContainer"
      className="p-4 overflow-x-hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 10px;
          background-color: ${settings.botMsgBgColor || '#f3f4f6'};
          border-radius: 15px;
          max-width: 100px;
          height: 30px;
        }
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: #6b7280;
          border-radius: 50%;
          animation: jump 1.2s infinite;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes jump {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
      <div className="space-y-3">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
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
        {isTyping && (
          <div className="flex justify-start">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}