'use client';

import React from 'react';
import { Button } from '@/ui/button';
import { toast } from 'sonner';

interface DownloadProps {
  type: 'chatWidget' | 'bubble' | 'chatBar';
  settings: Record<string, any>;
}

export default function DownloadPreview({ type, settings }: DownloadProps) {
  const handleDownload = async () => {
  try {
    const res = await fetch('/api/download-preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'chatWidget', settings })
    });
    if (!res.ok) throw new Error('Failed to generate ZIP');

    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `chatWidget-preview.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success('ZIP downloaded!');
  } catch (err) {
    toast.error(`Download failed: ${(err as Error).message}`);
  }
};


  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
      toast.success('Settings copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy settings');
    }
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={handleCopyJSON}>
        Copy JSON Settings
      </Button>
      <Button variant="secondary" onClick={handleDownload}>
        Download {type} Preview ZIP
      </Button>
    </div>
  );
}
