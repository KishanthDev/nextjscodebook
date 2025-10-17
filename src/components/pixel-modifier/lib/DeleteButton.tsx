'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Button } from '@/ui/button';
import { useConfigStore } from '@/stores/useConfigStore';

export const DeleteWidgetButton: React.FC = () => {
    const { widgets, currentWidgetId, deleteWidget } = useConfigStore();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!currentWidgetId) {
            toast.error("No widget selected to delete!");
            return;
        }

        const current = widgets.find(w => w.id === currentWidgetId);
        if (!current) {
            toast.error("Selected widget not found!");
            return;
        }

        if (!confirm(`Are you sure you want to delete widget #${currentWidgetId}?`)) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/config", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: currentWidgetId }),
            });


            if (!res.ok) throw new Error('Failed to delete widget');

            // Remove from Zustand store
            deleteWidget(currentWidgetId);

            toast.success(`Widget #${currentWidgetId} deleted successfully!`);
        } catch (err: any) {
            console.error(err);
            toast.error(`Failed to delete widget: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading || !currentWidgetId}
            className="w-9 h-9 p-0 flex items-center justify-center"
            title="Delete Widget"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );
};
