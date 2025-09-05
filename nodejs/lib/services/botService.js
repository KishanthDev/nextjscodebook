const fs = require('fs').promises;
const path = require('path');

const BOTS_PATH = path.join(process.cwd(), 'data', 'bots.json');

const loadJson = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
};

const saveJson = async (filePath, data) => {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

class BotService {
  static async addBot(botData) {
    let bots = await loadJson(BOTS_PATH);

    const newBot = {
      _id: Date.now().toString(), // simple unique id
      name: botData.name,
      type: botData.type || 'json', // default type
      createdAt: new Date().toISOString(),
    };

    bots.push(newBot);
    await saveJson(BOTS_PATH, bots);

    return newBot;
  }

  static async getBots() {
    return await loadJson(BOTS_PATH);
  }
}

module.exports = { BotService };
