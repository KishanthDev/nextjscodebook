import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { extractDataFromInvoice } from "@/lib/invoice";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "uploads");
    const uploadPath = path.join(uploadDir, file.name);

    // Ensure uploads directory exists
    await writeFile(uploadPath, buffer);

    const result = await extractDataFromInvoice(uploadPath);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Invoice extraction error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
