import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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
