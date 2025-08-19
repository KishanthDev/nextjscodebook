import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { question, filename } = await req.json();

    if (!question || !filename) {
      return NextResponse.json({ error: "Question and filename required" }, { status: 400 });
    }

    // Get PDF text from Mongo
    const client = await clientPromise;
    const db = client.db("mydb");
    const collection = db.collection("pdfs");

    const pdfDoc = await collection.findOne({ filename });

    if (!pdfDoc) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Ask OpenAI with PDF content
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Answer the question based on this PDF content:\n\n${pdfDoc.content}\n\nQuestion: ${question}`,
            },
          ],
        },
      ],
    });

    return NextResponse.json({ answer: result.text });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
