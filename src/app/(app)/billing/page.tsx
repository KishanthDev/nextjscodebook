'use client';

import { useState } from 'react';
import clsx from 'clsx';
import InvoicesView from '@/components/billing/InvoicesView';
import PaymentsView from '@/components/billing/PaymentsTable';

export default function Page() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'price plans'>('invoices');

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left Sidebar */}
      <div className="w-[220px] border-r p-4 bg-gray-50 dark:bg-zinc-900">
        <nav className="flex flex-col gap-2">
          {['invoices', 'payments', 'price plans'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={clsx(
                'text-left px-3 py-2 rounded-md text-sm font-medium capitalize',
                {
                  'bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-white':
                    activeTab === tab,
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800':
                    activeTab !== tab,
                }
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Right Content View */}
      <div className="flex-1 p-6">
        {activeTab === 'invoices' && <InvoicesView />}
        {activeTab === 'payments' && <PaymentsView />}
        {activeTab === 'price plans' && <PricePlansView />}
      </div>
    </div>
  );
}


function PricePlansView() {
  return <div className="text-xl font-bold">💰 Pricing Plans</div>;
}