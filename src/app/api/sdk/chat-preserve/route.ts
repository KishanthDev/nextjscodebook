// src/app/api/get-completions/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { generateText, type ModelMessage } from "ai";
import { openai } from "@ai-sdk/openai";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("mydb");
const completions = db.collection("completions");

export async function POST(req: Request) {
  try {
    const messages: ModelMessage[] = await req.json();

    // Log incoming request
    console.log("📩 Incoming messages:", JSON.stringify(messages, null, 2));

    // Call OpenAI
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages,
    });

    // Log model response
    console.log("🤖 AI Response:", text);

    // Save to Mongo
    const result = await completions.insertOne({
      messages,
      response: text,
      createdAt: new Date(),
    });

    console.log("✅ Saved to Mongo:", result.insertedId);

    return NextResponse.json({ text });
  } catch (err) {
    console.error("❌ Error in /api/get-completions:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
