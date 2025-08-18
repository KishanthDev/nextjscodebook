// app/api/log/route.ts
import { NextResponse } from "next/server";
import { tool, generateText } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";

// Define the tool
const logToConsoleTool = tool({
  description: "Log a message to the console",
  inputSchema: z.object({
    message: z.string().describe("The message to log to the console"),
  }),
  // Note: args is always the schema type (here: { message: string })
  execute: async (args: { message: string }) => {
    console.log("📝 Tool executed:", args.message);
    // return the object matching the schema
    return { message: args.message };
  },
});

// API route handler
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { steps } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      system:
        `Your only role is to log messages to the console. ` +
        `Use the provided tool to log the prompt.`,
      tools: {
        logToConsole: logToConsoleTool,
      },
    });

    return NextResponse.json({
      toolCalls: steps[0]?.toolCalls ?? [],
    });
  } catch (error: any) {
    console.error("Tool API error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
