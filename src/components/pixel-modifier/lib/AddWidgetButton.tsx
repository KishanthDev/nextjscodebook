'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/ui/button';
import { useConfigStore } from '@/stores/useConfigStore';
import bubbleDefaults from '@/defaults/bubble.json';
import chatBarDefaults from '@/defaults/chatbar.json';
import chatWidgetDefaults from '@/defaults/chatwidget.json';

export const AddWidgetButton: React.FC = () => {
  const { addWidget, setCurrentWidget } = useConfigStore();
  const [loading, setLoading] = useState(false);
  const handleAdd = () => {
    setLoading(true);

    // Show "Coming Soon" toast instead of calling API
    toast.info(`Coming soon 🚀`, { duration: 4000 });

    // Optional: simulate a brief delay to show loading state
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleAd = async () => {
    setLoading(true);

    try {
      // Build default payload
      const payload = {
        customerId: 1, // replace with actual customerId
        websiteId: 1,  // replace with actual websiteId
        bubblejson: bubbleDefaults,
        chatbarjson: chatBarDefaults,
        chatwindowjson: {},
        chatwidgetSettings: chatWidgetDefaults,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });


      if (!res.ok) throw new Error('Failed to create new widget');

      const newWidget = await res.json();

      // Add to Zustand store
      addWidget(newWidget);
      setCurrentWidget(newWidget.id);

      toast.success(`New chat widget #${newWidget.id} created successfully!`);
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to create widget: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleAdd}
      disabled={loading}
      className="w-9 h-9 p-0 flex items-center justify-center"
      title="Add New Widget"
    >
      <Plus className="w-4 h-4" />
    </Button>
  );
};
