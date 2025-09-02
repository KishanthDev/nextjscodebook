// app/api/training/flows/route.ts
import { NextRequest, NextResponse } from "next/server";
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

// --- Format Flow (attach embedding) ---
async function formatFlow(data: any, withEmbedding = true) {
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

// --- GET (list flows by botId) ---
export async function GET(req: NextRequest) {
  try {
    const botId = req.nextUrl.searchParams.get("botId");
    if (!botId) {
      return NextResponse.json({ error: "Missing botId" }, { status: 400 });
    }

    if (isJsonBot(botId)) {
      const flows = loadJson(FLOWS_PATH).filter((f: any) => f.botId === botId);
      return NextResponse.json(flows);
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const flows = await db.collection("flows").find({ botId }).toArray();
    return NextResponse.json(flows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- POST (create flow) ---
export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    if (!rawData.botId) {
      return NextResponse.json({ error: "Missing botId" }, { status: 400 });
    }

    const flow = await formatFlow(rawData, true);

    if (isJsonBot(rawData.botId)) {
      const flows = loadJson(FLOWS_PATH);
      const newFlow = { _id: Date.now().toString(), ...flow };
      flows.push(newFlow);
      saveJson(FLOWS_PATH, flows);
      return NextResponse.json(newFlow);
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const result = await db.collection("flows").insertOne(flow);
    return NextResponse.json({ _id: result.insertedId, ...flow });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- PUT (update flow) ---
export async function PUT(req: NextRequest) {
  try {
    const { id, ...updateData } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing flow ID" }, { status: 400 });
    }

    const data = await formatFlow(updateData, true);

    if (isJsonBot(updateData.botId)) {
      let flows = loadJson(FLOWS_PATH);
      const idx = flows.findIndex((f: any) => f._id === id);
      if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
      flows[idx] = { ...flows[idx], ...data, _id: id };
      saveJson(FLOWS_PATH, flows);
      return NextResponse.json(flows[idx]);
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const result = await db
      .collection("flows")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data }, { returnDocument: "after" });

    return NextResponse.json(result?.value || {});
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- DELETE (remove flow) ---
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const botId = req.nextUrl.searchParams.get("botId");

    if (!id || !botId) {
      return NextResponse.json({ error: "Missing flow ID or botId" }, { status: 400 });
    }

    if (isJsonBot(botId)) {
      let flows = loadJson(FLOWS_PATH);
      const updated = flows.filter((f: any) => f._id !== id);
      saveJson(FLOWS_PATH, updated);
      return NextResponse.json({ success: updated.length < flows.length });
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const result = await db.collection("flows").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: result.deletedCount > 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
