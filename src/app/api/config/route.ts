import { NextResponse } from "next/server";
import pool from "./db";

// ✅ GET all configs
export async function GET() {
  const client = await pool.connect();
  try {
    const [bubble, chatbar, chatwidget] = await Promise.all([
      client.query("SELECT data FROM bubble_config ORDER BY id ASC LIMIT 1"),
      client.query("SELECT data FROM chatbar_config ORDER BY id ASC LIMIT 1"),
      client.query("SELECT data FROM chatwidget_config ORDER BY id ASC LIMIT 1"),
    ]);

    return NextResponse.json({
      bubble: bubble.rows[0]?.data || {},
      chatbar: chatbar.rows[0]?.data || {},
      chatwidget: chatwidget.rows[0]?.data || {},
    });
  } catch (err: any) {
    console.error("GET /api/config error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}

// ✅ PUT to update one config
export async function PUT(req: Request) {
  const client = await pool.connect();
  try {
    const { type, data } = await req.json();

    if (!["bubble", "chatbar", "chatwidget"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const table = `${type}_config`;
    await client.query(`UPDATE ${table} SET data = $1, updated_at = NOW() WHERE id = 1`, [data]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT /api/config error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
