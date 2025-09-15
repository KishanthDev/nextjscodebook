import { NextResponse } from "next/server";
import { ChatService } from "@/lib/services/chatService";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongodbHelper";
import { handleFallback } from "@/lib/handleFallback";
import { saveMessage } from "@/lib/conversationHelper";
import { loadJson, saveJson } from "@/lib/jsonDb";

const CONV_PATH = process.env.CONV_PATH || "conversations.json";
const chatService = new ChatService();

// Regex to detect fallback-style AI replies
const FALLBACK_REGEX = /isn't clear|If you have|Could you please|not trained|rephrase|sorry/i;

export async function POST(req: Request) {
  try {
    const { botId, convId = null, text } = await req.json();
    if (!botId || !text)
      return NextResponse.json({ error: "Bot ID and text are required" }, { status: 400 });

    // Save user message
    const conversationId = await saveMessage(botId, convId, "user", text);

    // Fetch conversation
    const isJsonBot = botId.startsWith("json-");
    let conversation;
    if (isJsonBot) {
      const conversations = loadJson(CONV_PATH);
      conversation = conversations.find((c: any) => c._id === conversationId);
    } else {
      const collection = await getCollection("conversations");
      conversation = await collection.findOne({
        _id: new ObjectId(conversationId),
        botId: isJsonBot ? conversationId : new ObjectId(botId),
      });
    }

    // Already in human takeover
    if (conversation?.humanTakeover) {
      return NextResponse.json({
        convId: conversationId,
        type: "handover",
        text: "👩‍💻 A human agent has been notified for this conversation.",
      });
    }

    // Explicit "talk to agent" trigger
    if (/agent|human|support|talk to (a )?person/i.test(text)) {
      if (isJsonBot) {
        const conversations = loadJson(CONV_PATH);
        const idx = conversations.findIndex((c: any) => c._id === conversationId);
        if (idx !== -1) {
          conversations[idx].humanTakeover = true;
          saveJson(CONV_PATH, conversations);
        }
      } else {
        const collection = await getCollection("conversations");
        await collection.updateOne(
          { _id: new ObjectId(conversationId) },
          { $set: { humanTakeover: true } }
        );
      }
      return NextResponse.json({
        convId: conversationId,
        type: "handover",
        text: "Okay 👩‍💻 transferring you to a human agent...",
      });
    }

    // Collect bot data
    const { qaPairs, articles, sites, pdfs, flows, flowButtons } =
      await chatService.getBotData(botId);
    const wrapIfString = (r: any) =>
      typeof r === "string" ? { type: "message", text: r } : r;

    // Try AI replies
    const aiReply =
      wrapIfString(await chatService.handleFlows(text, flows, flowButtons)) ||
      wrapIfString(await chatService.handleQAPairs(text, qaPairs)) ||
      wrapIfString(await chatService.handleArticles(text, articles)) ||
      (await chatService.handleWebsitesAndPDFs(text, sites, pdfs, botId, conversationId));

    // Case: no reply → fallback
    if (!aiReply) {
      const fallback = await handleFallback(botId, conversationId);
      await saveMessage(botId, conversationId, "ai", fallback.text);
      return NextResponse.json({ convId: conversationId, ...fallback });
    }

    // Case: AI reply looks like fallback → increment counter
    if (aiReply && typeof aiReply === "object" && "text" in aiReply && FALLBACK_REGEX.test(aiReply.text)) {
      const fallback = await handleFallback(botId, conversationId);

      // Save both AI text + fallback update
      await saveMessage(botId, conversationId, "ai", aiReply.text);

      // Ensure JSON conversations are saved back with updated counts
      if (isJsonBot) {
        const conversations = loadJson(CONV_PATH);
        saveJson(CONV_PATH, conversations);
      }

      return NextResponse.json({
        convId: conversationId,
        type: fallback.type,
        text: fallback.type === "handover" ? fallback.text : aiReply.text,
        fallbackCounted: true,
      });
    }

    // Case: streaming reply
    if (aiReply && typeof aiReply === "object" && "textStream" in aiReply) {
      let fullText = "";
      const { textStream } = aiReply;

      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of textStream) {
                let str;
                if (typeof chunk === "string") str = chunk;
                else if (chunk instanceof Uint8Array || ArrayBuffer.isView(chunk))
                  str = new TextDecoder().decode(chunk);
                else str = String(chunk);
                fullText += str;
                controller.enqueue(new TextEncoder().encode(str));
              }

              // Save streamed reply
              await saveMessage(botId, conversationId, "ai", fullText);

              // If reply looks like fallback → increment counter
              if (FALLBACK_REGEX.test(fullText)) {
                await handleFallback(botId, conversationId);

                if (isJsonBot) {
                  const conversations = loadJson(CONV_PATH);
                  saveJson(CONV_PATH, conversations);
                }
              }

              controller.close();
            } catch (err) {
              controller.error(err);
            }
          },
        }),
        { headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    // Default catch-all → fallback
    const fallback = await handleFallback(botId, conversationId);
    await saveMessage(botId, conversationId, "ai", fallback.text);

    if (isJsonBot) {
      const conversations = loadJson(CONV_PATH);
      saveJson(CONV_PATH, conversations);
    }

    return NextResponse.json({ convId: conversationId, ...fallback });
  } catch (err: any) {
    console.error("Error in chat route:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
