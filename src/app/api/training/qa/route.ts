import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import clientPromise from "@/lib/mongodb";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db("mydb");

    await db.collection("qa_pairs").updateOne(
      { botId, question }, // 👈 match bot + question
      {
        $set: {
          botId,
          question,
          answer,
          embedding,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
