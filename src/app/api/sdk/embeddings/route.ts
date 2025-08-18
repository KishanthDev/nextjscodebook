// app/api/embeddings/route.ts
import { NextResponse } from "next/server";
import { embedMany, embed, cosineSimilarity } from "ai";
import { openai } from "@ai-sdk/openai"; // ✅ ai-sdk OpenAI provider

export async function POST(req: Request) {
  try {
    const { values, query } = await req.json();

    if (!values || !Array.isArray(values) || values.length === 0) {
      return NextResponse.json(
        { error: "You must provide an array of values" },
        { status: 400 }
      );
    }

    if (!query) {
      return NextResponse.json(
        { error: "You must provide a search query" },
        { status: 400 }
      );
    }

    // ✅ Correct way: pass a model reference
    const model = openai.embedding("text-embedding-3-small");

    // Generate embeddings for values
    const { embeddings } = await embedMany({
      model,
      values,
    });

    const vectorDatabase = embeddings.map((embedding, index) => ({
      value: values[index]!,
      embedding,
    }));

    // Embed search term
    const searchTerm = await embed({
      model,
      value: query,
    });

    // Compute cosine similarities
    const entries = vectorDatabase.map((entry) => ({
      value: entry.value,
      similarity: cosineSimilarity(
        entry.embedding,
        searchTerm.embedding,
      ),
    }));

    // Sort by similarity
    const sortedEntries = entries.sort((a, b) => b.similarity - a.similarity);

    return NextResponse.json(sortedEntries);
  } catch (error: any) {
    console.error("Embedding API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
