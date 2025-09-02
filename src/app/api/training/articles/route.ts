// app/api/training/articles/route.ts
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ARTICLES_PATH = path.join(process.cwd(), "data", "articles.json");
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

// Utility: validate and normalize article data
async function formatArticle(data: any, withEmbedding = true) {
  let embedding: number[] = [];
  if (withEmbedding && data.content) {
    const emb = await openaiClient.embeddings.create({
      model: "text-embedding-3-small",
      input: data.content,
    });
    embedding = emb.data[0].embedding as number[];
  }

  return {
    botId: data.botId, // ✅ tie to bot
    title: data.title || "",
    content: data.content || "",
    link: data.link || "",
    parent_category: data.parent_category || "General",
    categories: Array.isArray(data.categories) ? data.categories : [],
    createdAt: data.createdAt || new Date(),
    updatedAt: new Date(),
    embedding,
  };
}

// ---------- GET all or by botId ----------
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const botId = req.nextUrl.searchParams.get("botId");

  if (!botId && !id) {
    return NextResponse.json({ error: "botId or id required" }, { status: 400 });
  }

  if (botId && isJsonBot(botId)) {
    const all = loadJson(ARTICLES_PATH);
    if (id) {
      const article = all.find((a: any) => a._id === id);
      return NextResponse.json(article || {});
    }
    return NextResponse.json(all.filter((a: any) => a.botId === botId));
  }

  // fallback MongoDB
  const client = await clientPromise;
  const db = client.db("mydb");

  if (id) {
    const article = await db.collection("articles").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(article || {});
  }

  const filter: any = {};
  if (botId) filter.botId = botId;

  const articles = await db.collection("articles").find(filter).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(articles);
}

// ---------- CREATE ----------
export async function POST(req: NextRequest) {
  const rawData = await req.json();

  if (!rawData.botId) {
    return NextResponse.json({ error: "Missing botId" }, { status: 400 });
  }

  const data = await formatArticle(rawData, true);

  if (isJsonBot(rawData.botId)) {
    const articles = loadJson(ARTICLES_PATH);
    const newArticle = { _id: Date.now().toString(), ...data };
    articles.push(newArticle);
    saveJson(ARTICLES_PATH, articles);
    return NextResponse.json(newArticle);
  }

  // fallback MongoDB
  const client = await clientPromise;
  const db = client.db("mydb");
  const result = await db.collection("articles").insertOne(data);
  return NextResponse.json({ _id: result.insertedId, ...data });
}

// ---------- UPDATE ----------
export async function PUT(req: NextRequest) {
  const { id, ...updateData } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing article ID" }, { status: 400 });
  }

  const data = await formatArticle(updateData, true);

  if (isJsonBot(updateData.botId)) {
    let articles = loadJson(ARTICLES_PATH);
    const idx = articles.findIndex((a: any) => a._id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    articles[idx] = { ...articles[idx], ...data, _id: id };
    saveJson(ARTICLES_PATH, articles);
    return NextResponse.json(articles[idx]);
  }

  // fallback MongoDB
  const client = await clientPromise;
  const db = client.db("mydb");
  const result = await db
    .collection("articles")
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data }, { returnDocument: "after" });

  return NextResponse.json(result?.value || {});
}

// ---------- DELETE ----------
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const botId = req.nextUrl.searchParams.get("botId");

  if (!id || !botId) {
    return NextResponse.json({ error: "Missing article ID or botId" }, { status: 400 });
  }

  if (isJsonBot(botId)) {
    let articles = loadJson(ARTICLES_PATH);
    const updated = articles.filter((a: any) => a._id !== id);
    saveJson(ARTICLES_PATH, updated);
    return NextResponse.json({ success: updated.length < articles.length });
  }

  // fallback MongoDB
  const client = await clientPromise;
  const db = client.db("mydb");
  const result = await db.collection("articles").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: result.deletedCount > 0 });
}
