'use client';

import React from 'react';
import { Button } from "@/ui/button";
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Save } from "lucide-react";
import { useConfigStore } from "@/stores/useConfigStore";

interface SaveButtonProps {
  type: 'bubble' | 'chatbar' | 'chatwidget';
  data: any;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ type, data }) => {
  const { setBubble, setChatbar, setChatwidget } = useConfigStore();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    await toast.promise(
      (async () => {
        const res = await fetch('/api/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, data }),
        });

        if (!res.ok) throw new Error('Failed to save configuration.');

        // ✅ Update Zustand store
        if (type === 'bubble') setBubble(data);
        if (type === 'chatbar') setChatbar(data);
        if (type === 'chatwidget') setChatwidget(data);

        // simulate slight delay for smooth UX
        await new Promise((r) => setTimeout(r, 300));

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      })(),
      {
        loading: 'Saving configuration...',
        success: 'Configuration saved successfully!',
        error: 'Failed to save configuration.',
      }
    );

    setLoading(false);
  };

  return (
    <Button
      size="sm"
      onClick={handleSave}
      disabled={loading}
      variant="outline"
      className="relative flex items-center justify-center w-9 h-9 p-0"
      title="Save"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      ) : success ? (
        <CheckCircle2 className="w-4 h-4 text-green-500 animate-scaleIn" />
      ) : (
        <Save className="w-4 h-4 text-gray-700 dark:text-gray-200 hover:scale-110 transition-transform duration-200" />
      )}
    </Button>
  );
};
