// /lib/trainUrl.ts
import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import { createEmbedding } from "./openai";

/**
 * Extracts clean paragraphs from a given webpage
 */
export async function extractParagraphsFromUrl(url: string): Promise<string[]> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    let paragraphs: string[] = [];

    $("p, h1, h2, h3, li").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 30 && /\s/.test(text)) {
            paragraphs.push(text);
        }
    });

    // Deduplicate & clean
    paragraphs = [...new Set(paragraphs.map(p => p.replace(/\s+/g, " ").trim()))];
    return paragraphs;
}

/**
 * Save embeddings to file system
 */
export function saveEmbeddings(url: string, paragraphs: string[], vectors: number[][]) {
    const folder = path.join(process.cwd(), "embeddings");
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    const fileSafe = url.replace(/[^a-z0-9]/gi, "_").substring(0, 50);
    const filePath = path.join(folder, `embeddings-${fileSafe}.json`);

    const data = paragraphs.map((p, i) => ({
        text: p,
        embedding: vectors[i],
        source: url
    }));

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return filePath;
}

/**
 * Train from URL -> scrape, embed, save
 */
export async function trainUrl(url: string) {
    const paragraphs = await extractParagraphsFromUrl(url);
    if (!paragraphs.length) throw new Error("No valid paragraphs extracted");

    // ✅ use the central embedding helper
    const vectors = await createEmbedding(paragraphs);

    const filePath = saveEmbeddings(url, paragraphs, vectors as number[][]);

    return {
        status: "success",
        paragraphs: paragraphs.length,
        file: filePath
    };
}
