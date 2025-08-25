import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { OpenAI } from "openai";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const TOP_K = 5; // increase to get more context

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        if (!text) {
            return NextResponse.json({ error: "Text required" }, { status: 400 });
        }
        const question = text;


        const client = await clientPromise;
        const db = client.db("mydb");

        // ✅ fetch ALL chunks from all websites
        const sites = await db.collection("websites").find({}).toArray();
        if (!sites.length) {
            return NextResponse.json({ error: "No websites trained yet" }, { status: 404 });
        }

        const allChunks: { chunk: string; embedding: number[]; url: string }[] = [];
        for (const site of sites) {
            for (const c of site.chunks) {
                allChunks.push({ ...c, url: site.url });
            }
        }

        // Generate embedding for user question
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

        // Score all chunks
        const scored = allChunks.map(c => ({ ...c, score: cosineSim(qEmbedding, c.embedding) }));
        const topChunks = scored
            .sort((a, b) => b.score - a.score)
            .slice(0, TOP_K)
            .map(c => `From ${c.url}:\n${c.chunk}`)
            .join("\n\n");

        const prompt = `
You are an AI assistant. Only use the following website content to answer:

${topChunks}

Answer the user question in a friendly, conversational way.
If the answer cannot be found in the content, say you don't have enough info.
User question: ${question}
    `;

        // Stream AI answer
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
