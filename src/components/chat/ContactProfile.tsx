import React from "react";
import Contact from "@/types/Contact";
import { Mail, Phone, MapPin, Calendar, Info, X } from "lucide-react";


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
        <div>
            <div>
                <h3 className="flex items-center justify-between p-4 border-b h-14 font-semibold text-gray-800 dark:text-white">
                    {/* Left Icons + Label */}
                    <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <Phone className="w-4 h-4 text-gray-500" />
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <Info className="w-4 h-4 text-gray-500" />
                    </div>

                    {/* Close Icon */}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{`${contact.name}@example.com`}</p>
                <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${contact.status === "online"
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
