"use client";

import { useState } from "react";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";

export default function BotsPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    settings: { temperature: "0.7", language: "en" }
  });
  const [loading, setLoading] = useState(false);
  const [bots, setBots] = useState<any[]>([]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      // for nested settings
      const [parent, child] = name.split(".");
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: value,
        },
      }));

    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/training/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create bot");
      setBots([...bots, data]);
      setForm({
        name: "",
        description: "",
        type: "",
        settings: { temperature: "0.7", language: "en" }
      });
    } catch (err) {
      console.error(err);
      alert("Error creating bot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="max-w-lg mx-auto">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-bold">Create a New Bot</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Bot Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Textarea
              placeholder="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
            <Input
              placeholder="Type (e.g. sales, support)"
              name="type"
              value={form.type}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Temperature"
                name="settings.temperature"
                value={form.settings.temperature}
                onChange={handleChange}
              />
              <Input
                placeholder="Language"
                name="settings.language"
                value={form.settings.language}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Bot"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
