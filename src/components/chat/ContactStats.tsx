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

interface ContactStatsProps {
  contactName: string;
}

export default function ContactStats({ contactName }: ContactStatsProps) {
  const [formData, setFormData] = useState({
    chatSubject: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContactTime: '',
    summary: '',
    leadQualified: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSwitch = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      leadQualified: checked,
    }));
  };

  return (
    <div className="h-full overflow-hidden">
      <Accordion 
        type="single" 
        collapsible 
        defaultValue="general-info" 
        className="h-full flex flex-col"
      >
        <AccordionItem value="general-info" className="flex flex-col h-full overflow-hidden border-none">
          <AccordionTrigger className="flex-shrink-0 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="font-semibold text-base">{contactName || "Contact Details"}</div>
          </AccordionTrigger>
          
          <AccordionContent className="flex-1 overflow-y-auto pt-4">
            <div className="space-y-4 pr-2">
              <form className="flex flex-col gap-4">
                <div className="space-y-3">
                  <Input 
                    name="chatSubject" 
                    value={formData.chatSubject} 
                    onChange={handleChange} 
                    placeholder="Subject" 
                    className="w-full"
                  />
                  <Input 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    placeholder="First name" 
                    required 
                    className="w-full"
                  />
                  <Input 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    placeholder="Last name" 
                    className="w-full"
                  />
                  <Input 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Email" 
                    required 
                    className="w-full"
                  />
                  <Input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="Phone number" 
                    className="w-full"
                  />
                  <Input 
                    name="preferredContactTime" 
                    value={formData.preferredContactTime} 
                    onChange={handleChange} 
                    placeholder="Preferred contact time" 
                    className="w-full"
                  />
                  <Textarea 
                    name="summary" 
                    value={formData.summary} 
                    onChange={handleChange} 
                    placeholder="Summary" 
                    rows={3} 
                    className="w-full resize-none"
                  />
                </div>
                
                <div className="flex items-center gap-2 py-2">
                  <Switch 
                    checked={formData.leadQualified} 
                    onCheckedChange={handleSwitch} 
                    name="leadQualified" 
                  />
                  <span className="text-sm">Is this Lead Qualified?</span>
                </div>
                
                <Button type="submit" className="w-full mt-4">
                  Confirm
                </Button>
              </form>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
