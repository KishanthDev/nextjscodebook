import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ARTICLES_PATH = path.join(process.cwd(), "data", "articles.json");
const BOTS_PATH = path.join(process.cwd(), "data", "bots.json");

export class ArticleService {
  // ---------- Helpers ----------
  private loadJson(file: string) {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return [];
    }
  }

  private saveJson(file: string, data: any) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }

  private isJsonBot(botId: string) {
    const bots = this.loadJson(BOTS_PATH);
    return bots.some((b: any) => b._id === botId);
  }

  private async formatArticle(data: any, withEmbedding = true) {
    let embedding: number[] = [];
    if (withEmbedding && data.content) {
      const emb = await openaiClient.embeddings.create({
        model: "text-embedding-3-small",
        input: data.content,
      });
      embedding = emb.data[0].embedding as number[];
    }

    return {
      botId: data.botId,
      title: data.title || "",
      content: data.content || "",
      link: data.link || "",
      parent_category: data.parent_category || "General",
      categories: Array.isArray(data.categories) ? data.categories : [],
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date(),
      embedding,
    };
  }

  // ---------- CRUD ----------
  async getArticles(botId?: string, id?: string) {
    if (botId && this.isJsonBot(botId)) {
      const all = this.loadJson(ARTICLES_PATH);
      if (id) return all.find((a: any) => a._id === id) || null;
      return all.filter((a: any) => a.botId === botId);
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    if (id) return await db.collection("articles").findOne({ _id: new ObjectId(id) });

    const filter: any = {};
    if (botId) filter.botId = botId;
    return db.collection("articles").find(filter).sort({ createdAt: -1 }).toArray();
  }

  async createArticle(rawData: any) {
    const data = await this.formatArticle(rawData, true);

    if (this.isJsonBot(rawData.botId)) {
      const articles = this.loadJson(ARTICLES_PATH);
      const newArticle = { _id: Date.now().toString(), ...data };
      articles.push(newArticle);
      this.saveJson(ARTICLES_PATH, articles);
      return newArticle;
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const result = await db.collection("articles").insertOne(data);
    return { _id: result.insertedId, ...data };
  }

  async updateArticle(id: string, updateData: any) {
    const data = await this.formatArticle(updateData, true);

    if (this.isJsonBot(updateData.botId)) {
      const articles = this.loadJson(ARTICLES_PATH);
      const idx = articles.findIndex((a: any) => a._id === id);
      if (idx === -1) return null;
      articles[idx] = { ...articles[idx], ...data, _id: id };
      this.saveJson(ARTICLES_PATH, articles);
      return articles[idx];
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const result = await db
      .collection("articles")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data }, { returnDocument: "after" });

    return result?.value || null;
  }

  async deleteArticle(id: string, botId: string) {
    if (this.isJsonBot(botId)) {
      const articles = this.loadJson(ARTICLES_PATH);
      const updated = articles.filter((a: any) => a._id !== id);
      this.saveJson(ARTICLES_PATH, updated);
      return updated.length < articles.length;
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const result = await db.collection("articles").deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}
