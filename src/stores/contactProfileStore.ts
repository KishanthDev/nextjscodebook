'use client';

import TechnologyInfo from '@/components/chat/profile-tabs/tabs/TechnologyInfo';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ContactProfile = {
  generalData: Record<string, any>;
  chatInfo: Record<string, any>;
  locationInfo: Record<string, any>;
  technologyInfo: Record<string, any>;
  securityInfo: Record<string, any>;
};

type Section = 'general' | 'chat' | 'location' | 'technology' | 'security';

type ContactProfileStore = ContactProfile & {
  setGeneralField: (key: string, value: any) => void;
  setChatField: (key: string, value: any) => void;
  setLocationField: (key: string, value: any) => void;
  setTechnologyField: (key: string, value: any) => void;
  setSecurityField: (key: string, value: any) => void;
  resetProfile: () => void;
  fetchData: (section: Section) => Promise<void>;
};

export const useContactProfileStore = create<ContactProfileStore>()(
  devtools((set, get) => {
    // Internal function to update API
    const updateFieldAPI = async (section: Section, data: Record<string, any>, id = 1) => {
      const urlMap = {
        general: 'general-info',
        chat: 'chat-info',
        location: 'location',
        technology: 'technology-info',
        security: 'security-info',
      };
      try {
        const url = `https://orchestration-service-o8pna.ondigitalocean.app/api/${urlMap[section]}/${id}`;
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Failed to update ${section} info`);
        console.log(`✅ ${section} info updated successfully (id=${id})`);
      } catch (err) {
        console.error(`❌ Error updating ${section} info:`, err);
      }
    };

    return {
      generalData: {},
      chatInfo: {},
      locationInfo: {},
      technologyInfo: {},
      securityInfo: {},

      // --- Setters with auto-update
      setGeneralField: (key, value) => {
        set((state) => {
          const newData = { ...state.generalData, [key]: value };
          updateFieldAPI('general', newData);
          return { generalData: newData };
        });
      },
      setChatField: (key, value) => {
        set((state) => {
          const newData = { ...state.chatInfo, [key]: value };
          updateFieldAPI('chat', newData);
          return { chatInfo: newData };
        });
      },
      setLocationField: (key, value) => {
        set((state) => {
          const newData = { ...state.locationInfo, [key]: value };
          updateFieldAPI('location', newData);
          return { locationInfo: newData };
        });
      },
      setTechnologyField: (key, value) => {
        set((state) => {
          const newData = { ...state.technologyInfo, [key]: value };
          updateFieldAPI('technology', newData);
          return { technologyInfo: newData };
        });
      },
      setSecurityField: (key, value) => {
        set((state) => {
          const newData = { ...state.securityInfo, [key]: value };
          updateFieldAPI('security', newData);
          return { securityInfo: newData };
        });
      },

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
          } else if (section === 'technology' && item) {
            const mapped = {
              userIp: item.userIp,
              userAgentHeader: item.userAgentHeader,
              userAgentName: item.userAgentName,
              osName: item.osName,
            };
            set({ technologyInfo: mapped });
          }


          else if (item) {
            set({ [mapFields[section]]: item });
          }
        } catch (err) {
          console.error(`Error fetching ${section} info:`, err);
        }
      },
    };
  }))
