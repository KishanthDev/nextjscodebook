// /api/pdf-upload/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import pdfParse from "pdf-parse";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHUNK_SIZE = 500; // words per chunk

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const botId = formData.get("botId") as string; // 👈 add botId from frontend

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!botId) {
      return NextResponse.json({ error: "Bot ID is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);

    const client = await clientPromise;
    const db = client.db("mydb");
    const collection = db.collection("pdf_embeddings");

    // Check if PDF already uploaded for this bot
    const existing = await collection.findOne({ botId, pdfName: file.name });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "File already uploaded", filename: file.name },
        { status: 200 }
      );
    }

    // Split text into chunks
    const words = pdfData.text.split(/\s+/);
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += CHUNK_SIZE) {
      chunks.push(words.slice(i, i + CHUNK_SIZE).join(" "));
    }

    // Generate embeddings for each chunk and store
    for (const chunk of chunks) {
      const embeddingResp = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });

      const embedding = embeddingResp.data[0].embedding;

      await collection.insertOne({
        botId,               // 👈 store botId
        pdfName: file.name,
        chunk,
        embedding,
        uploadedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, filename: file.name, botId });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
