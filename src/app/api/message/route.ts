import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Missing 'message' parameter." }, { status: 400 });
    }

    // You can optionally extend this with other parameters to match your PHP's sb_open_ai_message extras

    const systemPrompt =
      "You are an AI assistant. Respond appropriately to the user's message.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Match the PHP default or your configured model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ response: reply });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
