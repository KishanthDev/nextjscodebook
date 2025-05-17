import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type SettingsMap = Record<string, any>;

type SettingsStore = {
  settings: SettingsMap;
  loading: boolean;
  fetchSettings: <T>(section: string, defaultSettings: T) => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>()(
  devtools((set) => ({
    settings: {},
    loading: true,
    fetchSettings: async <T,>(section: string, defaultSettings: T) => {
      set({ loading: true });
      try {
        const res = await fetch(`/api/settings?section=${section}`);
        const json = await res.json();

        set((state) => ({
          settings: {
            ...state.settings,
            [section]: json.settings ?? defaultSettings,
          },
          loading: false,
        }));
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
  }))
);
