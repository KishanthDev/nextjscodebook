'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import defaultConfig from '../../data/modifier.json';
import { AppSettings } from '@/types/Modifier';

type SettingsStore = {
  settings: AppSettings;
  loading: boolean;
  fetchSettings: <T>(section: keyof AppSettings, defaultSettings: T) => Promise<void>;
  updateSettings: <T>(section: keyof AppSettings, newSettings: Partial<T>) => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>()(
  devtools((set) => ({
    settings: defaultConfig as AppSettings,
    loading: false,
    fetchSettings: async <T,>(section: keyof AppSettings, defaultSettings: T) => {
      set({ loading: true });
      try {
        const res = await fetch(`/api/settings?section=${section}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        console.log(`API response for ${section}:`, json);

        set((state) => {
          const updatedSettings = {
            ...state.settings,
            [section]: {
              ...defaultSettings,
              ...json.settings,
            },
          };
          console.log(`Updated settings for ${section}:`, updatedSettings[section]);
          return {
            settings: updatedSettings,
            loading: false,
          };
        });
      } catch (err) {
        console.error(`Error fetching settings for ${section}:`, err);
        set((state) => ({
          settings: {
            ...state.settings,
            [section]: defaultSettings,
          },
          loading: false,
        }));
      }
    },
    updateSettings: async <T,>(section: keyof AppSettings, newSettings: Partial<T>) => {
      set((state) => {
        const updatedSettings = {
          ...state.settings,
          [section]: {
            ...state.settings[section],
            ...newSettings,
          },
        };
        console.log(`Updated settings for ${section}:`, updatedSettings[section]);
        return { settings: updatedSettings };
      });

      try {
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section, data: newSettings }),
        });
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || 'Failed to save settings');
        }
      } catch (err) {
        console.error(`Error syncing settings for ${section}:`, err);
        throw err; // Re-throw to be handled by the component
      }
    },
  }))
);