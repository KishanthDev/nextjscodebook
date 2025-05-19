import { ChatWidgetContactSettings, Message } from '@/types/Modifier';
import ChatHeader from './ChatHeader';
import MessagesContainer from './MessagesContainer';
import ContactForm from './ContactForm';
import ChatInputArea from './ChatInputArea';
import ChatFooter from './ChatFooter';

import React from 'react';

type Props = {
  settings: ChatWidgetContactSettings;
  messages: Message[];
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  onSendMessage: () => void;
  isSaving: boolean;
};

export default function ChatPreview({
  settings,
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
  isSaving,
}: Props) {
  return (
    <div className="flex-1 flex justify-center items-start">
      <div className="w-[370px] h-[700px] border rounded-lg overflow-hidden shadow-lg flex flex-col">
        <ChatHeader settings={settings} isSaving={isSaving} />

        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
          <div className="flex-1 overflow-y-auto">
            <MessagesContainer messages={messages} settings={settings} />
            <div className="border bg-gray-100">
              <ContactForm settings={settings} isSaving={isSaving} />
            </div>
          </div>

          <ChatInputArea
            settings={settings}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={onSendMessage}
            isSaving={isSaving}
          />
        </div>

        <ChatFooter settings={settings} />
      </div>
    </div>
  );
}
