import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { OpenAI } from "openai";

export async function POST(request: Request) {
    try {
        const { qaPairs, language } = await request.json();

        if (!Array.isArray(qaPairs) || qaPairs.length === 0) {
            return NextResponse.json({ error: "Invalid or empty qaPairs" }, { status: 400 });
        }

        // Connect to MongoDB and get collections
        const client = await clientPromise;
        const db = client.db("zotly_sb"); // Replace with your DB name
        const qeaCollection = db.collection("qea_embeddings");

        // Filter out duplicates already in DB by question
        const existingQuestions = await qeaCollection.find({
            question: { $in: qaPairs.map((q: any) => q[0]) },
        }).project({ question: 1 }).toArray();

        const existingQuestionsSet = new Set(existingQuestions.map(q => q.question));

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

        // Insert new QA pairs
        await qeaCollection.insertMany(newEntries);

        // Optionally generate embeddings here with OpenAI embedding API for each question and store alongside
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY!,
        });

        for (const entry of newEntries) {
            const embeddingResponse = await openai.embeddings.create({
                model: "text-embedding-3-large",
                input: entry.question,
            });

            // Save embedding vector to the document
            if (embeddingResponse.data.length > 0) {
                await qeaCollection.updateOne(
                    { question: entry.question },
                    { $set: { embedding: embeddingResponse.data[0].embedding } }
                );
            }
        }

        return NextResponse.json({ success: true, inserted: newEntries.length });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
