"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // new state
  const router = useRouter();

  const fetchUrls = async () => {
    const res = await fetch("/api/url/url-list");
    const data = await res.json();
    setUrls(data.urls || []);
  };

  useEffect(() => { fetchUrls(); }, []);

  const handleUpload = async () => {
    if (!url) return;
    setError("");
    setLoading(true); // disable button
    try {
      const res = await fetch("/api/url/url-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        setUrl("");
        fetchUrls();
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false); // enable button
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="border p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-3">Upload Website URL</h2>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full border p-2 rounded-lg"
        />
        <button
          onClick={handleUpload}
          disabled={loading} // disable during upload
          className={`mt-3 px-4 py-2 text-white rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      <div className="border p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-3">Uploaded Websites</h2>
        {urls.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">URL</th>
                <th className="p-2">AI</th>
              </tr>
            </thead>
            <tbody>
              {urls.map(u => (
                <tr key={u} className="border-b">
                  <td className="p-2">{u}</td>
                  <td className="p-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      onClick={() => router.push(`/ai-agent-website?url=${encodeURIComponent(u)}`)}
                    >
                      Go
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No websites uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
