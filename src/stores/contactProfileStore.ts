'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ContactProfile = {
  generalData: Record<string, any>;
  chatInfo: Record<string, any>;
  locationInfo: Record<string, any>;
  technologyInfo: Record<string, any>;
  securityInfo: Record<string, any>;
};

type ContactProfileStore = ContactProfile & {
  setGeneralField: (key: string, value: any) => void;
  setChatField: (key: string, value: any) => void;
  setLocationField: (key: string, value: any) => void;
  setTechnologyField: (key: string, value: any) => void;
  setSecurityField: (key: string, value: any) => void;

  resetProfile: () => void;

  fetchData: (section: 'general' | 'chat' | 'technology' | 'security') => Promise<void>;
};

export const useContactProfileStore = create<ContactProfileStore>()(
  devtools((set) => ({
    generalData: {},
    chatInfo: {},
    locationInfo: {
      location: 'Bangalore, India',
      isCountryInEU: false,
      continent: 'Asia',
      country: 'India',
      region: 'Karnataka',
      city: 'Bangalore',
      postal: '560001',
      countryPopulation: '1.4B',
      countryPopulationDensity: '464/km²',
      timezone: 'GMT+5:30',
      currency: 'INR',
      language: 'English',
    },
    technologyInfo: {},
    securityInfo: {},

    setGeneralField: (key, value) => set((state) => ({
      generalData: { ...state.generalData, [key]: value }
    })),
    setChatField: (key, value) => set((state) => ({
      chatInfo: { ...state.chatInfo, [key]: value }
    })),
    setLocationField: (key, value) => set((state) => ({
      locationInfo: { ...state.locationInfo, [key]: value }
    })),
    setTechnologyField: (key, value) => set((state) => ({
      technologyInfo: { ...state.technologyInfo, [key]: value }
    })),
    setSecurityField: (key, value) => set((state) => ({
      securityInfo: { ...state.securityInfo, [key]: value }
    })),

    resetProfile: () => set(() => ({
      generalData: {},
      chatInfo: {},
      locationInfo: {},
      technologyInfo: {},
      securityInfo: {},
    })),

    fetchData: async (section) => {
      try {
        const urlMap = {
          general: 'general-info',
          chat: 'chat-info',
          technology: 'technology-info',
          security: 'security-info'
        };
        const res = await fetch(`https://orchestration-service-o8pna.ondigitalocean.app/api/${urlMap[section]}`);
        if (!res.ok) throw new Error(`Failed to fetch ${section} info`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const firstItem = data[0];
          const mapFields = {
            general: 'generalData',
            chat: 'chatInfo',
            technology: 'technologyInfo',
            security: 'securityInfo'
          } as const;

          set({
            [mapFields[section]]: firstItem
          });
        }
      } catch (err) {
        console.error(`Error fetching ${section} info:`, err);
      }
    },
  }))
);
