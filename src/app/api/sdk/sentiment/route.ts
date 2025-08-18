import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

const model = openai("gpt-4o-mini");

export async function POST(req: Request) {
  const { text } = await req.json();

  const { object } = await generateObject({
    model,
    output: "enum",
    enum: ["positive", "negative", "neutral"],
    prompt: text,
    system: `Classify the sentiment of the text as either positive, negative, or neutral.`,
  });

  return NextResponse.json({ sentiment: object });
}
