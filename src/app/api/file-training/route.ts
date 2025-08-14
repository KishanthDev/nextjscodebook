// src/app/api/file-training/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import pdfParse from "pdf-parse";
import { openai } from "@/lib/openai";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("zotly_sb"); // Use same DB as stats API
        
        // Collections
        const qaCollection = db.collection("qa");
        const embeddingsCollection = db.collection("embeddings");
        const settingsCollection = db.collection("settings");

        // Get uploaded file
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ 
                error: "No file uploaded",
                result: null 
            }, { status: 400 });
        }

        // Validate file type
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json({ 
                error: "Only PDF files are supported",
                result: null 
            }, { status: 400 });
        }

        // Extract text from PDF
        const buffer = Buffer.from(await file.arrayBuffer());
        const pdfData = await pdfParse(buffer);
        const text = pdfData.text.trim();

        if (!text || text.length < 10) {
            return NextResponse.json({ 
                error: "No meaningful text found in PDF",
                result: null 
            }, { status: 400 });
        }

        // Create chunks if text is too long (for better embedding performance)
        const maxChunkSize = 8000;
        const chunks = [];
        
        if (text.length > maxChunkSize) {
            for (let i = 0; i < text.length; i += maxChunkSize) {
                chunks.push(text.substring(i, i + maxChunkSize));
            }
        } else {
            chunks.push(text);
        }

        // Generate unique embedding ID for this file
        const embeddingId = new ObjectId().toString();
        const fileKey = file.name; // Use filename as key

        // Process each chunk
        const embeddingPromises = chunks.map(async (chunk, index) => {
            // Create embedding for this chunk
            const embeddingResponse = await openai.embeddings.create({
                model: "text-embedding-3-large",
                input: chunk,
            });

            const embedding = embeddingResponse.data[0].embedding;

            // Store in embeddings collection
            const embeddingDoc = {
                embedding_id: embeddingId,
                text: chunk,
                embedding: embedding,
                chunk_index: index,
                source_file: file.name,
                created_at: new Date(),
            };

            await embeddingsCollection.insertOne(embeddingDoc);

            return embeddingDoc;
        });

        const embeddingResults = await Promise.all(embeddingPromises);

        // Store summary in QA collection (for backward compatibility)
        const qaResult = await qaCollection.insertOne({
            question: `PDF File Content: ${file.name}`,
            answer: text.length > 500 ? text.slice(0, 500) + "..." : text,
            language: "",
            embedding: embeddingResults[0]?.embedding, // Use first chunk's embedding
            fileName: file.name,
            fileSize: file.size,
            chunkCount: chunks.length,
            embeddingId: embeddingId,
            createdAt: new Date(),
        });

        // Update embedding sources in settings collection
        const currentSources = await settingsCollection.findOne({ name: "embedding-sources" });
        const sourcesData = currentSources?.value || {};

        // Add this file to the sources
        if (!sourcesData[fileKey]) {
            sourcesData[fileKey] = [];
        }
        sourcesData[fileKey].push(embeddingId);

        // Update or create the settings document
        await settingsCollection.updateOne(
            { name: "embedding-sources" },
            { 
                $set: { 
                    name: "embedding-sources",
                    value: sourcesData,
                    updated_at: new Date()
                }
            },
            { upsert: true }
        );

        // Calculate total text length for response
        const totalTextLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);

        return NextResponse.json({
            message: "PDF processed and stored successfully",
            result: `✅ Successfully processed "${file.name}"\n📄 Document ID: ${qaResult.insertedId}\n📊 Text extracted: ${totalTextLength} characters\n🔗 Created ${chunks.length} embedding chunks\n📋 Embedding ID: ${embeddingId}\n🗃️ Registered in embedding sources`,
            savedId: qaResult.insertedId,
            embeddingId: embeddingId,
            fileName: file.name,
            textLength: totalTextLength,
            chunkCount: chunks.length,
            success: true
        });

    } catch (error: any) {
        console.error("File processing error:", error);
        
        return NextResponse.json({
            error: error.message || "Internal server error",
            result: null,
            success: false
        }, { status: 500 });
    }
}
