import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const COLLECTION = "bots";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Bot name required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const result = await db.collection(COLLECTION).insertOne(body);

    return NextResponse.json({ _id: result.insertedId, ...body }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    const bots = await db.collection(COLLECTION).find({}).toArray();

    return NextResponse.json(bots);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
