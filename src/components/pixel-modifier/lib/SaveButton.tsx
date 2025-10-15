'use client';

import React, { useState } from 'react';
import { Button } from "@/ui/button"; // ShadCN button
import { Loader2, CheckCircle2 } from "lucide-react";
import { useConfigStore } from "@/stores/useConfigStore";

interface SaveButtonProps {
    type: 'bubble' | 'chatbar' | 'chatwidget';
    data: any;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ type, data }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { setBubble, setChatbar, setChatwidget } = useConfigStore();

    const handleSave = async () => {
        setLoading(true);
        setSuccess(false);

        try {
            const res = await fetch('/api/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data }),
            });

            if (!res.ok) throw new Error('Failed to save');

            // Update Zustand store
            if (type === 'bubble') setBubble(data);
            if (type === 'chatbar') setChatbar(data);
            if (type === 'chatwidget') setChatwidget(data);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000); // success indicator disappears after 2s
        } catch (err) {
            alert('❌ Error saving data: ' + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            size='sm'
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2"
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                </>
            ) : success ? (
                <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Saved!
                </>
            ) : (
                'Save'
            )}
        </Button>
    );
};
