import { ChatWidgetSettings } from '@/types/Modifier';

type Props = {
  settings: ChatWidgetSettings;
};

export default function ChatFooter({ settings }: Props) {
  return (
    <div
      className="p-1 text-center text-xs border-t"
      style={{
        backgroundColor: settings.footerBgColor,
        color: settings.footerTextColor,
      }}
    >
      {settings.footerText}
    </div>
  );
}