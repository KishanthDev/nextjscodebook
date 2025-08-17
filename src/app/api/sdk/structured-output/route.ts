// src/app/api/create-recipe/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

// ✅ Define your "small tool calling model" here
const smallToolCallingModel = openai("gpt-4o-mini");

// ✅ Schema for structured recipe output
const schema = z.object({
  recipe: z.object({
    name: z.string().describe("The name of the recipe"),
    ingredients: z
      .array(
        z.object({
          name: z
            .string()
            .describe(
              "The name of the ingredient (use British English, e.g., 'coriander' instead of 'cilantro')"
            ),
          amount: z.string().describe("The quantity of the ingredient"),
        })
      )
      .describe("The ingredients needed for the recipe"),
    steps: z.array(z.string()).describe("The steps to make the recipe"),
  }),
});

// ✅ API route
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { object } = await generateObject({
      model: smallToolCallingModel,
      schema,
      schemaName: "Recipe",
      system: "You are helping a user create a recipe. Use British English variants of ingredient names (e.g., coriander over cilantro).",
      prompt,
    });

    return NextResponse.json({ recipe: object.recipe });
  } catch (err: any) {
    console.error("❌ Error generating recipe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
