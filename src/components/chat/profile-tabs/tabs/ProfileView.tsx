'use client';

import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/registry/new-york-v4/ui/accordion";

import { useContactProfileStore } from '@/stores/contactProfileStore';

// Utility to format camelCase, PascalCase, and acronyms
const formatLabel = (key: string) => {
  const result = key
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // Handle consecutive caps
    .replace(/([a-z])([A-Z])/g, '$1 $2');       // Insert space before capital letters
  return result.charAt(0).toUpperCase() + result.slice(1);
};

// Render a read-only field
const ReadOnlyField = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 py-1">
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
    <div className="space-y-1">
      {Object.entries(data).map(([key, value]) => (
        <ReadOnlyField key={key} label={formatLabel(key)} value={value} />
      ))}
    </div>
  );

  return (
    <div className="h-full overflow-auto pr-2">
      <Accordion type="multiple" className="h-full flex flex-col space-y-2">

        <AccordionItem value="general-info">
          <AccordionTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            General Info
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            {renderSection(generalData)}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="chat-info">
          <AccordionTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            Chat Info
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            {renderSection(chatInfo)}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location-info">
          <AccordionTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            Location Info
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            {renderSection(locationInfo)}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="technology-info">
          <AccordionTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            Technology Info
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            {renderSection(technologyInfo)}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security-info">
          <AccordionTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            Security Info
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            {renderSection(securityInfo)}
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
