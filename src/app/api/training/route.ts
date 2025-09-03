import { NextResponse } from "next/server";
import { ChatService } from "@/lib/services/chatService";

const chatService = new ChatService();

export async function POST(req: Request) {
  try {
    const { botId, text } = await req.json();
    if (!botId || !text) {
      return NextResponse.json({ error: "Bot ID and text are required" }, { status: 400 });
    }

    const { qaPairs, articles, sites, pdfs, flows, flowButtons } = await chatService.getBotData(botId);

    // Flows
    const flowReply = await chatService.handleFlows(text, flows, flowButtons);
    if (flowReply) return NextResponse.json(flowReply);

    // Q&A
    const qaReply = await chatService.handleQAPairs(text, qaPairs);
    if (qaReply) {
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          for (const word of qaReply.split(" ")) {
            controller.enqueue(encoder.encode(word + " "));
            await new Promise((resolve) => setTimeout(resolve, 30));
          }
          controller.close();
        },
      });
      return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    // Articles
    const articleReply = await chatService.handleArticles(text, articles);
    if (articleReply) {
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          for (const word of articleReply.split(" ")) {
            controller.enqueue(encoder.encode(word + " "));
            await new Promise((resolve) => setTimeout(resolve, 25));
          }
          controller.close();
        },
      });
      return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    // Websites + PDFs
    const { textStream } = await chatService.handleWebsitesAndPDFs(text, sites, pdfs);
    const stream = new ReadableStream({
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
    });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });

  } catch (err: any) {
    console.error("Error in chat route:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
