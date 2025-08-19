// /api/url-upload/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid URL" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Fetch HTML
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: `HTML retrieval failed with HTTP code: ${res.status}` }, { status: res.status });
    }
    const html = await res.text();

    // Load HTML with cheerio
    const $ = cheerio.load(html);

    // Detect language
    const langAttr = $("html").attr("lang") || "";
    const language = langAttr.trim().toLowerCase();

    // Remove scripts/styles
    $("style, script").remove();
    $("br").replaceWith("\n");

    // Build unique paragraphs
    const paragraphs: string[] = [];
    const seen: Set<string> = new Set();
    $("p, h1, h2, h3, h4, h5, h6").each((i, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (text.length > 20 && !seen.has(text)) {
        seen.add(text);
        paragraphs.push(text);
      }
    });

    // If no paragraphs found, fallback to body text
    if (paragraphs.length === 0) {
      const bodyText = $("body").text().replace(/\s+/g, " ").trim();
      if (bodyText.length > 20) paragraphs.push(bodyText);
    }

    // Chunk paragraphs into ~200-word chunks
    const chunks: string[] = [];
    for (const para of paragraphs) {
      const words = para.split(" ");
      for (let i = 0; i < words.length; i += 200) {
        chunks.push(words.slice(i, i + 200).join(" "));
      }
    }

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db("mydb");
    await db.collection("websites").insertOne({
      url,
      language,
      chunks,
      uploadedAt: new Date(),
    });

    return NextResponse.json({ success: true, url, chunks: chunks.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
