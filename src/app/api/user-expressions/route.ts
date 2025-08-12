import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing or invalid 'message'." }, { status: 400 });
    }

    // Equivalent to PHP: sb_open_ai_user_expressions($message)
    const prompt = `Create a numbered list of minimum 10 variants of this sentence and only return the list: """${message}""""`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini", // Equivalent to sb_open_ai_get_gpt_model()
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || "1"),
    });

    const raw = completion.choices[0]?.message?.content || "";
    let lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

    // Clean numbering (like PHP loop removing "1. " or "1) ")
    lines = lines.map((expr, idx) => {
      if (expr.startsWith(`${idx + 1}.`)) return expr.slice(`${idx + 1}.`.length).trim();
      if (expr.startsWith(`${idx + 1})`)) return expr.slice(`${idx + 1})`.length).trim();
      if (expr.startsWith(".")) return expr.slice(1).trim();
      return expr;
    });

    return NextResponse.json({ expressions: lines });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
