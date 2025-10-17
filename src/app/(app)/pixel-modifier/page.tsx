import BubbleEditorClient from "./PageClient";

import bubbleDefaults from "@/defaults/bubble.json";
import chatBarDefaults from "@/defaults/chatbar.json";
import chatWidgetDefaults from "@/defaults/chatwidget.json";

async function getConfigs() {
  try {
    const res = await fetch(
      `https://zotlyadminapis-39lct.ondigitalocean.app/zotlyadmin/chatwidgets/list`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch configs");

    const data = await res.json();

    // ✅ Expect array; fallback to defaults if empty
    return Array.isArray(data) && data.length > 0 ? data : [{
      id: 0,
      bubblejson: bubbleDefaults,
      chatbarjson: chatBarDefaults,
      chatwidgetSettings: chatWidgetDefaults,
      chatwindowjson: {},
      customerId: 0,
      websiteId: 0,
    }];
  } catch (err) {
    console.warn("Fetching configs failed, using defaults:", (err as Error).message);
    return [{
      id: 0,
      bubblejson: bubbleDefaults,
      chatbarjson: chatBarDefaults,
      chatwidgetSettings: chatWidgetDefaults,
      chatwindowjson: {},
      customerId: 0,
      websiteId: 0,
    }];
  }
}

export default async function PageSSR() {
  const configs = await getConfigs();

  return (
    <div className="flex flex-col h-[calc(100vh-114px)] w-full mx-auto p-4">
      <BubbleEditorClient configs={configs} />
    </div>
  );
}
