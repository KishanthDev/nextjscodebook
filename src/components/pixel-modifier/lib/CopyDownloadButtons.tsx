'use client';

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Copy, Check, Download, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CopyDownloadButtonsProps {
  settings: Record<string, any>;
  filename: string;
}

export const CopyDownloadButtons: React.FC<CopyDownloadButtonsProps> = ({ settings, filename }) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
      setCopied(true);
      toast.success(`${filename} copied to clipboard!`);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy settings');
    }
  };

  const downloadSettings = () => {
    try {
      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      setDownloaded(true);
      toast.success(`Downloaded ${filename}`);
      setTimeout(() => setDownloaded(false), 1500);
    } catch (err) {
      console.error(err);
      toast.error('Failed to download file');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Copy Button */}
      <Button size="sm" title='Copy' onClick={copyToClipboard} className="flex items-center cursor-pointer gap-1 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={copied ? 'check' : 'copy'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1"
          >
            {copied ? <Check className="w-4 h-4 text-green-900" /> : <Copy className="w-4 h-4" />}
          </motion.div>
        </AnimatePresence>
      </Button>

      {/* Download Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={downloadSettings}
        className="flex items-center cursor-pointer gap-1 relative overflow-hidden"
        title="Download"

      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={downloaded ? 'done' : 'download'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1"
          >
            {downloaded ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </motion.div>
        </AnimatePresence>
      </Button>
    </div >
  );
};
