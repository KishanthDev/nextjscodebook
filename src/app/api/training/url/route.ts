import * as cheerio from "cheerio";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    const collection = db.collection("websites");

    const urls = await collection.find({}, { projection: { url: 1, slug: 1, uploadedAt: 1 } }).toArray();
    return NextResponse.json({
      sites: urls.map(u => ({ url: u.url, slug: u.slug, createdAt: u.uploadedAt?.toISOString() })),
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// ✅ helper to normalize short slug from url
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
    const { url, botId } = await req.json();

    if (!url || typeof url !== "string" || !botId) {
      return NextResponse.json({ error: "Missing url or botId" }, { status: 400 });
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

    // ✅ Save all chunks with slug
    const client = await clientPromise;
    const db = client.db("mydb");

    await db.collection("websites").insertOne({
      url,
      slug: normalizeUrl(url),
      botId,                     // 👈 store botId
      language,
      chunks: chunkDocs,
      uploadedAt: new Date(),
    });

    // ✅ Enforce limit per bot (10 sites per bot)
    const count = await db.collection("websites").countDocuments({ botId });
    if (count > 10) {
      const oldest = await db.collection("websites")
        .find({ botId })
        .sort({ uploadedAt: 1 })
        .limit(count - 10)
        .toArray();

      const idsToRemove = oldest.map(doc => doc._id);
      if (idsToRemove.length > 0) {
        await db.collection("websites").deleteMany({ _id: { $in: idsToRemove } });
      }
    }

    return NextResponse.json({ success: true, url, slug: normalizeUrl(url), chunks: chunkDocs.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}