import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { OpenAI } from "openai";
import { cosineSimilarity } from "@/lib/similarity";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const TOP_K = 5;

// ------------------ Chat Handler -----------------------
export async function POST(req: Request) {
  try {
    const { botId, text } = await req.json();
    if (!botId || !text) {
      return NextResponse.json({ error: "Bot ID and text are required" }, { status: 400 });
    }

    const userText = text;
    const client = await clientPromise;
    const db = client.db("mydb");

    const qaPairs = await db.collection("qa_pairs").find({ botId }).toArray();
    const articles = await db.collection("articles").find({ botId }).toArray();
    const sites = await db.collection("websites").find({ botId }).toArray();
    const pdfs = await db.collection("pdf_embeddings").find({ botId }).toArray();


    // ----- Flows and Flow Buttons -----
    const [flows, flowButtons] = await Promise.all([
      db.collection("flows").find({}).toArray(),
      db.collection("flow_buttons").find({}).toArray(),
    ]);

    if (flows.length || flowButtons.length) {
      const embeddingResult = await openaiClient.embeddings.create({
        model: "text-embedding-3-small",
        input: userText,
      });
      const qEmbedding = embeddingResult.data[0].embedding as number[];

      let best: any = null;
      let bestScore = -Infinity;
      let bestType: "flow" | "flow_button" | null = null;

      // Match flows
      flows.forEach((f: any) => {
        if (!f.embedding) return;
        const score = cosineSimilarity(f.embedding, qEmbedding);
        if (score > bestScore) {
          best = f;
          bestScore = score;
          bestType = "flow";
        }
      });

      // Match buttons
      flowButtons.forEach((b: any) => {
        if (!b.embedding) return;
        const score = cosineSimilarity(b.embedding, qEmbedding);
        if (score > bestScore) {
          best = b;
          bestScore = score;
          bestType = "flow_button";
        }
      });

      if (best && bestScore > 0.6) {
        if (bestType === "flow") {
          const startBlock = best.blocks.find((b: any) => b.id === "start");
          let reply: any = {
            type: startBlock?.type ?? "message",
            text: startBlock?.message ?? best.title,
          };
          if (startBlock?.next) {
            const nextBlock = best.blocks.find((b: any) => b.id === startBlock.next);
            if (nextBlock?.type === "send_button_list" && nextBlock.buttons?.length) {
              reply = {
                type: "buttons",
                text: nextBlock.message ?? reply.text,
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
        }

        if (bestType === "flow_button") {
          // Respond as a clean action object
          const isRedirect = best.action && best.action.startsWith("redirect:");
          return NextResponse.json({
            type: "action",
            label: best.label,
            action: best.action,
            message: isRedirect
              ? `Redirecting you to ${best.label} 👉 ${best.action.replace("redirect:", "")}`
              : `Action: ${best.action}`,
          });
        }
      }
    }

    // ----- Q&A pairs with embeddings -----
    if (qaPairs.length > 0) {
      const embeddingResult = await openaiClient.embeddings.create({
        model: "text-embedding-3-small",
        input: userText,
      });
      const qEmbedding = embeddingResult.data[0].embedding as number[];
      let best: any = null;
      let bestScore = -Infinity;
      qaPairs.forEach((pair: any) => {
        const score = cosineSimilarity(pair.embedding, qEmbedding);
        if (score > bestScore) {
          best = pair;
          bestScore = score;
        }
      });

      if (best && bestScore > 0.6) {
        const stream = new ReadableStream({
          async start(controller) {
            try {
              const encoder = new TextEncoder();
              const words = best.answer.split(" ");
              for (const word of words) {
                controller.enqueue(encoder.encode(word + " "));
                await new Promise((resolve) => setTimeout(resolve, 30));
              }
              controller.close();
            } catch (err) {
              controller.error(err);
            }
          },
        });

        return new Response(stream, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    }

    // ----------------- Articles -----------------
    if (articles.length > 0) {
      const embeddingResult = await openaiClient.embeddings.create({
        model: "text-embedding-3-small",
        input: userText,
      });
      const qEmbedding = embeddingResult.data[0].embedding as number[];
      let best: any = null;
      let bestScore = -Infinity;
      articles.forEach((a: any) => {
        const score = cosineSimilarity(a.embedding, qEmbedding);
        if (score > bestScore) {
          best = a;
          bestScore = score;
        }
      });

      if (best && bestScore > 0.6) {
        const content = `**${best.title}**\n\n${best.content}`;
        const stream = new ReadableStream({
          async start(controller) {
            try {
              const encoder = new TextEncoder();
              const words = content.split(" ");
              for (const word of words) {
                controller.enqueue(encoder.encode(word + " "));
                await new Promise((resolve) => setTimeout(resolve, 25));
              }
              controller.close();
            } catch (err) {
              controller.error(err);
            }
          },
        });

        return new Response(stream, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    }

    // ----------------- Websites + PDFs -----------------
    if (!sites.length && !pdfs.length) {
      return NextResponse.json(
        { error: "No training data found (articles, websites, PDFs, or Q&A)" },
        { status: 404 }
      );
    }

    const allChunks: { chunk: string; embedding: number[]; source: string }[] = [];
    for (const site of sites) {
      for (const c of site.chunks) {
        allChunks.push({
          chunk: c.chunk,
          embedding: c.embedding,
          source: `Website: ${site.url}`,
        });
      }
    }
    for (const pdf of pdfs) {
      allChunks.push({
        chunk: pdf.chunk,
        embedding: pdf.embedding,
        source: `PDF: ${pdf.pdfName}`,
      });
    }

    const qEmbResp = await openaiClient.embeddings.create({
      model: "text-embedding-3-small",
      input: userText,
    });
    const qEmbedding = qEmbResp.data[0].embedding;

    const scored = allChunks.map((c) => ({
      ...c,
      score: cosineSimilarity(qEmbedding, c.embedding),
    }));

    const topChunks = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_K)
      .map((c) => `${c.source}:\n${c.chunk}`)
      .join("\n\n");

    const prompt = `
You are an AI assistant.
Use the following combined content from articles, websites, and PDFs if it is relevant to answer the question. 

Relevant training content:
${topChunks || "No relevant context found."}

Rules:
- Only use the above training content.
- Never guess or make assumptions beyond the provided content.
- If the content above does not contain the answer, reply with exactly:
  "Sorry, I am not yet trained for this data."
- Keep the response short, clear, and conversational.

User question: ${userText}
`;

    const { textStream } = await streamText({
      model: openai("gpt-4o-mini"),
      prompt,
    });

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

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: any) {
    console.error("Error in training route:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
