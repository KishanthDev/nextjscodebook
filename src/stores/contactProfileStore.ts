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

type Section = 'general' | 'chat' | 'location' | 'technology' | 'security';

type ContactProfileStore = ContactProfile & {
  // Bulk setters
  setGeneralFields: (data: Record<string, any>) => void;
  setChatFields: (data: Record<string, any>) => void;
  setLocationFields: (data: Record<string, any>) => void;
  setTechnologyFields: (data: Record<string, any>) => void;
  setSecurityFields: (data: Record<string, any>) => void;

  resetProfile: () => void;
  fetchData: (section: Section) => Promise<void>;
};

export const useContactProfileStore = create<ContactProfileStore>()(
  devtools((set, get) => {
    const updateFieldAPI = async (section: Section, data: Record<string, any>, id = 1) => {
      const urlMap: Record<Section, string> = {
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

      // --- Bulk setters
      setGeneralFields: (data) => {
        set({ generalData: data });
        updateFieldAPI('general', data);
      },
      setChatFields: (data) => {
        set({ chatInfo: data });
        updateFieldAPI('chat', data);
      },
      setLocationFields: (data) => {
        set({ locationInfo: data });
        updateFieldAPI('location', data);
      },
      setTechnologyFields: (data) => {
        set({ technologyInfo: data });
        updateFieldAPI('technology', data);
      },
      setSecurityFields: (data) => {
        set({ securityInfo: data });
        updateFieldAPI('security', data);
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
          const urlMap: Record<Section, string> = {
            general: 'general-info',
            chat: 'chat-info',
            location: 'location',
            technology: 'technology-info',
            security: 'security-info',
          };

          const mapFields: Record<Section, keyof ContactProfile> = {
            general: 'generalData',
            chat: 'chatInfo',
            location: 'locationInfo',
            technology: 'technologyInfo',
            security: 'securityInfo',
          };

          const res = await fetch(
            `https://orchestration-service-o8pna.ondigitalocean.app/api/${urlMap[section]}`
          );
          if (!res.ok) throw new Error(`Failed to fetch ${section} info`);

          const data = await res.json();
          const item = Array.isArray(data) ? data[0] : data;

          if (!item) return;

          // Map data per section
          const mappedData = (() => {
            switch (section) {
              case 'general':
                return {
                  subject: item.subject,
                  firstName: item.firstName,
                  lastName: item.lastName,
                  email: item.email,
                  phoneNumber: item.phoneNumber,
                  preferredContactTime: item.preferredContactTime,
                  summary: item.summary,
                  isLeadQualified: item.isLeadQualified,
                };
              case 'chat':
                return {
                  visitorType: item.visitorType,
                  chatToken: item.chatToken,
                  apiToken: item.apiToken,
                  websiteDomain: item.websiteDomain,
                  startedOn: item.startedOn,
                  visitorStartTime: item.visitorStartTime,
                  startTime: item.startTime,
                };
              case 'location':
                return {
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
                  locationLatitude: item.locationLatitude,
                  locationLongitude: item.locationLongitude,
                };
              case 'technology':
                return {
                  userIp: item.userIp,
                  userAgentHeader: item.userAgentHeader,
                  userAgentName: item.userAgentName,
                  osName: item.osName,
                };
              case 'security':
                return {
                  isAbuser: item.isAbuser,
                  isAnonymous: item.isAnonymous,
                  isAttacker: item.isAttacker,
                  isBogon: item.isBogon,
                  isCloudProvider: item.isCloudProvider,
                  isProxy: item.isProxy,
                  isThreat: item.isThreat,
                  isTor: item.isTor,
                  isTorExit: item.isTorExit,
                };
            }
          })();

          set({ [mapFields[section]]: mappedData });
        } catch (err) {
          console.error(`Error fetching ${section} info:`, err);
        }
      },
    };
  })
);
