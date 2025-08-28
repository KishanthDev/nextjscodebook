import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");

    const collections = {
      flows: "flows",
      qa_pairs: "qa_pairs",
      files: "pdf_embeddings",
      websites: "websites",
      articles: "articles",
      conversations: "conversations",
    };

    const stats: Record<string, number> = {};

    for (const [key, collectionName] of Object.entries(collections)) {
      const docs = await db.collection(collectionName).find().toArray();

      let wordCount = 0;

      for (const doc of docs) {
        const texts: string[] = [];

        // 🔹 Websites: text is inside chunks[].chunk
        if (key === "websites" && Array.isArray(doc.chunks)) {
          for (const c of doc.chunks) {
            if (c.chunk) texts.push(c.chunk);
          }
        }

        // 🔹 Flows: text is inside blocks[].message
        else if (key === "flows" && Array.isArray(doc.blocks)) {
          for (const b of doc.blocks) {
            if (b.message) texts.push(b.message);
          }
        }

        // 🔹 Files: text is inside "chunk"
        else if (key === "files" && doc.chunk) {
          texts.push(doc.chunk);
        }

        // 🔹 QA pairs: usual question/answer fields
        else if (key === "qa_pairs") {
          if (doc.question) texts.push(doc.question);
          if (doc.answer) texts.push(doc.answer);
        }

        // 🔹 Articles, Conversations: content/text fields
        else {
          if (doc.content) texts.push(doc.content);
          if (doc.text) texts.push(doc.text);
        }

        // Count words
        wordCount += texts.join(" ").split(/\s+/).filter(Boolean).length;
      }

      stats[key] = wordCount;
    }

    return NextResponse.json(stats);
  } catch (err) {
    console.error("Training stats error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
