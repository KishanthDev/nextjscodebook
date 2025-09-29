import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  uploadFile,
  createAssistant,
  createThread,
  runThread,
  pollRunStatus,
  getMessages,
  addMessage,
} from "@/components/ai-assistant/assistant";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Predefine mapping: user → assistant
const USER_TO_AI: Record<string, string> = {
  user1: "Nexa",
  user2: "Luma",
  user3: "AssistIQ",
  user4: "Milo",
};

// Memory (you might move this into DB/Redis in production)
const assistants: Record<string, { id: string; threadId: string }> = {};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const user = data.user as string;
    const message = (data.message as string) || "Hello!";
    const file = null; // you can add file support later

    const aiName = USER_TO_AI[user];
    if (!aiName) {
      return NextResponse.json({ error: "Unknown user" }, { status: 400 });
    }

    // Initialize assistant + thread if not yet created
    if (!assistants[aiName]) {
      const fileId = file ? await uploadFile(file, openai) : undefined;
      const assistantId = await createAssistant(openai, fileId ? [fileId] : [], aiName);
      const threadId = await createThread(openai, "", "Conversation started");
      assistants[aiName] = { id: assistantId, threadId };
    }

    const { id: assistantId, threadId } = assistants[aiName];

    // Add user message to thread
    await addMessage(openai, threadId, message);

    // Run the thread
    const runId = await runThread(openai, threadId, assistantId);
    await pollRunStatus(openai, threadId, runId);

    // Fetch responses
    const messages = await getMessages(openai, threadId);
    const simplified = messages.data.map((m) => ({
      id: m.id,
      role: m.role,
      content: Array.isArray(m.content)
        ? m.content.map((c: any) => (c.type === "text" ? c.text.value : "")).join("\n")
        : "",
    }));

    return NextResponse.json({ assistant: aiName, messages: simplified });
  } catch (err: any) {
    console.error("Assistant API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
