"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Plus } from "lucide-react";

export default function WebsitesTable() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUrls = async () => {
    try {
      const res = await fetch("/api/url/url-list");
      const data = await res.json();
      setUrls(data.urls || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch URLs");
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleUpload = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
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
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Upload Website URL</h2>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleUpload}
            disabled={loading}
            className={`flex items-center gap-2 ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Uploading..." : <><Plus size={16} /> Upload</>}
          </Button>
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </Card>

      {/* URLs Table */}
      <Card className="p-4 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead className="text-right">AI Agent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.length > 0 ? (
              urls.map((u) => (
                <TableRow key={u}>
                  <TableCell>{u}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() =>
                        (window.location.href = `/ai-agent-website?url=${encodeURIComponent(u)}`)
                      }
                    >
                      Go
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-500">
                  No websites uploaded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
