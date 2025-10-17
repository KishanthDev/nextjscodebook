'use client';

import React from "react";
import { Button } from "@/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Save } from "lucide-react";
import { useConfigStore } from "@/stores/useConfigStore";

interface SaveButtonProps {
  type: 'bubble' | 'chatbar' | 'chatwidget';
  data: any; // the updated settings for that type
}

export const SaveButton: React.FC<SaveButtonProps> = ({ type, data }) => {
  const { widgets } = useConfigStore();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSave = async () => {
    if (!widgets || widgets.length === 0) {
      toast.error("No widget data found to save!");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const first = widgets[0];

      // Build payload using the updated settings for the selected type
      const payload = {
        id: first.id,
        customerId: first.customerId,
        websiteId: first.websiteId,
        bubblejson: type === 'bubble' ? data : first.bubblejson,
        chatbarjson: type === 'chatbar' ? data : first.chatbarjson,
        chatwindowjson: first.chatwindowjson || {},
        chatwidgetSettings: type === 'chatwidget' ? data : first.chatwidgetSettings,
        createdAt: first.createdAt,
        updatedAt: new Date().toISOString(),
      };

      await toast.promise(
        (async () => {
          const res = await fetch("/api/config", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) throw new Error("Failed to save configuration");

          await new Promise((resolve) => setTimeout(resolve, 300));
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
