import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import * as cheerio from "cheerio";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid URL" }, { status: 400 });
    }

    // Validate URL
    try { new URL(url); } catch { 
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Fetch HTML
    const res = await fetch(url);
    if (!res.ok) return NextResponse.json({ error: `Failed to fetch HTML (${res.status})` }, { status: res.status });

    const html = await res.text();
    const $ = cheerio.load(html);

    // Language
    const langAttr = $("html").attr("lang") || "";
    const language = langAttr.trim().toLowerCase();

    // Remove scripts/styles and handle line breaks
    $("style, script").remove();
    $("br").replaceWith("\n");

    // Extract unique paragraphs/headings
    const paragraphs: string[] = [];
    const seen = new Set<string>();
    $("p, h1, h2, h3, h4, h5, h6").each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (text.length > 20 && !seen.has(text)) {
        seen.add(text);
        paragraphs.push(text);
      }
    });

    // Fallback to body text if no paragraphs
    if (paragraphs.length === 0) {
      const bodyText = $("body").text().replace(/\s+/g, " ").trim();
      if (bodyText.length > 20) paragraphs.push(bodyText);
    }

    // Chunk into ~200 words
    const chunks: string[] = [];
    for (const para of paragraphs) {
      const words = para.split(" ");
      for (let i = 0; i < words.length; i += 200) {
        chunks.push(words.slice(i, i + 200).join(" "));
      }
    }

    // Generate embeddings for each chunk
    const chunkDocs: { chunk: string; embedding: number[] }[] = [];
    for (const chunk of chunks) {
      const embResp = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });
      const embedding = embResp.data[0].embedding;
      chunkDocs.push({ chunk, embedding });
    }

    // Save all chunks with embeddings in MongoDB
    const client = await clientPromise;
    const db = client.db("mydb");
    await db.collection("websites").insertOne({
      url,
      language,
      chunks: chunkDocs,
      uploadedAt: new Date(),
    });

    return NextResponse.json({ success: true, url, chunks: chunkDocs.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
