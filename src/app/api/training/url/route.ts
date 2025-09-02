// app/api/training/websites/route.ts
import * as cheerio from "cheerio";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const WEBSITES_PATH = path.join(process.cwd(), "data", "websites.json");
const BOTS_PATH = path.join(process.cwd(), "data", "bots.json");

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

// ✅ helper to normalize short slug from url
function normalizeUrl(url: string) {
  try {
    const { hostname } = new URL(url);
    const slug = hostname.replace(/^www\./, "").split(".")[0];
    return `${slug}-ai-bot`;
  } catch {
    return url.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  }
}

// ---------- GET (list sites per bot) ----------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const botId = searchParams.get("botId");

    if (!botId) {
      return NextResponse.json({ error: "Missing botId" }, { status: 400 });
    }

    // ✅ JSON Mode
    if (isJsonBot(botId)) {
      const websites = loadJson(WEBSITES_PATH).filter((w: any) => w.botId === botId);
      return NextResponse.json({
        sites: websites.map((u: any) => ({
          url: u.url,
          slug: u.slug,
          createdAt: u.uploadedAt,
        })),
      });
    }

    // ✅ MongoDB Mode
    const client = await clientPromise;
    const db = client.db("mydb");
    const urls = await db
      .collection("websites")
      .find({ botId }, { projection: { url: 1, slug: 1, uploadedAt: 1 } })
      .toArray();

    return NextResponse.json({
      sites: urls.map((u) => ({
        url: u.url,
        slug: u.slug,
        createdAt: u.uploadedAt?.toISOString(),
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------- POST (scrape + embed + save) ----------
export async function POST(req: Request) {
  try {
    const { url, botId } = await req.json();

    if (!url || typeof url !== "string" || !botId) {
      return NextResponse.json({ error: "Missing url or botId" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Fetch HTML
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch HTML (${res.status})` },
        { status: res.status }
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const langAttr = $("html").attr("lang") || "";
    const language = langAttr.trim().toLowerCase();

    $("style, script").remove();
    $("br").replaceWith("\n");

    const paragraphs: string[] = [];
    const seen = new Set<string>();
    $("p, h1, h2, h3, h4, h5, h6").each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (text.length > 20 && !seen.has(text)) {
        seen.add(text);
        paragraphs.push(text);
      }
    });

    if (paragraphs.length === 0) {
      const bodyText = $("body").text().replace(/\s+/g, " ").trim();
      if (bodyText.length > 20) paragraphs.push(bodyText);
    }

    const chunks: string[] = [];
    for (const para of paragraphs) {
      const words = para.split(" ");
      for (let i = 0; i < words.length; i += 200) {
        chunks.push(words.slice(i, i + 200).join(" "));
      }
    }

    // Generate embeddings
    const chunkDocs: { chunk: string; embedding: number[] }[] = [];
    for (const chunk of chunks) {
      const embResp = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });
      const embedding = embResp.data[0].embedding;
      chunkDocs.push({ chunk, embedding });
    }

    const siteDoc = {
      url,
      slug: normalizeUrl(url),
      botId,
      language,
      chunks: chunkDocs,
      uploadedAt: new Date().toISOString(),
    };

    // ✅ JSON Mode
    if (isJsonBot(botId)) {
      let websites = loadJson(WEBSITES_PATH);
      websites.push(siteDoc);

      // Enforce max 10 sites per bot
      const botSites = websites.filter((w: any) => w.botId === botId);
      if (botSites.length > 10) {
        const toRemove = botSites
          .sort((a: any, b: any) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime())
          .slice(0, botSites.length - 10);
        websites = websites.filter((w: any) => !toRemove.includes(w));
      }

      saveJson(WEBSITES_PATH, websites);
      return NextResponse.json({
        success: true,
        url,
        slug: siteDoc.slug,
        chunks: chunkDocs.length,
      });
    }

    // ✅ MongoDB Mode
    const client = await clientPromise;
    const db = client.db("mydb");
    await db.collection("websites").insertOne(siteDoc);

    const count = await db.collection("websites").countDocuments({ botId });
    if (count > 10) {
      const oldest = await db
        .collection("websites")
        .find({ botId })
        .sort({ uploadedAt: 1 })
        .limit(count - 10)
        .toArray();
      const idsToRemove = oldest.map((doc) => doc._id);
      if (idsToRemove.length > 0) {
        await db.collection("websites").deleteMany({ _id: { $in: idsToRemove } });
      }
    }

    return NextResponse.json({
      success: true,
      url,
      slug: siteDoc.slug,
      chunks: chunkDocs.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
