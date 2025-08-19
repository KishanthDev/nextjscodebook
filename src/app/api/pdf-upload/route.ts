import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import pdfParse from "pdf-parse";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);

    // Connect DB
    const client = await clientPromise;
    const db = client.db("mydb");
    const collection = db.collection("pdfs");

    // Check if PDF already exists by filename
    const existing = await collection.findOne({ filename: file.name });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "File already uploaded", filename: file.name },
        { status: 200 }
      );
    }

    // Insert new PDF
    const doc = {
      filename: file.name,
      content: pdfData.text,
      uploadedAt: new Date(),
    };

    await collection.insertOne(doc);

    return NextResponse.json({ success: true, filename: file.name });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
