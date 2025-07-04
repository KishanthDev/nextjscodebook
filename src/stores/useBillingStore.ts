// stores/useDataStore.ts
import { create } from 'zustand';
import invoices from '../components/billing/invoices.json';
import payments from '../components/billing/payments.json';
import pricePlans from '../components/billing/priceplans.json';
import { Invoice, Payment, PricePlan } from '@/types/Billing';

interface BillingStore {
  invoices: Invoice[];
  payments: Payment[];
  pricePlans: PricePlan[];
  setInvoices: (data: Invoice[]) => void;
  setPayments: (data: Payment[]) => void;
  setPricePlans: (data: PricePlan[]) => void;
}

export const useBillingStore = create<BillingStore>((set) => ({
  invoices,
  payments,
  pricePlans,
  setInvoices: (data) => set({ invoices: data }),
  setPayments: (data) => set({ payments: data }),
  setPricePlans: (data) => set({ pricePlans: data }),
}));
