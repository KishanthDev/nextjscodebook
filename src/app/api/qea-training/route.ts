import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { OpenAI } from "openai";

export async function POST(request: Request) {
    try {
        const { qaPairs, language } = await request.json();

        if (!Array.isArray(qaPairs) || qaPairs.length === 0) {
            return NextResponse.json({ error: "Invalid or empty qaPairs" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("zotly_sb");
        const qeaCollection = db.collection("qea_embeddings");
        const settingsCollection = db.collection("settings");

        // Find duplicates
        const existingQuestions = await qeaCollection.find({
            question: { $in: qaPairs.map((q: any) => q[0]) },
        }).project({ question: 1 }).toArray();

        const existingQuestionsSet = new Set(existingQuestions.map(q => q.question));

        // Filter new entries
        const newEntries = qaPairs
            .filter((pair: [string, string]) => pair[0] && pair[1] && !existingQuestionsSet.has(pair[0]))
            .map((pair: [string, string]) => ({
                question: pair[0],
                answer: pair[1].replace(/[\r\n]+/g, " ").trim(),
                language: language || "",
                createdAt: new Date(),
            }));

        if (newEntries.length === 0) {
            return NextResponse.json({ message: "No new QA pairs to train." });
        }

        // Insert into QEA
        await qeaCollection.insertMany(newEntries);

        // Create embeddings for each question
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

        for (const entry of newEntries) {
            const embeddingResponse = await openai.embeddings.create({
                model: "text-embedding-3-large",
                input: entry.question,
            });

            if (embeddingResponse.data.length > 0) {
                await qeaCollection.updateOne(
                    { question: entry.question },
                    { $set: { embedding: embeddingResponse.data[0].embedding } }
                );
            }
        }

        // 🔹 Update or create settings doc for Q&A
        await settingsCollection.updateOne(
            { key: "qa_settings" }, // unique key for Q&A settings
            {
                $set: {
                    key: "qa_settings",
                    lastUpdated: new Date(),
                    totalQuestions: await qeaCollection.countDocuments(),
                    languagesAvailable: await qeaCollection.distinct("language"),
                }
            },
            { upsert: true }
        );

        return NextResponse.json({ success: true, inserted: newEntries.length });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
