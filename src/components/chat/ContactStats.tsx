'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/registry/new-york-v4/ui/accordion";
import { Input } from "@/ui/input";
import { Switch } from "@/ui/switch";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import { X, Check } from "lucide-react";

interface ContactStatsProps {
  contactName: string;
}

export default function ContactStats({ contactName }: ContactStatsProps) {
  const [generalData, setGeneralData] = useState({
    chatSubject: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContactTime: '',
    summary: '',
    leadQualified: true,
  });

  const [chatInfo, setChatInfo] = useState({
    visitorType: '',
    chatToken: '',
    apiToken: '',
    websiteDomain: '',
    startedOn: '',
    visitorStartTime: '',
    startTime: '',
  });

  const [locationInfo, setLocationInfo] = useState({
    location: '',
    isCountryInEU: false,
    continent: '',
    country: '',
    region: '',
    city: '',
    postal: '',
    countryPopulation: '',
    countryPopulationDensity: '',
    timezone: '',
    currency: '',
    language: '',
  });

  const [technologyInfo, setTechnologyInfo] = useState({
    userIP: '',
    userAgentHeader: '',
    userAgentName: '',
    osName: '',
  });

  const [securityInfo, setSecurityInfo] = useState({
    isAbuser: false,
    isAnonymous: false,
    isAttacker: false,
    isBogon: false,
    isCloudProvider: false,
    isProxy: false,
    isThreat: false,
    isTor: false,
    isTorExit: false,
  });

  const renderEditableSection = (
    data: any,
    setter: any,
    checkboxKeys: string[] = [],
    showLabels: boolean = false
  ) => {
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1 items-center">
            {checkboxKeys.includes(key) ? (
              <>
                {showLabels && (
                  <div className="font-medium text-gray-600 dark:text-gray-300">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setter((prev: any) => ({ ...prev, [key]: !prev[key] }))}
                  className="ml-4"
                >
                  {value ? <Check className="text-green-500 w-5 h-5" /> : <X className="text-red-500 w-5 h-5" />}
                </button>
              </>
            ) : key === 'summary' ? (
              <Textarea
                className="w-full"
                placeholder={key.replace(/([A-Z])/g, ' $1')}
                name={key}
                value={value as string}
                onChange={(e) => setter((prev: any) => ({ ...prev, [key]: e.target.value }))}
                rows={3}
              />
            ) : (
              <Input
                className="w-full"
                placeholder={key.replace(/([A-Z])/g, ' $1')}
                name={key}
                value={value as string}
                onChange={(e) => setter((prev: any) => ({ ...prev, [key]: e.target.value }))}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto pr-2">
      <Accordion type="multiple" defaultValue={['general-info']} className="h-full flex flex-col space-y-2">

        {/* General Info */}
        <AccordionItem value="general-info" className="border-none rounded-md overflow-hidden">
          <AccordionTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="font-semibold text-base">General Info</div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <form className="flex flex-col gap-4 pr-2">
              {renderEditableSection(generalData, setGeneralData, ['leadQualified'], true)}
              <Button type="submit" className="w-full mt-2">Confirm</Button>
            </form>
          </AccordionContent>
        </AccordionItem>

        {/* Chat Info */}
        <AccordionItem value="chat-info" className="border-none rounded-md overflow-hidden">
          <AccordionTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="font-semibold text-base">Chat Info</div>
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-4">
            {renderEditableSection(chatInfo, setChatInfo)}
          </AccordionContent>
        </AccordionItem>

        {/* Location Info */}
        <AccordionItem value="location-info" className="border-none rounded-md overflow-hidden">
          <AccordionTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="font-semibold text-base">Location Info</div>
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-4">
            {renderEditableSection(locationInfo, setLocationInfo, ['isCountryInEU'], true)}
          </AccordionContent>
        </AccordionItem>

        {/* Technology Info */}
        <AccordionItem value="technology-info" className="border-none rounded-md overflow-hidden">
          <AccordionTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="font-semibold text-base">Technology Info</div>
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-4">
            {renderEditableSection(technologyInfo, setTechnologyInfo)}
          </AccordionContent>
        </AccordionItem>

        {/* Security Info */}
        <AccordionItem value="security-info" className="border-none rounded-md overflow-hidden">
          <AccordionTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="font-semibold text-base">Security Info</div>
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-4">
            {renderEditableSection(securityInfo, setSecurityInfo, Object.keys(securityInfo), true)}
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
