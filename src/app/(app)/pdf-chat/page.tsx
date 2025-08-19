"use client";
import { useState, useEffect } from "react";

export default function PdfChat() {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string>("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [pdfs, setPdfs] = useState<string[]>([]);

  // Fetch PDFs from DB
  const fetchPdfs = async () => {
    const res = await fetch("/api/pdf-list");
    const data = await res.json();
    setPdfs(data.files || []);
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  // Upload PDF
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/pdf-upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setFilename(file.name);
      setUploaded(true);
      fetchPdfs(); // refresh list
    } else {
      setError(data.message || "Upload failed");
    }

    setUploading(false);
  };

  // Ask Question
  const handleAsk = async () => {
    if (!question || !filename) return;
    setLoading(true);
    setAnswer("");

    const res = await fetch("/api/pdf-ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, filename }),
    });

    const data = await res.json();
    setAnswer(data.answer || "No answer found.");
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Top: Upload + List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="border p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-3">Upload PDF</h2>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

          {uploaded && (
            <p className="text-green-600 mt-2">✅ {filename} uploaded</p>
          )}
          {error && <p className="text-red-600 mt-2">⚠️ {error}</p>}
        </div>

        {/* List PDFs in DB */}
        <div className="border p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-3">Uploaded PDFs</h2>
          {pdfs.length > 0 ? (
            <ul className="list-disc ml-5 space-y-1">
              {pdfs.map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No PDFs uploaded yet.</p>
          )}
        </div>
      </div>

      {/* Bottom: Q&A Section */}
      {pdfs.length > 0 && (
        <div className="border p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-3">Ask a Question</h2>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="w-full border p-2 rounded-lg"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !question}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>

          {answer && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <strong>Answer:</strong>
              <p>{answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
