// /stores/useCustomerStore.ts
export interface Customer {
  id: number;
  name: string;
  email: string;
  country?: string;
  dateAdded?: string;
  integrations?: string; // JSON string
  companyID?: string | null;
  comments?: string | null;
  activePlanName?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CustomerStore {
  customers: Customer[];
  selectedCustomer: Customer | null;
  setCustomers: (customers: Customer[]) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
}

import { create } from "zustand";

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  selectedCustomer: null,
  setCustomers: (customers) => set({ customers }),
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
}));
