// lib/services/pdf.js
const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');

const CHUNK_SIZE = 500; // words per chunk
const BOTS_PATH = path.join(process.cwd(), "data", "bots.json");
const PDF_PATH = path.join(process.cwd(), "data", "pdf_embeddings.json");

// Simple JSON helpers
const loadJson = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) { if (err.code === 'ENOENT') return []; throw err; }
};
const saveJson = async (filePath, data) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};
// Check bot existence
const isJsonBot = async (botId) => {
  const bots = await loadJson(BOTS_PATH);
  return bots.some(b => b._id === botId);
};
// Embedding helper
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const createEmbedding = async (text) => {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float'
  });
  return res.data[0].embedding;
};
// Chunk PDF to array of strings
const chunkPdf = async (buffer) => {
  const pdfData = await pdfParse(buffer);
  const words = pdfData.text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    chunks.push(words.slice(i, i + CHUNK_SIZE).join(" "));
  }
  return chunks;
};

class PdfService {
  static async uploadPdf(filePath, pdfName, botId) {
    // Check bot existence
    if (!(await isJsonBot(botId)))
      return { success: false, message: "Bot not found", filename: pdfName };
    const buffer = await fs.readFile(filePath);
    const chunks = await chunkPdf(buffer);

    const pdfs = await loadJson(PDF_PATH);
    // Prevent duplicate
    if (pdfs.some((p) => p.botId === botId && p.pdfName === pdfName))
      return { success: false, message: "File already uploaded", filename: pdfName };

    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk);
      pdfs.push({
        _id: Date.now().toString(),
        botId,
        pdfName,
        chunk,
        embedding,
        uploadedAt: new Date(),
      });
    }
    await saveJson(PDF_PATH, pdfs);
    return { success: true, filename: pdfName, botId };
  }
}

module.exports = { PdfService };
