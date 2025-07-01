// stores/useCustomerStore.ts
import { create } from 'zustand';

export interface Customer {
  name: string;
  group: string;
  chattingWith: string;
  country: string;
  state: string;
  activity: string;
}

interface CustomerStore {
  customerData: Customer[];
  setCustomerData: (data: Customer[]) => void;
}

const defaultData: Customer[] = [
  {
    name: 'You',
    group: 'Oxnia',
    chattingWith: 'Maria',
    country: 'India',
    state: 'Maharashtra',
    activity: 'Chatting',
  },
  {
    name: 'Amit Shah',
    group: 'SupportTeam',
    chattingWith: '',
    country: 'India',
    state: 'Delhi',
    activity: 'Browsing',
  },
  {
    name: 'Samantha',
    group: 'Sales',
    chattingWith: 'John',
    country: 'India',
    state: 'Karnataka',
    activity: 'Waiting for reply',
  },
];

export const useCustomerStore = create<CustomerStore>((set) => ({
  customerData: defaultData,
  setCustomerData: (data) => set({ customerData: data }),
}));
