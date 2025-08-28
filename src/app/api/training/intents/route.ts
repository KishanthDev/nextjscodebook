// app/api/intents/route.ts
import { NextResponse } from "next/server";
import { createIntent, listIntents } from "@/lib/intentService";
import { detectIntent } from "@/lib/intentService"; 

export async function GET() {
  try {
    const intents = await listIntents();
    return NextResponse.json(intents);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const action = body.action;

  try {
    if (action === "send") {
      const { message } = body;
      if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });
      const reply = await detectIntent(message);
      return NextResponse.json({ reply });
    }

    if (action === "create") {
      const { displayName, trainingPhrases, responses } = body;
      const intent = await createIntent(displayName, trainingPhrases, responses);
      return NextResponse.json(intent);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

