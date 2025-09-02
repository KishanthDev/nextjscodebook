// lib/services/BotService.ts
import clientPromise from "@/lib/mongodb";
import fs from "fs";
import path from "path";

const COLLECTION = "bots";
const memoryFile = path.join(process.cwd(), "data/bots.json");

export class BotService {
  // 🔹 Load bots from JSON file
  private static loadMemoryBots() {
    if (!fs.existsSync(memoryFile)) return [];
    return JSON.parse(fs.readFileSync(memoryFile, "utf-8"));
  }

  // 🔹 Save bots to JSON file
  private static saveMemoryBots(bots: any[]) {
    fs.writeFileSync(memoryFile, JSON.stringify(bots, null, 2));
  }

  // 🔹 Create bot
  static async createBot(body: any) {
    if (!body.name) throw new Error("Bot name required");

    if (!body.useMongo) {
      const bots = this.loadMemoryBots();
      const newBot = { _id: `mem_${Date.now()}`, ...body };
      bots.push(newBot);
      this.saveMemoryBots(bots);
      return newBot;
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const result = await db.collection(COLLECTION).insertOne(body);
    return { _id: result.insertedId, ...body };
  }

  // 🔹 Get all bots
  static async getBots() {
    const memoryBots = this.loadMemoryBots();

    const client = await clientPromise;
    const db = client.db("mydb");
    const mongoBots = await db.collection(COLLECTION).find({}).toArray();

    return [...memoryBots, ...mongoBots];
  }
}
