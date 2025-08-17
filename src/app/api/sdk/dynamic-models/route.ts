import { generateText, type LanguageModel } from "ai";
//import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

// A reusable function to call any provider + model
export async function ask(prompt: string, model: LanguageModel) {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
}

// Example usage:
async function example() {
  const prompt = "Tell me a story about your grandmother.";

  // Use Anthropic Claude
//  const anthroStory = await ask(prompt, anthropic("claude-3-haiku-20240307"));
//  console.log("Anthropic:", anthroStory);

  // Use OpenAI GPT
  const openaiStory = await ask(prompt, openai("gpt-4o-mini"));
  console.log("OpenAI:", openaiStory);
}

example().catch(console.error);
