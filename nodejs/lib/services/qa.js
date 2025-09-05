const fs = require("fs").promises;
const path = require("path");
const { createEmbedding } = require("../embedding"); // ✅ use helper

const BOTS_PATH = path.join(process.cwd(), "data", "bots.json");
const QA_PATH = path.join(process.cwd(), "data", "qa_pairs.json");

async function loadJson(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveJson(filePath, data) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

class QaService {
  static async saveQA(botId, question, answer) {
    const bots = await loadJson(BOTS_PATH);
    const bot = bots.find((b) => b._id === botId);
    if (!bot) throw new Error(`Bot with ID ${botId} not found`);

    // ✅ generate embedding inside the service
    const embedding = await createEmbedding(question);

    const qaPairs = await loadJson(QA_PATH);
    const existingIndex = qaPairs.findIndex(
      (q) => q.botId === botId && q.question === question
    );

    if (existingIndex >= 0) {
      qaPairs[existingIndex] = {
        ...qaPairs[existingIndex],
        answer,
        embedding,
        updatedAt: new Date().toISOString(),
      };
    } else {
      qaPairs.push({
        botId,
        question,
        answer,
        embedding,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    await saveJson(QA_PATH, qaPairs);
    return { success: true, storage: "json" };
  }
}

module.exports = { QaService };
