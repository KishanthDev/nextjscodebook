"use client";

import { useEffect, useState } from "react";

type Intent = {
  name: string;
  displayName: string;
  trainingPhrases: { parts: { text: string }[] }[];
  messages: { text: { text: string[] } }[];
};

export default function IntentsPage() {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [trainingPhrases, setTrainingPhrases] = useState("");
  const [responses, setResponses] = useState("");

  useEffect(() => {
    fetchIntents();
  }, []);

  async function fetchIntents() {
    setLoading(true);
    try {
      const res = await fetch("/api/training/intents");
      const data = await res.json();
      setIntents(data);
    } catch (err) {
      console.error("Failed to load intents", err);
    } finally {
      setLoading(false);
    }
  }

  async function createIntent() {
    if (!displayName.trim()) return;

    const payload = {
      displayName,
      trainingPhrases: trainingPhrases.split(",").map((p) => p.trim()),
      responses: responses.split(",").map((r) => r.trim()),
    };

    try {
      const res = await fetch("/api/training/intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchIntents();
        setDisplayName("");
        setTrainingPhrases("");
        setResponses("");
      } else {
        console.error(await res.json());
      }
    } catch (err) {
      console.error("Error creating intent", err);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Intents Management</h1>

      {/* Create Intent Form */}
      <div className="p-4 border rounded-xl shadow mb-6 bg-white">
        <h2 className="text-lg font-semibold mb-3">Create New Intent</h2>
        <input
          type="text"
          placeholder="Intent Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />
        <textarea
          placeholder="Training Phrases (comma separated)"
          value={trainingPhrases}
          onChange={(e) => setTrainingPhrases(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />
        <textarea
          placeholder="Responses (comma separated)"
          value={responses}
          onChange={(e) => setResponses(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />
        <button
          onClick={createIntent}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Save Intent
        </button>
      </div>

      {/* Intents List */}
      <div className="p-4 border rounded-xl shadow bg-white">
        <h2 className="text-lg font-semibold mb-3">Existing Intents</h2>
        {loading ? (
          <p>Loading...</p>
        ) : intents.length === 0 ? (
          <p>No intents found.</p>
        ) : (
          <ul className="space-y-3">
            {intents.map((intent) => (
              <li key={intent.name} className="p-3 border rounded bg-gray-50">
                <h3 className="font-semibold">{intent.displayName}</h3>

                <p className="text-sm text-gray-600">
                  <strong>Phrases:</strong>{" "}
                  {intent.trainingPhrases.length > 0
                    ? intent.trainingPhrases
                        .map((tp) => tp.parts.map((p) => p.text).join(""))
                        .join(", ")
                    : "No phrases"}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Responses:</strong>{" "}
                  {intent.messages.length > 0
                    ? intent.messages.map((m) => m.text.text.join(", ")).join(" | ")
                    : "No responses"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
