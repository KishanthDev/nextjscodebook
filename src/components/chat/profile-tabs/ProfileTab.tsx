'use client';

import React, { useEffect, useState } from 'react';
import { Info, Shield, Cpu, MessageSquare, BarChart3, Laptop, X } from 'lucide-react';
import ContactStats from './tabs/ProfileView';
import GeneralInfo from './tabs/GeneralInfo';
import ChatInfo from './tabs/ChatInfo';
import SecurityInfo from './tabs/SecurityInfo';
import LocationInfo from './tabs/LocationInfo';
import TechnologyInfo from './tabs/TechnologyInfo'; // new tab component

interface Contact {
  name: string;
  phone?: string;
  address?: string;
  joinedDate?: string;
  notes?: string;
  status: 'online' | 'offline';
  logo?: string;
}

interface ContactProfileProps {
  contact: Contact | null;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

// ✅ Updated tabs including new "Technology Info"
const tabs = [
  { id: 'general', icon: Info, label: 'General Info' },
  { id: 'chat', icon: MessageSquare, label: 'Chat Info' },
  { id: 'security', icon: Shield, label: 'Security Info' },
  { id: 'location', icon: Cpu, label: 'Location Info' },
  { id: 'tech', icon: Laptop, label: 'Technology Info' }, // new tab
  { id: 'stats', icon: BarChart3, label: 'Stats' },
];

export default function ContactProfile({ contact, expanded, setExpanded }: ContactProfileProps) {
  const [currentContact, setCurrentContact] = useState<Contact>(
    contact || {
      name: 'Demo User',
      phone: '+91 98765 43210',
      address: 'Bangalore, India',
      joinedDate: '2024-10-07',
      notes: 'Sample user profile for testing',
      status: 'online',
      logo: 'https://via.placeholder.com/80',
    }
  );

  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (contact) setCurrentContact(contact);
  }, [contact]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return <GeneralInfo />;
      case 'chat': return <ChatInfo />;
      case 'security': return <SecurityInfo />;
      case 'location': return <LocationInfo />;
      case 'tech': return <TechnologyInfo />; // new tab content
      case 'stats': return <ContactStats />;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
      {/* Collapsed Sidebar */}
      {!expanded && (
        <div className="flex flex-col gap-3 p-1.5 bg-gray-100 dark:bg-gray-900 border-l border-gray-300 dark:border-gray-700 h-full overflow-hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setExpanded(true); }}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 flex-shrink-0"
                title={tab.label}
              >
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            );
          })}
        </div>
      )}

      {/* Expanded Panel */}
      {expanded && (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header with tab icons */}
          <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
            <div className="flex gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    title={tab.label}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`} />
                  </button>
                );
              })}
            </div>
            <button onClick={() => setExpanded(false)} title="Close">
              <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
            </button>
          </div>

          {/* Profile Content */}
          <div className="flex-1 flex flex-col overflow-hidden transition-opacity duration-150">
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
