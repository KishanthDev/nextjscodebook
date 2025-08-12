import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Make sure you set this in .env.local
});

export async function POST(req: Request) {
  try {
    const { input_text } = await req.json();
    if (!input_text || typeof input_text !== "string") {
      return NextResponse.json({ error: "Missing or invalid input_text" }, { status: 400 });
    }

    // This is equivalent to what sb_open_ai_smart_reply likely does:
    const systemPrompt = `You are a smart reply generator. Given a user message, generate 3 short, natural, contextually relevant replies as a JSON array of strings. 
Only return JSON.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use your preferred model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input_text },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "[]";

    // Try parsing as JSON array
    let replies: string[] = [];
    try {
      replies = JSON.parse(raw);
    } catch {
      // If it's not valid JSON, just split by newlines
      replies = raw.split("\n").map(r => r.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
    }

    return NextResponse.json({ replies });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
