import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { question, url } = await req.json();
    if (!question || !url)
      return NextResponse.json({ error: "URL and question required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("mydb");
    const collection = db.collection("websites");

    const site = await collection.findOne({ url });
    if (!site) return NextResponse.json({ error: "Website not found" }, { status: 404 });

    const { chunks } = site;

    // Keyword search to pick top 3 chunks related to question
    const questionWords = question.toLowerCase().split(" ");
    type ScoredChunk = { chunk: string; score: number };

    const scoredChunks: ScoredChunk[] = chunks.map((chunk: string) => {
      const chunkWords = chunk.toLowerCase().split(" ");
      const matches = questionWords.filter((word: string) => chunkWords.includes(word)).length;
      return { chunk, score: matches };
    });

    // Sort & pick top 3 chunks
    const topChunks = scoredChunks
      .sort((a: ScoredChunk, b: ScoredChunk) => b.score - a.score)
      .slice(0, 3)
      .map((c: ScoredChunk) => c.chunk)
      .join("\n\n");

    // Ask OpenAI to give a readable, conversational answer
    const prompt = `
You are an AI assistant. Only use information from this website content:
${topChunks}

Answer the user question in a friendly, conversational manner. 
Do not mention anything unrelated or other websites. 
User question: ${question}
    `;

    const answerResp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = answerResp.choices?.[0].message?.content ?? "No answer found.";
    return NextResponse.json({ answer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
