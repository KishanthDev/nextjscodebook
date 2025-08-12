// app/api/audio-to-text/route.js
import { transcribeAudio } from "@/lib/openai";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio");
    const language = formData.get("language") || undefined;

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save to a temporary file
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "upload-"));
    const filePath = path.join(tempDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const transcription = await transcribeAudio(filePath, language);

    await fs.unlink(filePath); // cleanup
    return NextResponse.json({ text: transcription });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
