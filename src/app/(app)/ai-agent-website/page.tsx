"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AIPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setAnswer("");
    const res = await fetch("/api/url/ai-ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, url }),
    });
    const data = await res.json();
    setAnswer(data.answer || "No answer found.");
    setLoading(false);
  };

  if (!url) return <p className="p-6">No website selected.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">AI for: {url}</h2>
      <textarea
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Type a greeting or question..."
        className="w-full border p-2 rounded-lg"
      />
      <button
        onClick={handleAsk}
        className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        disabled={loading || !question}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
      {answer && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
