import { NextResponse } from "next/server";
import path from "path";
import { z } from "zod";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { writeFile } from "fs/promises";
import pdfParse from "pdf-parse";

const model = openai("gpt-4o-mini");

const schema = z.object({
  total: z.number().optional(),
  currency: z.string().optional(),
  invoiceNumber: z.string().optional(),
  companyAddress: z.string().optional(),
  companyName: z.string().optional(),
  invoiceeAddress: z.string().optional(),
});

export async function extractDataFromInvoice(invoicePath: string) {
  // Extract raw text from PDF
  const pdfBuffer = await (await import("fs/promises")).readFile(invoicePath);
  const pdfData = await pdfParse(pdfBuffer);

  const { object } = await generateObject({
    model,
    schema,
    system: `You will receive raw text extracted from an invoice PDF. 
Please extract the relevant structured fields like total, currency, 
invoiceNumber, company details, and invoicee details.`,
    prompt: pdfData.text, // Send only text, not full PDF
  });

  return object;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save temporarily
    const uploadPath = path.join(process.cwd(), "uploads", file.name);
    await writeFile(uploadPath, buffer);

    // Extract invoice data
    const result = await extractDataFromInvoice(uploadPath);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Invoice extraction error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
