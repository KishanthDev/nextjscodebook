// utils/embeddings.ts
import path from 'path';
import { readFileSync, readdirSync, unlinkSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import axios from 'axios';

const EMBEDDINGS_DIR = path.join(process.cwd(), 'embeddings');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_EMBEDDINGS_MODEL = 'text-embedding-3-large'; // or "text-embedding-3-small"

/**
 * Call OpenAI API to create embeddings for array of texts.
 * Returns array of embedding vectors.
 */
export async function createEmbedding(texts: string[]): Promise<number[][]> {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API Key');
  }
  const url = 'https://api.openai.com/v1/embeddings';

  try {
    const res = await axios.post(
      url,
      {
        model: OPENAI_EMBEDDINGS_MODEL,
        input: texts,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data.map((item: any) => item.embedding);
    }
    throw new Error('Invalid OpenAI response');
  } catch (err: any) {
    console.error('OpenAI embeddings error:', err.message);
    throw err;
  }
}

/**
 * Retrieve all embeddings files and their data.
 */
export async function getAllEmbeddings(): Promise<{ fileName: string; data: any[] }[]> {
  if (!existsSync(EMBEDDINGS_DIR)) return [];

  const files = readdirSync(EMBEDDINGS_DIR).filter((f) => f.endsWith('.json'));
  const all: { fileName: string; data: any[] }[] = [];

  for (const file of files) {
    try {
      const contentRaw = readFileSync(path.join(EMBEDDINGS_DIR, file), 'utf8');
      const content = JSON.parse(contentRaw);
      all.push({ fileName: file, data: content });
    } catch (err) {
      console.warn(`Failed reading embeddings file ${file}:`, err);
    }
  }
  return all;
}

/**
 * Delete all embeddings files (reset training data).
 */
export async function deleteEmbeddings(): Promise<void> {
  if (!existsSync(EMBEDDINGS_DIR)) return;
  const files = readdirSync(EMBEDDINGS_DIR).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    try {
      unlinkSync(path.join(EMBEDDINGS_DIR, file));
    } catch {}
  }
}

/**
 * Save embeddings data explicitly (not needed in current but kept for extensibility)
 */
export async function saveEmbeddings(fileName: string, data: any[]): Promise<void> {
  if (!existsSync(EMBEDDINGS_DIR)) mkdirSync(EMBEDDINGS_DIR, { recursive: true });
  writeFileSync(path.join(EMBEDDINGS_DIR, fileName), JSON.stringify(data, null, 2));
}
