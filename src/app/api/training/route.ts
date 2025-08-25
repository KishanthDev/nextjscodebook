import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { OpenAI } from "openai";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const TOP_K = 5; // how many chunks to include

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        if (!text) {
            return NextResponse.json({ error: "Text required" }, { status: 400 });
        }
        const question = text;

        const client = await clientPromise;
        const db = client.db("mydb");

        // ✅ Fetch websites
        const sites = await db.collection("websites").find({}).toArray();

        // ✅ Fetch pdf embeddings
        const pdfs = await db.collection("pdf_embeddings").find({}).toArray();

        if (!sites.length && !pdfs.length) {
            return NextResponse.json(
                { error: "No training data found (websites or PDFs)" },
                { status: 404 }
            );
        }

        // Combine all chunks into one array
        const allChunks: { chunk: string; embedding: number[]; source: string }[] = [];

        // Websites → normalize
        for (const site of sites) {
            for (const c of site.chunks) {
                allChunks.push({
                    chunk: c.chunk,
                    embedding: c.embedding,
                    source: `Website: ${site.url}`,
                });
            }
        }

        // PDFs → normalize
        for (const pdf of pdfs) {
            allChunks.push({
                chunk: pdf.chunk,
                embedding: pdf.embedding,
                source: `PDF: ${pdf.pdfName}`,
            });
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
        const scored = allChunks.map(c => ({
            ...c,
            score: cosineSim(qEmbedding, c.embedding),
        }));

        // Pick top K chunks
        const topChunks = scored
            .sort((a, b) => b.score - a.score)
            .slice(0, TOP_K)
            .map(c => `${c.source}:\n${c.chunk}`)
            .join("\n\n");

        // Build prompt
        const prompt = `
You are an AI assistant.
Use the following combined content from both websites and PDFs if it is relevant to answer the question. 

Relevant training content:
${topChunks || "No relevant context found."}

Rules:
- Only use the above training content (both websites + PDFs).
- Never guess or make assumptions beyond the provided content.
- If the content above does not contain the answer, reply with exactly:
  "Sorry, I am not yet trained for this data."
- Keep the response short, clear, and conversational.

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
