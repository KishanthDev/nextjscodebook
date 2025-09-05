const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const { createEmbedding } = require('../embedding');

// Paths for JSON data files
const WEBSITES_PATH = path.join(process.cwd(), 'data', 'websites.json');
const BOTS_PATH = path.join(process.cwd(), 'data', 'bots.json');

// Utilities for JSON read/write
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

// Utility to check if bot is a JSON bot
const isJsonBot = async (botId) => {
  const bots = await loadJson(BOTS_PATH);
  return bots.some(b => b._id === botId);
};

// Simple slug normalization
const normalizeUrl = (url) => url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-');

// Chunk text with a max length, no overlap
const chunkText = (text, maxLen = 200) => {
  const words = text.split(' ');
  let chunks = [], chunk = [];
  for (let word of words) {
    if ((chunk.join(' ').length + word.length + 1) > maxLen && chunk.length) {
      chunks.push(chunk.join(' '));
      chunk = [];
    }
    chunk.push(word);
  }
  if (chunk.length) chunks.push(chunk.join(' '));
  return chunks;
};

class WebsiteService {
  // Get all websites for a bot (JSON only)
  static async getSites(botId) {
    const websites = await loadJson(WEBSITES_PATH);
    return websites
      .filter(w => w.botId === botId)
      .map(u => ({
        url: u.url,
        slug: u.slug,
        createdAt: u.uploadedAt
      }));
  }

  // Scrape, chunk, embed, and save a website for a bot (JSON only)
  static async trainSite(botId, url) {
    // Validate bot
    if (!(await isJsonBot(botId))) {
      throw new Error(`Bot not found: ${botId}`);
    }
    // Validate URL
    let page;
    try {
      page = new URL(url);
    } catch {
      throw new Error('Invalid URL format');
    }
    // Fetch HTML
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch HTML (${res.status})`);
    const html = await res.text();
    const $ = cheerio.load(html);

    // Clean up document
    $('style, script').remove();
    $('br').replaceWith('\n');

    // Detect language
    const langAttr = $('html').attr('lang') || '';
    const language = langAttr.trim().toLowerCase() || 'en';

    // Extract paragraphs/headings
    const paragraphs = [];
    const seen = new Set();
    $('p, h1, h2, h3, h4, h5, h6').each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text.length > 20 && !seen.has(text)) {
        seen.add(text);
        paragraphs.push(text);
      }
    });
    if (paragraphs.length === 0) {
      const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
      if (bodyText.length > 20) paragraphs.push(bodyText);
    }

    // Chunk & embed
    const chunkDocs = [];
    for (const para of paragraphs) {
      const chunks = chunkText(para, 200);
      for (const chunk of chunks) {
        const embedding = await createEmbedding(chunk);
        chunkDocs.push({ chunk, embedding });
      }
    }

    const siteDoc = {
      url,
      slug: normalizeUrl(url),
      botId,
      language,
      chunks: chunkDocs,
      uploadedAt: new Date().toISOString()
    };

    // Save (max 10 per bot)
    let websites = await loadJson(WEBSITES_PATH);
    websites.push(siteDoc);
    const botSites = websites.filter(w => w.botId === botId);
    if (botSites.length > 10) {
      const toRemove = botSites
        .sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt))
        .slice(0, botSites.length - 10);
      websites = websites.filter(w => !toRemove.includes(w));
    }
    await saveJson(WEBSITES_PATH, websites);

    return {
      url,
      slug: siteDoc.slug,
      chunks: chunkDocs.length
    };
  }
}

module.exports = { WebsiteService };
