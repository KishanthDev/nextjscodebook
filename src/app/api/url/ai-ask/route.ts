import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai"; // ✅ use provider
import { OpenAI } from "openai";


const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const TOP_K = 3;

function normalizeUrl(url: string) {
  try {
    const { hostname } = new URL(url);
    const slug = hostname.replace(/^www\./, "").split(".")[0]; // e.g. "qdrant"
    return `${slug}-ai-bot`; // 👈 append -ai-bot
  } catch {
    return url.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  }
}

export async function POST(req: Request) {
  try {
    const { question, url } = await req.json();
    if (!question || !url) {
      return NextResponse.json({ error: "URL and question required" }, { status: 400 });
    }

    const key = normalizeUrl(url); // 🔑 normalize input

    const client = await clientPromise;
    const db = client.db("mydb");

    // 👇 Query by slug instead of raw url
    const site = await db.collection("websites").findOne({ slug: key });
    if (!site) return NextResponse.json({ error: "Website not found" }, { status: 404 });

    const chunks: { chunk: string; embedding: number[] }[] = site.chunks;

    // Generate embedding for question
    const qEmbResp = await openaiClient.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const qEmbedding = qEmbResp.data[0].embedding;

    // Cosine similarity
    const cosineSim = (a: number[], b: number[]) => {
      const dot = a.reduce((sum, v, i) => sum + v * (b[i] ?? 0), 0);
      const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
      const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
      return magA && magB ? dot / (magA * magB) : 0;
    };

    const scored = chunks.map(c => ({ ...c, score: cosineSim(qEmbedding, c.embedding) }));
    const topChunks = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_K)
      .map(c => c.chunk)
      .join("\n\n");

    const prompt = `
You are an AI assistant. Only use information from this website content:
${topChunks}

Answer the user question in a friendly, conversational manner. 
Do not mention unrelated topics or other websites.
User question: ${question}
    `;

    // ✅ Use OpenAI provider directly (bypasses Vercel AI Gateway)
    const { textStream } = await streamText({
      model: openai("gpt-4o-mini"),
      prompt,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of textStream) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
