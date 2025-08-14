"use client";

import { useEffect, useState } from "react";

type StatValue = [number, number];
type Stats = {
  limit: number | false;
  files: StatValue;
  website: StatValue;
  qea: StatValue;
  flows: StatValue;
  articles: StatValue;
  conversations: StatValue;
  total: number;
};

export default function EmbeddingsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/embeddings")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) {
    return <div className="p-6">Loading...</div>;
  }

  const labels: Record<keyof Omit<Stats, "limit" | "total">, string> = {
    files: "📁 Files",
    website: "🌐 Website",
    qea: "❓ Q&A",
    flows: "🧠 Flows",
    articles: "📚 Articles",
    conversations: "💬 Conversations",
  };

  return (
    <div className="bg-gray-100 p-8 font-sans min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          📊 OpenAI Embedding Stats
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* Total */}
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
            <div className="font-medium text-gray-600">
              Total Characters Embedded
            </div>
            <div className="text-xl font-bold text-blue-600">
              {stats.total.toLocaleString()}
            </div>
          </div>

          {/* Limit */}
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
            <div className="font-medium text-gray-600">
              Character Limit (Cloud)
            </div>
            <div className="text-xl font-bold text-red-500">
              {stats.limit ? stats.limit.toLocaleString() : "Unlimited"}
            </div>
          </div>

          {/* Categories */}
          {Object.keys(labels).map((key) => {
            const typedKey = key as keyof typeof labels;
            const [chars, count] = stats[typedKey];
            return (
              <div
                key={key}
                className="bg-white rounded-xl p-4 border shadow-sm"
              >
                <div className="text-gray-700 font-semibold">
                  {labels[typedKey]}
                </div>
                <div className="text-sm text-gray-500">Entries: {count}</div>
                <div className="text-sm text-gray-500">
                  Characters: {chars.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
