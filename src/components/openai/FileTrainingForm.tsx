"use client";
import { useState, useRef } from "react";

export default function FileTrainingForm() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setError(null);

    if (!fileInputRef.current?.files?.length) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);

    try {
      const res = await fetch("/api/file-training", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to train file.");
      } else {
        // Updated to handle actual API response structure
        const successMessage = data.message || "File processed successfully";
        const details = data.savedId ? `\nDocument ID: ${data.savedId}` : "";
        const textInfo = data.textLength ? `\nText length: ${data.textLength} characters` : "";
        
        setResult(`${successMessage}${details}${textInfo}`);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>AI File Training</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="file">Select a file to train:</label>
        <br />
        <input 
          type="file" 
          id="file" 
          name="file" 
          ref={fileInputRef} 
          accept=".txt,.doc,.docx,.pdf" 
        />
        <br />
        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Uploading & Training..." : "Upload & Train"}
        </button>
      </form>

      {error && (
        <div style={{ color: "red", marginTop: 20, padding: 10, backgroundColor: "#ffebee", border: "1px solid #f44336", borderRadius: 4 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Training Result:</h3>
          <div style={{ 
            whiteSpace: "pre-wrap", 
            backgroundColor: "#f0f8ff", 
            padding: 15, 
            border: "1px solid #007acc",
            borderRadius: 4,
            color: "#333"
          }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
