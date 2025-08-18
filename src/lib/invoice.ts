import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import pdfParse from "pdf-parse";
import { readFile } from "fs/promises";

const model = openai("gpt-4o-mini");

export const invoiceSchema = z.object({
  total: z.number().optional(),
  currency: z.string().optional(),
  invoiceNumber: z.string().optional(),
  companyAddress: z.string().optional(),
  companyName: z.string().optional(),
  invoiceeAddress: z.string().optional(),
});

export async function extractDataFromInvoice(invoicePath: string) {
  const pdfBuffer = await readFile(invoicePath);
  const { text: rawText } = await pdfParse(pdfBuffer);

  const { object } = await generateObject({
    model,
    schema: invoiceSchema,
    system: `
You will receive raw text extracted from an invoice PDF.
Extract the structured fields: total, currency, invoiceNumber,
companyName, companyAddress, and invoiceeAddress.
    `,
    prompt: rawText,
  });

  return object;
}
