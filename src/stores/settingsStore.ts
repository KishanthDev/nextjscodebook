"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AppSettings } from "@/types/Modifier";

type SettingsStore = {
  settings: AppSettings | null;
  loading: boolean;
  hydrate: (initial: AppSettings) => void;
  
  updateSettings: <T>(section: keyof AppSettings, newSettings: Partial<T>) => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>()(
  devtools((set) => ({
    settings: null,
    loading: false,

    // hydrate store with SSR data
    hydrate: (initial: AppSettings) => set({ settings: initial }),

    updateSettings: async <T,>(section: keyof AppSettings, newSettings: Partial<T>) => {
      set((state) => ({
        settings: {
          ...state.settings!,
          [section]: {
            ...state.settings?.[section],
            ...newSettings,
          },
        },
      }));

      try {
        const response = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section, data: newSettings }),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || "Failed to save settings");
        }
      } catch (err) {
        console.error(`Error syncing settings for ${section}:`, err);
        throw err;
      }
    },
  }))
);
