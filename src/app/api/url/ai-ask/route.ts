import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const TOP_K = 3;

export async function POST(req: Request) {
  try {
    const { question, url } = await req.json();
    if (!question || !url) return NextResponse.json({ error: "URL and question required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("mydb");
    const site = await db.collection("websites").findOne({ url });
    if (!site) return NextResponse.json({ error: "Website not found" }, { status: 404 });

    const chunks: { chunk: string; embedding: number[] }[] = site.chunks;

    // Generate embedding for question
    const qEmbResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const qEmbedding = qEmbResp.data[0].embedding;

    // Cosine similarity function
    const cosineSim = (a: number[], b: number[]) => {
      const dot = a.reduce((sum, v, i) => sum + v * (b[i] ?? 0), 0);
      const magA = Math.sqrt(a.reduce((sum, v) => sum + v*v, 0));
      const magB = Math.sqrt(b.reduce((sum, v) => sum + v*v, 0));
      return magA && magB ? dot / (magA * magB) : 0;
    };

    // Score chunks
    const scored = chunks.map(c => ({ ...c, score: cosineSim(qEmbedding, c.embedding) }));
    const topChunks = scored.sort((a, b) => b.score - a.score).slice(0, TOP_K).map(c => c.chunk).join("\n\n");

    // Ask OpenAI for readable answer
    const prompt = `
You are an AI assistant. Only use information from this website content:
${topChunks}

Answer the user question in a friendly, conversational manner. 
Do not mention unrelated topics or other websites.
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
