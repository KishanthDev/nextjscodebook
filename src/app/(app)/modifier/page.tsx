import SettingsClient from "@/components/modifier/ModifierClient";
import clientPromise from "@/lib/mongodb"; // your MongoDB client
import data from "../../../../data/modifier.json";

export default async function ModifierPage() {
  const client = await clientPromise;
  const db = client.db("UiModifier");
  const collection = db.collection("settings");

  // fetch the settings document
  const settingsDoc = (await collection.findOne({})) as Partial<typeof data> || {};

  // merge db settings with fallback JSON
  const initialSettings = {
    eyeCatcher: settingsDoc?.eyeCatcher || data.eyeCatcher,
    bubble: settingsDoc?.bubble || data.bubble,
    chatBar: settingsDoc?.chatBar || data.chatBar,
    chatWidget: settingsDoc?.chatWidget || data.chatWidget,
    chatWidgetContact: settingsDoc?.chatWidgetContact || data.chatWidgetContact,
    greeting: settingsDoc?.greeting || data.greeting,
  };

  return (
    <SettingsClient
      eyecatcherdata={initialSettings.eyeCatcher}
      bubbledata={initialSettings.bubble}
      chatbardata={initialSettings.chatBar}
      chatwidgetdata={initialSettings.chatWidget}
      chatwidgetmessage={initialSettings.chatWidget.messages}
      chatwidgetcontact={initialSettings.chatWidgetContact}
      chatwidgetcontactmessage={initialSettings.chatWidgetContact.messages}
      greeting={initialSettings.greeting}
    />
  );
}
