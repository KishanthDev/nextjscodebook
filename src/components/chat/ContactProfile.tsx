'use client';

import React, { useEffect, useState } from 'react';
import { Phone, MapPin, Calendar, Info, X } from 'lucide-react';
import ContactStats from './ContactStats';

interface Contact {
  name: string;
  phone?: string;
  address?: string;
  joinedDate?: string;
  notes?: string;
  status: 'online' | 'offline';
}

interface ContactProfileProps {
  contact: Contact | null;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const tabs = [
  { id: 'phone', icon: Phone, label: 'Phone' },
  { id: 'address', icon: MapPin, label: 'Address' },
  { id: 'calendar', icon: Calendar, label: 'Joined' },
  { id: 'info', icon: Info, label: 'More Info' },
  { id: 'stats', icon: Info, label: 'Stats' },
];

export default function ContactProfile({ contact, expanded, setExpanded }: ContactProfileProps) {
  const [activeTab, setActiveTab] = useState('phone');
  const [currentContact, setCurrentContact] = useState<Contact | null>(contact);

  // 🧠 Reset contact when changed (to prevent old data showing)
  useEffect(() => {
    if (contact) {
      // Clear first, then load new contact
      setCurrentContact(null);
      const timer = setTimeout(() => {
        setCurrentContact(contact);
      }, 50); // short delay for smooth transition
      return () => clearTimeout(timer);
    } else {
      setCurrentContact(null);
    }
  }, [contact]);

  const renderTabContent = () => {
    if (!currentContact) return null;
    switch (activeTab) {
      case 'phone': return <p>{currentContact.phone ?? 'No phone number available'}</p>;
      case 'address': return <p>{currentContact.address ?? 'No address provided'}</p>;
      case 'calendar': return <p>{currentContact.joinedDate ?? 'Date not available'}</p>;
      case 'info': return <p>{currentContact.notes ?? 'No additional info'}</p>;
      case 'stats': return <ContactStats contactName={currentContact.name} />;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
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

      {expanded && (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
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

          {/* Content */}
          {currentContact ? (
            <div className="flex-1 flex flex-col overflow-hidden transition-opacity duration-150">
              {/* Profile Info */}
              <div className="flex-shrink-0 px-4 py-4 text-center border-b dark:border-gray-700">
                <img 
                  src="https://via.placeholder.com/150" 
                  alt={currentContact.name} 
                  className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-300 dark:border-gray-600" 
                />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{currentContact.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{`${currentContact.name.toLowerCase().replace(/\s+/g, '')}@example.com`}</p>
                <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${currentContact.status === 'online'
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {currentContact.status}
                </span>
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              Loading contact...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
