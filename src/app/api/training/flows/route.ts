import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cosineSimilarity } from "@/lib/similarity";
import { OpenAI } from "openai";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- GET: return all flows ---
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    const flows = await db.collection("flows").find({}).toArray();

    return NextResponse.json(flows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- POST: process a user message ---
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. Get user embedding
    const embeddingRes = await openaiClient.embeddings.create({
      model: "text-embedding-3-small",
      input: message,
    });
    const userEmbedding = embeddingRes.data[0].embedding;

    // 2. Fetch all flows
    const client = await clientPromise;
    const db = client.db("mydb");
    const flows = await db.collection("flows").find({}).toArray();

    // 3. Find closest flow
    let bestFlow = null;
    let bestScore = -1;
    for (const flow of flows) {
      const score = cosineSimilarity(userEmbedding, flow.embedding);
      if (score > bestScore) {
        bestScore = score;
        bestFlow = flow;
      }
    }

    // 4. Threshold check
    if (!bestFlow || bestScore < 0.75) {
      return NextResponse.json({
        reply: "Sorry, I am not yet trained for this data.",
      });
    }

    // 5. Return the first block of the matched flow
    const startBlock = bestFlow.blocks.find((b: any) => b.id === "start");

    let reply: any = {
      type: startBlock.type,
      text: startBlock.message,
    };

    if (startBlock.next) {
      const nextBlock = bestFlow.blocks.find((b: any) => b.id === startBlock.next);

      if (nextBlock?.type === "send_button_list") {
        reply = {
          type: "buttons",
          text: nextBlock.message,
          buttons: nextBlock.buttons.map((btn: any) => ({
            label: btn.label,
            action: btn.action,
          })),
        };
      } else if (nextBlock?.type === "send_message") {
        reply = {
          type: "message",
          text: nextBlock.message,
        };
      }
    }

    return NextResponse.json(reply);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
