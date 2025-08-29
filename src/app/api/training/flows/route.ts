// app/api/training/flows/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { OpenAI } from "openai";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Format Flow (attach embedding) ---
async function formatFlow(data: any, withEmbedding = true) {
  let embedding: number[] = [];
  if (withEmbedding && data.title) {
    const emb = await openaiClient.embeddings.create({
      model: "text-embedding-3-small",
      input: data.title,
    });
    embedding = emb.data[0].embedding as number[];
  }

  return {
    botId: data.botId,
    flow_id: data.flow_id,
    title: data.title,
    blocks: data.blocks || [],
    createdAt: data.createdAt || new Date(),
    updatedAt: new Date(),
    embedding,
  };
}

// --- GET (list flows by botId) ---
export async function GET(req: NextRequest) {
  try {
    const botId = req.nextUrl.searchParams.get("botId");
    if (!botId) {
      return NextResponse.json({ error: "Missing botId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    const flows = await db.collection("flows").find({ botId }).toArray();
    return NextResponse.json(flows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- POST (create flow) ---
export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    if (!rawData.botId) {
      return NextResponse.json({ error: "Missing botId" }, { status: 400 });
    }

    const flow = await formatFlow(rawData, true);

    const client = await clientPromise;
    const db = client.db("mydb");

    const result = await db.collection("flows").insertOne(flow);
    return NextResponse.json({ _id: result.insertedId, ...flow });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- PUT (update flow) ---
export async function PUT(req: NextRequest) {
  try {
    const { id, ...updateData } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing flow ID" }, { status: 400 });
    }

    const data = await formatFlow(updateData, true);

    const client = await clientPromise;
    const db = client.db("mydb");

    const result = await db
      .collection("flows")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: "after" }
      );

    return NextResponse.json(result?.value || {});
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- DELETE (remove flow) ---
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing flow ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    const result = await db.collection("flows").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: result.deletedCount > 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
