import { NextResponse } from "next/server";
import { ChatService } from "@/lib/services/chatService";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongodbHelper";
import { handleFallback } from "@/lib/handleFallback";

const chatService = new ChatService();

export async function POST(req: Request) {
  try {
    const { botId, text } = await req.json();
    if (!botId || !text) {
      return NextResponse.json({ error: "Bot ID and text are required" }, { status: 400 });
    }

    const collection = await getCollection("bots");
    const bot = await collection.findOne({ _id: new ObjectId(botId) });

    // 1️⃣ Human takeover first
    if (bot?.humanTakeover) {
      return NextResponse.json({
        type: "handover",
        text: "👩‍💻 A human agent has been notified and will reply shortly. Please wait...",
      });
    }

    // 2️⃣ Explicit user request for human
    if (/agent|human|support|talk to (a )?person/i.test(text)) {
      await collection.updateOne({ _id: new ObjectId(botId) }, { $set: { humanTakeover: true } });
      return NextResponse.json({
        type: "handover",
        text: "Okay 👩‍💻 transferring you to a human agent...",
      });
    }

    // 3️⃣ AI attempt across all sources
    const { qaPairs, articles, sites, pdfs, flows, flowButtons } = await chatService.getBotData(botId);

    const aiReply =
      (await chatService.handleFlows(text, flows, flowButtons)) ||
      (await chatService.handleQAPairs(text, qaPairs)) ||
      (await chatService.handleArticles(text, articles)) ||
      (await chatService.handleWebsitesAndPDFs(text, sites, pdfs, botId));

    // 4️⃣ Fallback if no source produced a reply
    if (!aiReply) {
      return NextResponse.json(await handleFallback(botId));
    }

    // 5️⃣ Return AI reply
    if ("type" in aiReply && "text" in aiReply) {
      return NextResponse.json(aiReply);
    } else if ("textStream" in aiReply) {
      const { textStream } = aiReply;
      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of textStream) {
                controller.enqueue(new TextEncoder().encode(chunk));
              }
              controller.close();
            } catch (err) {
              controller.error(err);
            }
          },
        }),
        { headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    } else {
      return NextResponse.json(await handleFallback(botId));
    }
  } catch (err: any) {
    console.error("Error in chat route:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

