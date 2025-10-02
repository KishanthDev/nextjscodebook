import SettingsClient from "@/components/modifier/ModifierClient";
import data from "../../../../data/modifier.json";

export default function ModifierPage() {
  const eyecatcherdata = data.eyeCatcher;
  const bubbledata = data.bubble;
  const chatbardata = data.chatBar;
  const chatwidgetdata = data.chatWidget;
  const chatwidgetmessage = data.chatWidget.messages;
  const chatwidgetcontact = data.chatWidgetContact;
  const chatwidgetcontactmessage = data.chatWidgetContact.messages;
  const greeting = data.greeting;

  return (
    <SettingsClient
      eyecatcherdata={eyecatcherdata}
      bubbledata={bubbledata}
      chatbardata={chatbardata}
      chatwidgetdata={chatwidgetdata}
      chatwidgetmessage={chatwidgetmessage}
      chatwidgetcontact={chatwidgetcontact}
      chatwidgetcontactmessage={chatwidgetcontactmessage}
      greeting={greeting}
    />
  );
}
