// src/app/api/sdk/system-prompts/route.ts
import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
    const { prompt } = await req.json();

    const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        messages: [
            {
                role: "system",
                content: `You are a text summarizer.
    Summarize the text you receive.
    • Be concise.
    • Return only the summary.
    • Do not use the phrase "here is a summary".
    • Highlight relevant phrases in **bold**.
    • The summary should be two sentences long.`,
            },
            { role: "user", content: prompt }],
    })

    return NextResponse.json({ text });
}
