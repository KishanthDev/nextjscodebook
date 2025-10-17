import { NextResponse } from "next/server";

const BACKEND_BASE_URL = "https://zotlyadminapis-39lct.ondigitalocean.app/zotlyadmin/chatwidgets";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Forward to backend save endpoint
    const res = await fetch(
      `${BACKEND_BASE_URL}/save`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to create widget", message: data }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("API /config POST error:", err);
    return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) return NextResponse.json({ error: "Widget ID required" }, { status: 400 });

    const res = await fetch(
      `${BACKEND_BASE_URL}/delete/${id}`,
      { method: "DELETE" }
    );

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text; // fallback if non-JSON
    }

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to delete widget", message: data }, { status: res.status });
    }

    return NextResponse.json({ success: true, message: data });
  } catch (err: any) {
    console.error("API /config DELETE error:", err);
    return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
  }
}



export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(
      `${BACKEND_BASE_URL}/update`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const resultText = await res.text();
    let data;
    try { data = JSON.parse(resultText); } catch { data = resultText; }

    if (!res.ok) return NextResponse.json({ error: "Update failed", message: data }, { status: res.status });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("API /config PUT error:", err);
    return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
  }
}
