import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { OpenAI } from "openai";
import { cosineSimilarity } from "@/lib/similarity";
// import { getIntentsClient } from "@/lib/dialogflow";

// const intentsClient = getIntentsClient();
// const projectId = process.env.DIALOGFLOW_PROJECT_ID as string; 
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const TOP_K = 5;

// --------------- Helper: Check Dialogflow intents -----------------
// async function findIntentResponse(userText: string) {
//   const agentPath = intentsClient.projectAgentPath(projectId);
//   const [intents] = await intentsClient.listIntents({ parent: agentPath });

//   for (const intent of intents) {
//     // Match WELCOME event
//     if (intent.events?.includes("WELCOME") && /hi|hello|hey/i.test(userText)) {
//       return intent.messages?.[0]?.text?.text?.[0] || null;
//     }

//     // Match training phrases
//     for (const phrase of intent.trainingPhrases || []) {
//       const text = (phrase.parts ?? []).map((p: any) => p.text).join("");
//       if (text && userText.toLowerCase().includes(text.toLowerCase())) {
//         return intent.messages?.[0]?.text?.text?.[0] || null;
//       }
//     }
//   }

//   return null;
// }

// ------------------ Chat Handler -----------------------
export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const userText = text;

    // ----- 1️⃣ Try Dialogflow intents first -----
    // const intentResponse = await findIntentResponse(userText);
    // if (intentResponse) {
    //   return new Response(new TextEncoder().encode(intentResponse), {
    //     headers: { "Content-Type": "text/plain; charset=utf-8" },
    //   });
    // } 

    // ----- 2️⃣ Q&A pairs with embeddings -----
    const client = await clientPromise;
    const db = client.db("mydb");
    const qaPairs = await db.collection("qa_pairs").find({}).toArray();

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

    // ----- 3️⃣ Fall back to websites + PDFs -----
    const sites = await db.collection("websites").find({}).toArray();
    const pdfs = await db.collection("pdf_embeddings").find({}).toArray();

    if (!sites.length && !pdfs.length) {
      return NextResponse.json(
        { error: "No training data found (websites, PDFs, or Q&A)" },
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
Use the following combined content from both websites and PDFs if it is relevant to answer the question. 

Relevant training content:
${topChunks || "No relevant context found."}

Rules:
- Only use the above training content (both websites + PDFs).
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
