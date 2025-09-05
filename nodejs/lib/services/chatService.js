const { createEmbedding } = require("../embedding");
const { cosineSimilarity } = require("../similarity");
const { openai } = require("@ai-sdk/openai");
const { streamText } = require("ai");

const QaService = require("./qa").QaService;
const WebsiteService = require("./websiteService").WebsiteService;
const PdfService = require("./pdf").PdfService;

const TOP_K = 5;

class ChatService {
  static async chat(botId, userText) {
    // Get data for bot
    const qaPairs = await QaService.getQA(botId);
    const sites = await WebsiteService.getSites(botId);
    const pdfs = await PdfService.getPdfs(botId);

    // Step 1: Try Q&A
    const qEmbedding = await createEmbedding(userText);
    let bestQA = null, bestQAScore = -Infinity;

    qaPairs.forEach((pair) => {
      if (!pair.embedding) return;
      const score = cosineSimilarity(pair.embedding, qEmbedding);
      if (score > bestQAScore) {
        bestQA = pair;
        bestQAScore = score;
      }
    });

    if (bestQA && bestQAScore > 0.6) {
      return { textStream: (async function* () { yield bestQA.answer; })() };
    }

    // Step 2: Search sites + pdfs
    const allChunks = [];

    sites.forEach((site) => {
      (site.chunks || []).forEach((c) => {
        allChunks.push({
          chunk: c.chunk,
          embedding: c.embedding,
          source: `Website: ${site.url}`,
        });
      });
    });

    pdfs.forEach((pdf) => {
      allChunks.push({
        chunk: pdf.chunk,
        embedding: pdf.embedding,
        source: `PDF: ${pdf.pdfName}`,
      });
    });

    if (!allChunks.length) {
      return {
        textStream: (async function* () {
          yield "Sorry, I am not yet trained for this data.";
        })(),
      };
    }

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
Use the following context from Q&A, Websites, and PDFs to answer the user's question.

Relevant context:
${topChunks || "No relevant context found."}

Rules:
- ONLY use the above context.
- If the context doesn’t have the answer, reply: "Sorry, I am not yet trained for this data."
- Format clearly in Markdown with headings, bullet points, and emojis.

User question: ${userText}
`;

    return streamText({
      model: openai("gpt-4o-mini"),
      prompt,
    });
  }
}

module.exports = { ChatService };
