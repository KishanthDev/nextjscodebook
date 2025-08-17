// src/app/api/ask/route.ts
import { NextResponse } from "next/server";
import { generateText, type LanguageModel } from "ai";
import { openai } from "@ai-sdk/openai";
// import { anthropic } from "@ai-sdk/anthropic"; // Uncomment if needed

// ✅ Reusable ask function
async function ask(prompt: string, model: LanguageModel) {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
}

// ✅ API route
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Example with OpenAI GPT
    const answer = await ask(prompt, openai("gpt-4o-mini"));

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("❌ Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
