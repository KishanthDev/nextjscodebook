// app/api/pdf-upload/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import pdfParse from "pdf-parse";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHUNK_SIZE = 500; // words per chunk
const BOTS_PATH = path.join(process.cwd(), "data", "bots.json");
const PDF_PATH = path.join(process.cwd(), "data", "pdf_embeddings.json");

// ---------- Helpers ----------
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
function isJsonBot(botId: string) {
  const bots = loadJson(BOTS_PATH);
  return bots.some((b: any) => b._id === botId);
}

// ---------- POST (upload + embed PDF) ----------
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const botId = formData.get("botId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!botId) {
      return NextResponse.json({ error: "Bot ID is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);

    // Split text into chunks
    const words = pdfData.text.split(/\s+/);
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += CHUNK_SIZE) {
      chunks.push(words.slice(i, i + CHUNK_SIZE).join(" "));
    }

    // ✅ JSON Mode
    if (isJsonBot(botId)) {
      const pdfs = loadJson(PDF_PATH);

      // Prevent duplicate upload
      if (pdfs.some((p: any) => p.botId === botId && p.pdfName === file.name)) {
        return NextResponse.json(
          { success: false, message: "File already uploaded", filename: file.name },
          { status: 200 }
        );
      }

      for (const chunk of chunks) {
        const embeddingResp = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: chunk,
        });

        const embedding = embeddingResp.data[0].embedding;
        pdfs.push({
          _id: Date.now().toString(),
          botId,
          pdfName: file.name,
          chunk,
          embedding,
          uploadedAt: new Date(),
        });
      }

      saveJson(PDF_PATH, pdfs);
      return NextResponse.json({ success: true, filename: file.name, botId });
    }

    // ✅ MongoDB Mode
    const client = await clientPromise;
    const db = client.db("mydb");
    const collection = db.collection("pdf_embeddings");

    // Prevent duplicate upload
    const existing = await collection.findOne({ botId, pdfName: file.name });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "File already uploaded", filename: file.name },
        { status: 200 }
      );
    }

    for (const chunk of chunks) {
      const embeddingResp = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });

      const embedding = embeddingResp.data[0].embedding;
      await collection.insertOne({
        botId,
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
