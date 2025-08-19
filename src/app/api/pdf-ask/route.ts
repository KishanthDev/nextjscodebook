// /api/pdf-ask/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const TOP_K = 5; // number of chunks to retrieve

export async function POST(req: Request) {
  try {
    const { question, filename } = await req.json();

    if (!question || !filename) {
      return NextResponse.json(
        { error: "Question and filename required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const collection = db.collection("pdf_embeddings");

    // Generate embedding for the question
    const qEmbeddingResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const qEmbedding = qEmbeddingResp.data[0]?.embedding;
    if (!qEmbedding) {
      return NextResponse.json({ error: "Failed to generate embedding" }, { status: 500 });
    }

    // Type for MongoDB chunk document
    type PdfChunk = {
      pdfName: string;
      chunk: string;
      embedding: number[];
      uploadedAt: Date;
    };

    const chunks = (await collection.find({ pdfName: filename }).toArray()) as unknown as PdfChunk[];

    if (!chunks.length) {
      return NextResponse.json({ error: "PDF not found or no chunks" }, { status: 404 });
    }

    // Cosine similarity
    const similarity = (a: number[], b: number[]) => {
      const dot = a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
      const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return magA && magB ? dot / (magA * magB) : 0;
    };

    // Sort chunks by similarity
    const topChunks = chunks
      .map(c => ({ ...c, score: similarity(qEmbedding, c.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_K);

    const contextText = topChunks.map(c => c.chunk).join("\n\n");

    // Ask OpenAI using top chunks
    const answerResp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Answer the question based on these PDF chunks:\n\n${contextText}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer = answerResp.choices?.[0]?.message?.content ?? "No answer found.";

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
