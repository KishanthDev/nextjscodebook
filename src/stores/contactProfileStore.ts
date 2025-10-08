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
  fetchData: (
    section: 'general' | 'chat' | 'location' | 'technology' | 'security'
  ) => Promise<void>;
};

export const useContactProfileStore = create<ContactProfileStore>()(
  devtools((set) => ({
    generalData: {},
    chatInfo: {},
    locationInfo: {},
    technologyInfo: {},
    securityInfo: {},

    // --- Setters
    setGeneralField: (key, value) =>
      set((state) => ({
        generalData: { ...state.generalData, [key]: value },
      })),

    setChatField: (key, value) =>
      set((state) => ({
        chatInfo: { ...state.chatInfo, [key]: value },
      })),

    setLocationField: (key, value) =>
      set((state) => ({
        locationInfo: { ...state.locationInfo, [key]: value },
      })),

    setTechnologyField: (key, value) =>
      set((state) => ({
        technologyInfo: { ...state.technologyInfo, [key]: value },
      })),

    setSecurityField: (key, value) =>
      set((state) => ({
        securityInfo: { ...state.securityInfo, [key]: value },
      })),

    // --- Reset all
    resetProfile: () =>
      set(() => ({
        generalData: {},
        chatInfo: {},
        locationInfo: {},
        technologyInfo: {},
        securityInfo: {},
      })),

    // --- Fetch API Data
    fetchData: async (section) => {
      try {
        const urlMap = {
          general: 'general-info',
          chat: 'chat-info',
          location: 'location',
          technology: 'technology-info',
          security: 'security-info',
        };

        const mapFields = {
          general: 'generalData',
          chat: 'chatInfo',
          location: 'locationInfo',
          technology: 'technologyInfo',
          security: 'securityInfo',
        } as const;

        const res = await fetch(
          `https://orchestration-service-o8pna.ondigitalocean.app/api/${urlMap[section]}`
        );

        if (!res.ok) throw new Error(`Failed to fetch ${section} info`);

        const data = await res.json();
        const item = Array.isArray(data) ? data[0] : data;

        if (section === 'location' && item) {
          const mapped = {
            location: `${item.city}, ${item.country}`,
            isCountryInEU: item.isCountryInEu,
            continent: item.continent,
            country: item.country,
            region: item.region,
            city: item.city,
            postal: item.postalCode,
            countryPopulation: item.countryPopulation,
            countryPopulationDensity: item.countryPopulationDensity,
            timezone: item.timezone,
            currency: item.currency,
            language: item.language,
            latitude: item.locationLatitude,
            longitude: item.locationLongitude,
          };
          set({ locationInfo: mapped });
        } else if (item) {
          set({ [mapFields[section]]: item });
        }
      } catch (err) {
        console.error(`Error fetching ${section} info:`, err);
      }
    },
  }))
);
