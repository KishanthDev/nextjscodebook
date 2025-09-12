// handleFallback.ts
import { getCollection } from "@/lib/mongodbHelper";
import { loadJson, saveJson } from "@/lib/jsonDb";
import { ObjectId } from "mongodb";

export interface Bot {
  _id: string;
  name: string;
  fallbackCount?: number;
  humanTakeover?: boolean;
}

export async function handleFallback(botId: string) {
  // Load JSON bots
  const bots = loadJson("data/bots.json");
  let bot = bots.find((b: Bot) => b._id === botId);

  if (bot) {
    if (!bot.humanTakeover) { // ✅ don’t increment once already true
      bot.fallbackCount = (bot.fallbackCount || 0) + 1;
      if (bot.fallbackCount > 6) {
        bot.humanTakeover = true;
      }
      saveJson("data/bots.json", bots);
    }
  } else {
    // MongoDB bot
    const collection = await getCollection("bots");
    const existing = await collection.findOne({ _id: new ObjectId(botId) });

    if (existing) {
      if (!existing.humanTakeover) { // ✅ don’t increment once already true
        const newCount = (existing.fallbackCount || 0) + 1;
        const humanTakeover = newCount > 6;
        await collection.updateOne(
          { _id: new ObjectId(botId) },
          { $set: { fallbackCount: newCount, humanTakeover } },
          { upsert: true }
        );
        bot = { ...existing, fallbackCount: newCount, humanTakeover };
      } else {
        bot = existing; // keep as is
      }
    }
  }

  return {
    type: bot?.humanTakeover ? "handover" : "message",
    text: bot?.humanTakeover
      ? "Multiple AI failures detected. Connecting you to a human agent 👤"
      : "Sorry, I am not yet trained for this data. Can you rephrase?",
  };
}
