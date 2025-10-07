'use client';

import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/registry/new-york-v4/ui/accordion";
import { useContactProfileStore } from '@/stores/contactProfileStore';

// Utility to format camelCase/PascalCase labels
const formatLabel = (key: string) => {
  const result = key
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

// Read-only field
const ReadOnlyField = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 py-1 text-xs">
    <div className="font-medium text-gray-600 dark:text-gray-300">{label}</div>
    <div className="text-gray-900 dark:text-gray-100">
      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
    </div>
  </div>
);

export default function ContactStatsRead() {
  const generalData = useContactProfileStore((state) => state.generalData);
  const chatInfo = useContactProfileStore((state) => state.chatInfo);
  const locationInfo = useContactProfileStore((state) => state.locationInfo);
  const technologyInfo = useContactProfileStore((state) => state.technologyInfo);
  const securityInfo = useContactProfileStore((state) => state.securityInfo);

  const renderSection = (data: Record<string, any>) => (
    <div className="space-y-1">{Object.entries(data).map(([key, value]) => (
      <ReadOnlyField key={key} label={formatLabel(key)} value={value} />
    ))}</div>
  );

  return (
    <div className="h-full overflow-auto pr-2">
      <Accordion type="multiple" className="h-full flex flex-col space-y-2">

        {[
          { id: 'general-info', label: 'General Info', data: generalData },
          { id: 'chat-info', label: 'Chat Info', data: chatInfo },
          { id: 'location-info', label: 'Location Info', data: locationInfo },
          { id: 'technology-info', label: 'Technology Info', data: technologyInfo },
          { id: 'security-info', label: 'Security Info', data: securityInfo },
        ].map(({ id, label, data }) => (
          <AccordionItem
            key={id}
            value={id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300 data-[state=open]:shadow-md data-[state=open]:bg-gray-50 dark:data-[state=open]:bg-gray-800"
          >
            <AccordionTrigger className="px-3 py-2 text-xs font-medium text-left bg-gray-100 dark:bg-gray-900 data-[state=open]:bg-gray-200 dark:data-[state=open]:bg-gray-700 transition-colors">
              {label}
            </AccordionTrigger>
            <AccordionContent className="p-3 bg-white dark:bg-gray-900 text-xs transition-all duration-300">
              {renderSection(data)}
            </AccordionContent>
          </AccordionItem>
        ))}

      </Accordion>
    </div>
  );
}
