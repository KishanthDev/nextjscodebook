// app/api/articles/route.ts
import clientpromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { OpenAI } from "openai";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    title: data.title || "",
    content: data.content || "",
    link: data.link || "", // optional external link
    parent_category: data.parent_category || "General",
    categories: Array.isArray(data.categories) ? data.categories : [],
    createdAt: data.createdAt || new Date(),
    updatedAt: new Date(),
    embedding, // <-- store embedding for training
  };
}

// GET all or one
export async function GET(req: NextRequest) {
  const client = await clientpromise;
  const db = client.db("mydb");
  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    const article = await db.collection("articles").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(article || {});
  } else {
    const articles = await db.collection("articles").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(articles);
  }
}

// CREATE (enforce structure + embeddings)
export async function POST(req: NextRequest) {
  const client = await clientpromise;
  const db = client.db("mydb");
  const rawData = await req.json();

  const data = await formatArticle(rawData, true);

  const result = await db.collection("articles").insertOne(data);
  return NextResponse.json({ _id: result.insertedId, ...data });
}

// UPDATE (retrain embedding on content change)
export async function PUT(req: NextRequest) {
  const client = await clientpromise;
  const db = client.db("mydb");
  const { id, ...updateData } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing article ID" }, { status: 400 });
  }

  const data = await formatArticle(updateData, true);

  const result = await db
    .collection("articles")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after" }
    );

  return NextResponse.json(result?.value || {});
}

// DELETE
export async function DELETE(req: NextRequest) {
  const client = await clientpromise;
  const db = client.db("mydb");
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing article ID" }, { status: 400 });
  }

  const result = await db.collection("articles").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: result.deletedCount > 0 });
}
