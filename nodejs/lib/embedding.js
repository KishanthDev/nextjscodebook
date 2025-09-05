// embedding.js
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

export async function createEmbedding(text) {
  try {
    // Call the AI SDK to create embedding
    const { embedding } = await embed({
      model: openai.textEmbeddingModel("text-embedding-3-small"),
      value: text,
    });

    return embedding; // returns a number[]
  } catch (err) {
    console.error("Embedding error:", err);
    throw err;
  }
}
