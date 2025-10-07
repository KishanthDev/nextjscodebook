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
  // CRUD-like setters
  setGeneralField: (key: string, value: any) => void;
  setChatField: (key: string, value: any) => void;
  setLocationField: (key: string, value: any) => void;
  setTechnologyField: (key: string, value: any) => void;
  setSecurityField: (key: string, value: any) => void;

  resetProfile: () => void;
};

export const useContactProfileStore = create<ContactProfileStore>()(
  devtools((set) => ({
    generalData: {
      chatSubject: 'Product Inquiry',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      preferredContactTime: 'Morning',
      summary: 'Interested in pricing details.',
      leadQualified: true,
    },
    chatInfo: {
      visitorType: 'Returning User',
      chatToken: 'abc123',
      apiToken: 'xyz456',
      websiteDomain: 'example.com',
      startedOn: '2025-10-01',
      visitorStartTime: '09:30 AM',
      startTime: '09:31 AM',
    },
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
    technologyInfo: {
      userIP: '192.168.0.10',
      userAgentHeader: 'Mozilla/5.0',
      userAgentName: 'Chrome',
      osName: 'Windows 10',
    },
    securityInfo: {
      isAbuser: false,
      isAnonymous: false,
      isAttacker: false,
      isBogon: false,
      isCloudProvider: true,
      isProxy: false,
      isThreat: false,
      isTor: false,
      isTorExit: false,
    },

    // CRUD setters
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
  }))
);
