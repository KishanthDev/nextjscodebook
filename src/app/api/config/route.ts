import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // We now send full array data from client
    const res = await fetch(
      "https://zotlyadminapis-39lct.ondigitalocean.app/zotlyadmin/chatwidgets/update",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body), // send full array
      }
    );

    // Try parsing as JSON safely
    const resultText = await res.text();
    let data;
    try {
      data = JSON.parse(resultText);
    } catch {
      // Fallback if it’s not JSON
      console.error("Non-JSON response:", resultText);
      return NextResponse.json(
        { error: "Invalid JSON from server", message: resultText },
        { status: 500 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Server error", message: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("API /config error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: err.message },
      { status: 500 }
    );
  }
}
