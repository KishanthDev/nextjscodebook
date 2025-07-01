import React, { useState } from "react";

import {
  Phone,
  MapPin,
  Calendar,
  Info,
  X,
  User
} from "lucide-react";

interface Contact {
  name: string;
  phone?: string;
  address?: string;
  joinedDate?: string;
  notes?: string;
  status: "online" | "offline";
}


interface ContactProfileProps {
  contact: Contact | null;
}

const tabs = [
  { id: "phone", icon: Phone, label: "Phone" },
  { id: "address", icon: MapPin, label: "Address" },
  { id: "calendar", icon: Calendar, label: "Joined" },
  { id: "info", icon: Info, label: "More Info" },
];

export default function ContactProfile({ contact }: ContactProfileProps) {
  const [activeTab, setActiveTab] = useState("phone");

  if (!contact) {
    return (
      <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Select a contact to view their profile
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "phone":
        return <p>{contact.phone ?? "No phone number available"}</p>;
      case "address":
        return <p>{contact.address ?? "No address provided"}</p>;
      case "calendar":
        return <p>{contact.joinedDate ?? "Date not available"}</p>;
      case "info":
        return <p>{contact.notes ?? "No additional info"}</p>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div>
        <h3 className="flex items-center justify-between p-4 border-b h-14 font-semibold text-gray-800 dark:text-white">
          <div className="flex items-center gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? "bg-gray-200 dark:bg-gray-700" : ""
                    }`}
                  title={tab.label}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500"
                      }`}
                  />
                </button>
              );
            })}
          </div>

          <button>
            <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
          </button>
        </h3>
      </div>

      <div className="flex flex-col mt-3 items-center text-center">
        <img
          src={"https://via.placeholder.com/150"}
          alt={contact.name}
          className="w-20 h-20 rounded-full mb-4 border-2 border-gray-300 dark:border-gray-600"
        />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {contact.name}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {`${contact.name?.toLowerCase().replace(/\s+/g, "")}@example.com`}
        </p>
        <span
          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${contact.status === "online"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            }`}
        >
          {contact.status}
        </span>

        {/* Tab content */}
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
