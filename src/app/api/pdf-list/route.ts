// /api/pdf-list/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    const collection = db.collection("pdfs");

    const files = await collection.find({}, { projection: { filename: 1 } }).toArray();
    return NextResponse.json({ files: files.map((f) => f.filename) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
