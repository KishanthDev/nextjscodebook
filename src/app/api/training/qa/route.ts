import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import clientPromise from "@/lib/mongodb";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// JSON storage paths
const BOTS_PATH = path.join(process.cwd(), "data", "bots.json");
const QA_PATH = path.join(process.cwd(), "data", "qa_pairs.json");

// Helpers for JSON read/write
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

export async function POST(req: Request) {
  try {
    const { botId, question, answer } = await req.json();
    if (!botId || !question || !answer) {
      return NextResponse.json(
        { error: "Bot ID, question, and answer are required." },
        { status: 400 }
      );
    }

    // Get embedding
    const embeddingResult = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const embedding = embeddingResult.data[0].embedding as number[];

    // --- Step 1: Check if bot is in JSON ---
    const bots = loadJson(BOTS_PATH);
    const bot = bots.find((b: any) => b._id === botId);

    if (bot) {
      // Save QA in JSON
      let qaPairs = loadJson(QA_PATH);

      // If question already exists, update
      const existingIndex = qaPairs.findIndex(
        (q: any) => q.botId === botId && q.question === question
      );
      if (existingIndex >= 0) {
        qaPairs[existingIndex] = {
          ...qaPairs[existingIndex],
          answer,
          embedding,
          updatedAt: new Date().toISOString(),
        };
      } else {
        qaPairs.push({
          botId,
          question,
          answer,
          embedding,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      saveJson(QA_PATH, qaPairs);
      return NextResponse.json({ success: true, storage: "json" });
    }

    // --- Step 2: Otherwise, store in MongoDB ---
    const client = await clientPromise;
    const db = client.db("mydb");

    await db.collection("qa_pairs").updateOne(
      { botId, question },
      {
        $set: { botId, question, answer, embedding, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, storage: "mongo" });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
