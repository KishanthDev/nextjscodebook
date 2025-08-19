"use client";
export const dynamic = "force-dynamic";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AIPageContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  const handleAsk = async () => {
  if (!question) return;

  setAnswer("");
  setLoading(true);

  try {
    const res = await fetch("/api/url/ai-ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, url }), // ✅ FIXED
    });

    if (!res.body) throw new Error("No response body.");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        setAnswer(prev => prev + chunk);
      }
    }

    setLoading(false);
  } catch (err: any) {
    setAnswer(err.message || "Error occurred.");
    setLoading(false);
  }
};


  // Scroll to answer automatically
  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.scrollTop = answerRef.current.scrollHeight;
    }
  }, [answer]);

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
        className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        disabled={loading || !question}
      >
        {loading ? "Thinking..." : "Send"}
      </button>

      <div
        ref={answerRef}
        className="mt-4 p-3 bg-gray-100 rounded-lg max-h-96 overflow-y-auto whitespace-pre-wrap"
      >
        {answer || <em>Answer will appear here...</em>}
      </div>
    </div>
  );
}

export default function AIPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AIPageContent />
    </Suspense>
  );
}
