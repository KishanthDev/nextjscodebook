require('dotenv').config();
const fs = require('fs').promises;

const express = require('express');
const multer = require('multer');
const { QaService } = require('./lib/services/qa');
const { WebsiteService } = require('./lib/services/websiteService'); // new import
const { PdfService } = require('./lib/services/pdf');

const app = express();
app.use(express.json());


// QA endpoint
app.post("/api/qa", async (req, res) => {
  try {
    const { botId, question, answer } = req.body;
    if (!botId || !question || !answer) {
      return res.status(400).json({
        error: "Bot ID, question, and answer are required.",
      });
    }

    // ✅ embedding handled inside QaService
    const result = await QaService.saveQA(botId, question, answer);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});


// WEBSITE: Train/Post endpoint
app.post('/api/websites', async (req, res) => {
  try {
    const { botId, url } = req.body;
    if (!botId || !url)
      return res.status(400).json({ error: "Bot ID and url are required." });

    const result = await WebsiteService.trainSite(botId, url); // will scrape, chunk, embed, and save
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// WEBSITE: Get endpoint
app.get('/api/websites', async (req, res) => {
  try {
    const botId = req.query.botId;
    if (!botId)
      return res.status(400).json({ error: "Missing botId" });

    const sites = await WebsiteService.getSites(botId);
    return res.json(sites);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});


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

    // Optionally delete file after processing
    await fs.unlink(filePath);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
