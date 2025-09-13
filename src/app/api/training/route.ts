import { NextResponse } from "next/server";
import { ChatService } from "@/lib/services/chatService";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongodbHelper";
import { handleFallback } from "@/lib/handleFallback";
import { saveMessage } from "@/lib/conversationHelper";

const chatService = new ChatService();

export async function POST(req: Request) {
  try {
    const { botId, convId = null, text } = await req.json(); // ✅ include convId
    if (!botId || !text) {
      return NextResponse.json({ error: "Bot ID and text are required" }, { status: 400 });
    }

    // Save user message
    const conversationId = await saveMessage(botId, convId, "user", text);

    const collection = await getCollection("bots");
    const bot = await collection.findOne({ _id: new ObjectId(botId) });

    // 1️⃣ Human takeover first
    if (bot?.humanTakeover) {
      return NextResponse.json({
        convId: conversationId,
        type: "handover",
        text: "👩‍💻 A human agent has been notified and will reply shortly. Please wait...",
      });
    }

    // 2️⃣ Explicit user request for human
    if (/agent|human|support|talk to (a )?person/i.test(text)) {
      await collection.updateOne(
        { _id: new ObjectId(botId) },
        { $set: { humanTakeover: true } }
      );
      return NextResponse.json({
        convId: conversationId,
        type: "handover",
        text: "Okay 👩‍💻 transferring you to a human agent...",
      });
    }

    // 3️⃣ AI attempt across all sources
    const { qaPairs, articles, sites, pdfs, flows, flowButtons } =
      await chatService.getBotData(botId);

    const aiReply =
      (await chatService.handleFlows(text, flows, flowButtons)) ||
      (await chatService.handleQAPairs(text, qaPairs)) ||
      (await chatService.handleArticles(text, articles)) ||
      (await chatService.handleWebsitesAndPDFs(text, sites, pdfs, botId));

    // 4️⃣ Fallback if no source produced a reply
    if (!aiReply) {
      const fallback = await handleFallback(botId);
      await saveMessage(botId, conversationId, "ai", fallback.text);
      return NextResponse.json({ convId: conversationId, ...fallback });
    }

    // 5️⃣ Return AI reply
    if ("type" in aiReply && "text" in aiReply) {
      await saveMessage(botId, conversationId, "ai", aiReply.text);
      return NextResponse.json({ convId: conversationId, ...aiReply });
    } else if ("textStream" in aiReply) {
      let fullText = "";
      const { textStream } = aiReply;
      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of textStream) {
                const str = new TextDecoder().decode(chunk);
                fullText += str;
                controller.enqueue(new TextEncoder().encode(str));
              }
              await saveMessage(botId, conversationId, "ai", fullText);
              controller.close();
            } catch (err) {
              controller.error(err);
            }
          },
        }),
        { headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    } else {
      return NextResponse.json({
        convId: conversationId,
        ...(await handleFallback(botId)),
      });
    }
  } catch (err: any) {
    console.error("Error in chat route:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
