"use client";

import { useRouter } from "next/navigation";
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

const MAX_URLS = 10;

type Site = {
  url: string;
  slug: string;       // bot name
  createdAt?: string; // ISO date string
};

export default function WebsitesTable() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState<Site[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUrls = async () => {
    try {
      const res = await fetch("/api/url/url-list");
      const data = await res.json();
      setUrls(data.sites || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch URLs");
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleUpload = async () => {
    if (!url || urls.length >= MAX_URLS) return;
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
        if (data.site) {
          setUrls((prev) => [...prev, data.site]);
        } else {
          fetchUrls();
        }
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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Upload Website URL</h2>
          <span className="text-sm text-gray-600">
            {urls.length} / {MAX_URLS} uploaded
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            disabled={urls.length >= MAX_URLS}
          />
          <Button
            onClick={handleUpload}
            disabled={loading || urls.length >= MAX_URLS}
            className={`flex items-center gap-2 ${
              loading || urls.length >= MAX_URLS
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Uploading..."
              : urls.length >= MAX_URLS
              ? "Limit Reached"
              : (
                <>
                  <Plus size={16} /> Upload
                </>
              )}
          </Button>
        </div>

        {error && <p className="text-red-600">{error}</p>}
      </Card>

      {/* URLs Table */}
      <Card className="p-4 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bot Name</TableHead>
              <TableHead>Website URL</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">AI Agent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.length > 0 ? (
              urls.map((u) => (
                <TableRow key={u.slug}>
                  {/* Bot name from slug */}
                  <TableCell className="font-medium">
                    {u.slug.toUpperCase()}
                  </TableCell>

                  {/* Website URL */}
                  <TableCell>{u.url}</TableCell>

                  {/* Created At */}
                  <TableCell>
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleString()
                      : "—"}
                  </TableCell>

                  {/* Go button */}
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(`/website?ai=${encodeURIComponent(u.slug)}`)
                      }
                    >
                      Go
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
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
