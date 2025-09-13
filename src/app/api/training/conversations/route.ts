import { getCollection } from "@/lib/mongodbHelper";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import path from "path";
import { loadJson } from "@/lib/jsonDb";

const CONV_PATH = path.join(process.cwd(), "data", "conversations.json");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const botId = searchParams.get("botId");
    if (!botId) return NextResponse.json({ error: "botId required" }, { status: 400 });

    const isJsonBot = botId.startsWith("json-");

    if (isJsonBot) {
      const conversations = loadJson(CONV_PATH);
      const filtered = conversations
        .filter((c: any) => c.botId === botId)
        .map((c: any) => ({
          _id: c._id,
          botId: c.botId,
          name: c.name,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        }));
      return NextResponse.json(filtered);
    } else {
      const collection = await getCollection("conversations");
      const conversations = await collection
        .find({ botId: new ObjectId(botId) })
        .project({ messages: 0 }) // exclude messages for list view
        .toArray();
      return NextResponse.json(conversations);
    }
  } catch (err: any) {
    console.error("Get conversations list error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
