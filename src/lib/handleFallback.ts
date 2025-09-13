import { getCollection } from "@/lib/mongodbHelper";
import { loadJson, saveJson } from "@/lib/jsonDb";
import { ObjectId } from "mongodb";
import path from "path";

const CONV_PATH = path.join(process.cwd(), "data", "conversations.json");

export async function handleFallback(botId: string, convId: string) {
  const isJsonBot = botId.startsWith("json-");

  if (isJsonBot) {
    const conversations = loadJson(CONV_PATH);
    const conv = conversations.find((c: any) => c._id === convId);

    if (conv) {
      if (!conv.humanTakeover) {
        conv.fallbackCount = (conv.fallbackCount || 0) + 1;
        if (conv.fallbackCount > 6) conv.humanTakeover = true;
        conv.updatedAt = new Date();
        saveJson(CONV_PATH, conversations);
      }
      return {
        type: conv.humanTakeover ? "handover" : "message",
        text: conv.humanTakeover
          ? "Multiple AI failures detected. Connecting you to a human agent 👤"
          : "Sorry, I am not yet trained for this data. Can you rephrase?",
      };
    }
  } else {
    const collection = await getCollection("conversations");
    const conv = await collection.findOne({
      _id: new ObjectId(convId),
      botId: new ObjectId(botId),
    });

    if (conv) {
      if (!conv.humanTakeover) {
        const newCount = (conv.fallbackCount || 0) + 1;
        const humanTakeover = newCount > 6;
        await collection.updateOne(
          { _id: conv._id },
          { $set: { fallbackCount: newCount, humanTakeover } },
          { upsert: true }
        );
        return {
          type: humanTakeover ? "handover" : "message",
          text: humanTakeover
            ? "Multiple AI failures detected. Connecting you to a human agent 👤"
            : "Sorry, I am not yet trained for this data. Can you rephrase?",
        };
      } else {
        return { type: "handover", text: "Conversation is under human takeover 👤" };
      }
    }
  }

  return { type: "message", text: "Sorry, I am not yet trained for this data. Can you rephrase?" };
}
