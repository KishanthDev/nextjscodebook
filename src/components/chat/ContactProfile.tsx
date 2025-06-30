import React from "react";
import Contact from "@/types/Contact";

interface ContactProfileProps {
  contact: Contact | null;
}

export default function ContactProfile({ contact }: ContactProfileProps) {
  if (!contact) {
    return (
      <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Select a contact to view their profile
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col items-center text-center">
        <img
          src={"https://via.placeholder.com/150"}
          alt={contact.name}
          className="w-20 h-20 rounded-full mb-4 border-2 border-gray-300 dark:border-gray-600"
        />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {contact.name}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{`${contact.name}@example.com`}</p>
        <span
          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
            contact.status === "online"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {contact.status}
        </span>
      </div>
    </div>
  );
}
