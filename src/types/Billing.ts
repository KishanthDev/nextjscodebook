export interface Invoice {
    company: string;
    customerEmail: string;
    invoiceNo: string;
    createdAt: string;
    price: number;
    currency: string;
    status: string;
}

export type Payment = {
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
  price: number;
  currency: string;
  status: 'Completed' | 'Pending' | 'Cancelled' | string;
  cancellationTime?: string | number | Date | null;
  cancellationReason?: string | null;
};

export interface PricePlan {
    planName: string;
    status: string;
    isDefault: boolean;
    isFree: boolean;
    priceMonthly: number;
    priceAnnually: number;
    dateAdded: string | Date;
    type: string;
}