// src/hooks/useSettings.ts
'use client';

import { useEffect, useState } from 'react';

export function useSettings<T>(params: {
  section: string;
  defaultSettings: T;
}) {
  const { section, defaultSettings } = params;

  const [settings, setSettings] = useState<T>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(`/api/settings?section=${section}`);
        if (res.ok) {
          const json = await res.json();
          if (json.settings) {
            setSettings(json.settings);
          } else {
            setSettings(defaultSettings);
          }
        } else {
          setSettings(defaultSettings);
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [section]);

  return { settings, loading };
}
