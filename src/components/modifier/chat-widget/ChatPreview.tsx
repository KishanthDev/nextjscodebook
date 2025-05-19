import { ChatWidgetSettings, Message } from '@/types/Modifier';
import ChatHeader from './ChatHeader';
import MessagesContainer from './MessagesContainer';
import ChatInputArea from './ChatInputArea';
import ChatFooter from './ChatFooter';

type Props = {
  settings: ChatWidgetSettings;
  messages: Message[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: () => void;
  isSaving: boolean;
};

export default function ChatPreview({ settings, messages, newMessage, setNewMessage, onSendMessage, isSaving }: Props) {
  return (
    <div className="flex-1 flex justify-center items-start">
      <div className="w-[370px] h-[700px] border rounded-lg overflow-hidden shadow-lg flex flex-col">
        <ChatHeader settings={settings} isSaving={isSaving} />
        <MessagesContainer messages={messages} settings={settings} />
        <ChatInputArea
          settings={settings}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={onSendMessage}
          isSaving={isSaving}
        />
        <ChatFooter settings={settings} />
      </div>
    </div>
  );
}