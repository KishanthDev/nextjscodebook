// /api/pdf-list/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    const collection = db.collection("pdf_embeddings");

    // Project pdfName instead of filename
    const files = await collection.find({}, { projection: { pdfName: 1, _id: 0 } }).toArray();

    return NextResponse.json({ files: files.map((f) => f.pdfName) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
