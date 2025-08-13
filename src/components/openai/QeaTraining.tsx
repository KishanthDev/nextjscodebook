"use client";
import { useState } from "react";

export default function QeaTraining() {
  const [qaPairs, setQaPairs] = useState([{ question: "", answer: "" }, { question: "", answer: "" }, { question: "", answer: "" }]);
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (index: number, field: "question" | "answer", value: string) => {
    setQaPairs((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const filteredPairs = qaPairs.filter(pair => pair.question.trim() && pair.answer.trim());
    if (filteredPairs.length === 0) {
      setError("Please enter at least one question and answer.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/qea-training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qaPairs: filteredPairs.map(p => [p.question, p.answer]), language }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to train QEA.");
      } else {
        setResult(`Training completed. Inserted ${data.inserted} question-answer pairs.`);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Train QEA Embeddings</h2>
      <form onSubmit={handleSubmit}>
        {qaPairs.map((pair, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <label>Question {i+1}:</label><br />
            <textarea
              value={pair.question}
              onChange={(e) => handleInputChange(i, "question", e.target.value)}
              rows={2}
              style={{ width: "100%" }}
            />
            <label>Answer {i+1}:</label><br />
            <textarea
              value={pair.answer}
              onChange={(e) => handleInputChange(i, "answer", e.target.value)}
              rows={3}
              style={{ width: "100%" }}
            />
          </div>
        ))}
        <label>Language (optional):</label><br />
        <input
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="en, es, fr..."
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit" disabled={loading}>{loading ? "Training..." : "Train QEA"}</button>
      </form>
      {result && <p style={{ color: "green", marginTop: "1rem" }}>{result}</p>}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}
