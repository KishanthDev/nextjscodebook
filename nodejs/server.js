require('dotenv').config();
const fs = require('fs').promises;
const express = require('express');
const multer = require('multer');

const { QaService } = require('./lib/services/qa');
const { WebsiteService } = require('./lib/services/websiteService');
const { PdfService } = require('./lib/services/pdf');
const { ChatService } = require("./lib/services/chatService");
const { BotService } = require('./lib/services/botService');

const app = express();
app.use(express.json());

/* ===========================
   QA ROUTE
=========================== */

app.post("/api/qa", async (req, res) => {
  try {
    const { botId, question, answer } = req.body;
    if (!botId || !question || !answer) {
      return res.status(400).json({
        error: "Bot ID, question, and answer are required.",
      });
    }
    const result = await QaService.saveQA(botId, question, answer);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

/* ===========================
   WEBSITE ROUTES
=========================== */

app.post('/api/websites', async (req, res) => {
  try {
    const { botId, url } = req.body;
    if (!botId || !url)
      return res.status(400).json({ error: "Bot ID and url are required." });

    const result = await WebsiteService.trainSite(botId, url);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

app.get('/api/websites', async (req, res) => {
  try {
    const botId = req.query.botId;
    if (!botId) return res.status(400).json({ error: "Missing botId" });

    const sites = await WebsiteService.getSites(botId);
    return res.json(sites);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

/* ===========================
   PDF ROUTE
=========================== */

const upload = multer({ dest: 'uploads/' });
app.post('/api/pdf', upload.single('file'), async (req, res) => {
  try {
    const botId = req.body.botId;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (!botId) return res.status(400).json({ error: "Bot ID is required" });

    const filePath = file.path;
    const pdfName = file.originalname;
    const result = await PdfService.uploadPdf(filePath, pdfName, botId);

    // delete temp file
    await fs.unlink(filePath);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

/* ===========================
   CHAT ROUTE
=========================== */

app.post("/api/chat", async (req, res) => {
  try {
    const { botId, text } = req.body;
    if (!botId || !text) {
      return res.status(400).json({ error: "Bot ID and text are required" });
    }

    const { textStream } = await ChatService.chat(botId, text);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    for await (const chunk of textStream) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    console.error("Chat route error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

/* ===========================
   BOT ROUTES
=========================== */

app.post("/api/bots", async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Bot name is required' });
    }

    const bot = await BotService.addBot({ name, type });
    return res.status(201).json(bot);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/bots", async (req, res) => {
  try {
    const bots = await BotService.getBots();
    return res.json(bots);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

/* ===========================
   START SERVER
=========================== */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
