import clientPromise from "@/lib/mongodb";
import pdfParse from "pdf-parse";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHUNK_SIZE = 500; // words per chunk
const BOTS_PATH = path.join(process.cwd(), "data", "bots.json");
const PDF_PATH = path.join(process.cwd(), "data", "pdf_embeddings.json");

export class PdfService {
  // ---------- Helpers ----------
  private static loadJson(file: string) {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return [];
    }
  }

  private static saveJson(file: string, data: any) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }

  private static isJsonBot(botId: string) {
    const bots = this.loadJson(BOTS_PATH);
    return bots.some((b: any) => b._id === botId);
  }

  private static async chunkPdf(buffer: Buffer): Promise<string[]> {
    const pdfData = await pdfParse(buffer);
    const words = pdfData.text.split(/\s+/);
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += CHUNK_SIZE) {
      chunks.push(words.slice(i, i + CHUNK_SIZE).join(" "));
    }
    return chunks;
  }

  private static async createEmbedding(chunk: string) {
    const embeddingResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk,
    });
    return embeddingResp.data[0].embedding;
  }

  // ---------- Upload + Embed ----------
  static async uploadPdf(file: File, botId: string) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const chunks = await this.chunkPdf(buffer);

    // ✅ JSON Mode
    if (this.isJsonBot(botId)) {
      const pdfs = this.loadJson(PDF_PATH);

      // Prevent duplicate upload
      if (pdfs.some((p: any) => p.botId === botId && p.pdfName === file.name)) {
        return { success: false, message: "File already uploaded", filename: file.name };
      }

      for (const chunk of chunks) {
        const embedding = await this.createEmbedding(chunk);
        pdfs.push({
          _id: Date.now().toString(),
          botId,
          pdfName: file.name,
          chunk,
          embedding,
          uploadedAt: new Date(),
        });
      }

      this.saveJson(PDF_PATH, pdfs);
      return { success: true, filename: file.name, botId };
    }

    // ✅ MongoDB Mode
    const client = await clientPromise;
    const db = client.db("mydb");
    const collection = db.collection("pdf_embeddings");

    // Prevent duplicate upload
    const existing = await collection.findOne({ botId, pdfName: file.name });
    if (existing) {
      return { success: false, message: "File already uploaded", filename: file.name };
    }

    for (const chunk of chunks) {
      const embedding = await this.createEmbedding(chunk);
      await collection.insertOne({
        botId,
        pdfName: file.name,
        chunk,
        embedding,
        uploadedAt: new Date(),
      });
    }

    return { success: true, filename: file.name, botId };
  }
}
