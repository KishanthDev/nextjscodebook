'use client';

import React from "react";
import { Button } from "@/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Save } from "lucide-react";
import { useConfigStore } from "@/stores/useConfigStore";

interface SaveButtonProps {
  type: 'bubble' | 'chatbar' | 'chatwidget';
  data: any; // updated settings for that type
}

export const SaveButton: React.FC<SaveButtonProps> = ({ type, data }) => {
  const { widgets, currentWidgetId, updateWidget } = useConfigStore();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);


  const handleSave = () => {
    setLoading(true);

    // Show "Coming Soon" toast instead of calling API
    toast.info(`Coming soon 🚀`, { duration: 4000 });

    // Optional: simulate a brief delay to show loading state
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleSav = async () => {
    if (!widgets || widgets.length === 0 || currentWidgetId === null) {
      toast.error("No widget selected to save!");
      return;
    }

    setLoading(true);
    setSuccess(false);

    const current = widgets.find(w => w.id === currentWidgetId);
    if (!current) {
      toast.error("Selected widget not found!");
      setLoading(false);
      return;
    }

    // Merge updated data into current widget
    const payload = {
      ...current,
      bubblejson: type === 'bubble' ? data : current.bubblejson,
      chatbarjson: type === 'chatbar' ? data : current.chatbarjson,
      chatwidgetSettings: type === 'chatwidget' ? data : current.chatwidgetSettings,
      updatedAt: new Date().toISOString(),
    };

    try {
      await toast.promise(
        (async () => {
          const res = await fetch("/api/config", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) throw new Error("Failed to save configuration");

          // Update local store after successful save
          updateWidget(currentWidgetId, payload);

          await new Promise(resolve => setTimeout(resolve, 300));
        })(),
        {
          loading: "Saving configuration...",
          success: "Configuration saved successfully!",
          error: "Failed to save configuration.",
        }
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleSave}
      disabled={loading}
      variant="outline"
      className="w-9 h-9 p-0 flex items-center justify-center"
      title="Save"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      ) : success ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <Save className="w-4 h-4 text-gray-700 dark:text-gray-200" />
      )}
    </Button>
  );
};
