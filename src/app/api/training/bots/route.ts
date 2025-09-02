import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import fs from "fs";
import path from "path";

const COLLECTION = "bots";
const memoryFile = path.join(process.cwd(), "data/bots.json");

// Helper to load/save bots
function loadMemoryBots() {
  if (!fs.existsSync(memoryFile)) return [];
  return JSON.parse(fs.readFileSync(memoryFile, "utf-8"));
}

function saveMemoryBots(bots: any[]) {
  fs.writeFileSync(memoryFile, JSON.stringify(bots, null, 2));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Bot name required" }, { status: 400 });
    }

    // 🔹 In-Memory JSON mode
    if (!body.useMongo) {
      const bots = loadMemoryBots();
      const newBot = { _id: `mem_${Date.now()}`, ...body };
      bots.push(newBot);
      saveMemoryBots(bots);
      return NextResponse.json(newBot, { status: 201 });
    }

    // 🔹 MongoDB mode
    const client = await clientPromise;
    const db = client.db("mydb");
    const result = await db.collection(COLLECTION).insertOne(body);

    return NextResponse.json({ _id: result.insertedId, ...body }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const memoryBots = loadMemoryBots();

    const client = await clientPromise;
    const db = client.db("mydb");
    const mongoBots = await db.collection(COLLECTION).find({}).toArray();

    return NextResponse.json([...memoryBots, ...mongoBots]);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
