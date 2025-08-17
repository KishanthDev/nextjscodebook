// src/app/api/lmstudio/route.ts
import { NextResponse } from "next/server";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";

const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: "http://127.0.0.1:1234", // ✅ add /v1
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: lmstudio("nomic-ai/nomic-embed-text-v1.5-GGUF"),
      prompt,
    });

    return NextResponse.json({ result: text });
  } catch (err: any) {
    console.error("❌ Error asking local LLM:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
