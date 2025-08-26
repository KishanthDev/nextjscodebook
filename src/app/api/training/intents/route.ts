// app/api/intents/route.ts
import { NextResponse } from "next/server";
import { createIntent, listIntents } from "@/lib/intentService";

export async function GET() {
  try {
    const intents = await listIntents();
    return NextResponse.json(intents);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { displayName, trainingPhrases, responses } = await req.json();

    const intent = await createIntent(displayName, trainingPhrases, responses);

    return NextResponse.json(intent);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
