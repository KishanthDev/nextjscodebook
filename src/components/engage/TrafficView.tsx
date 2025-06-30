'use client';

import { useState } from 'react';
import clsx from 'clsx';

const filters = [
  { label: 'All Customers', count: 92 },
  { label: 'Chatting', count: 1 },
  { label: 'Supervised', count: 0 },
  { label: 'Queued', count: 0 },
  { label: 'Waiting for Reply', count: 0 },
  { label: 'Invited', count: 28 },
  { label: 'Browsing', count: 13 },
];

export default function TrafficView() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All Customers');

  return (
    <div className="space-y-6">
      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">📊 Traffic Insights</h1>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-6 border-b border-gray-200 dark:border-zinc-700">
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setSelectedFilter(filter.label)}
            className={clsx(
              'pb-2 text-sm font-medium capitalize transition-colors border-b-2',
              selectedFilter === filter.label
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-600 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:border-blue-400'
            )}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Placeholder for Data */}
      <div className="p-6 border rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-700">
        <p className="text-gray-700 dark:text-gray-300">
          Showing data for: <strong>{selectedFilter}</strong>
        </p>
        {/* Replace this section with actual customer data list / table */}
      </div>
    </div>
  );
}
