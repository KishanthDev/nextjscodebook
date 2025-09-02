// lib/services/flowService.ts
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const FLOWS_PATH = path.join(process.cwd(), "data", "flows.json");
const BOTS_PATH = path.join(process.cwd(), "data", "bots.json");

// ---------- Helpers ----------
function loadJson(file: string) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
}
function saveJson(file: string, data: any) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
function isJsonBot(botId: string) {
  const bots = loadJson(BOTS_PATH);
  return bots.some((b: any) => b._id === botId);
}

// ---------- Service Class ----------
export class FlowService {
  static async formatFlow(data: any, withEmbedding = true) {
    let embedding: number[] = [];
    if (withEmbedding && data.title) {
      const emb = await openaiClient.embeddings.create({
        model: "text-embedding-3-small",
        input: data.title,
      });
      embedding = emb.data[0].embedding as number[];
    }

    return {
      botId: data.botId,
      flow_id: data.flow_id || `flow_${Date.now()}`,
      title: data.title,
      blocks: data.blocks || [],
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date(),
      embedding,
    };
  }

  // -------- GET --------
  static async getFlows(botId: string) {
    if (isJsonBot(botId)) {
      return loadJson(FLOWS_PATH).filter((f: any) => f.botId === botId);
    }
    const client = await clientPromise;
    const db = client.db("mydb");
    return db.collection("flows").find({ botId }).toArray();
  }

  // -------- CREATE --------
  static async createFlow(rawData: any) {
    const flow = await this.formatFlow(rawData, true);

    if (isJsonBot(rawData.botId)) {
      const flows = loadJson(FLOWS_PATH);
      const newFlow = { _id: Date.now().toString(), ...flow };
      flows.push(newFlow);
      saveJson(FLOWS_PATH, flows);
      return newFlow;
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const result = await db.collection("flows").insertOne(flow);
    return { _id: result.insertedId, ...flow };
  }

  // -------- UPDATE --------
  static async updateFlow(id: string, updateData: any) {
    const data = await this.formatFlow(updateData, true);

    if (isJsonBot(updateData.botId)) {
      const flows = loadJson(FLOWS_PATH);
      const idx = flows.findIndex((f: any) => f._id === id);
      if (idx === -1) return null;
      flows[idx] = { ...flows[idx], ...data, _id: id };
      saveJson(FLOWS_PATH, flows);
      return flows[idx];
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const result = await db
      .collection("flows")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data }, { returnDocument: "after" });

    return result?.value || null;
  }

  // -------- DELETE --------
  static async deleteFlow(id: string, botId: string) {
    if (isJsonBot(botId)) {
      const flows = loadJson(FLOWS_PATH);
      const updated = flows.filter((f: any) => f._id !== id);
      saveJson(FLOWS_PATH, updated);
      return updated.length < flows.length;
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const result = await db.collection("flows").deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}
