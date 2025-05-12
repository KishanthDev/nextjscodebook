"use client";

import { useState } from "react";
import Contact from "../../../types/Contact";
import ContactData from "../../../data/Contact.json";
import ContactList from "./ContactList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const sampleContacts: Contact[] = ContactData.map((contact) => ({
  ...contact,
  status: contact.status as "online" | "offline" | "busy",
}));

const sampleMessages: { fromUser: boolean; text: string }[] = [
  { fromUser: false, text: "Hi!" },
  { fromUser: false, text: "Sure thing! I'm gonna call you in 5, is it okay?" },
  { fromUser: true, text: "Awesome! Call me in 5 minutes.." },
  { fromUser: true, text: "👍🏻" },
  { fromUser: false, text: "Great, talk soon!" },
  { fromUser: true, text: "Hey, just checking — are we still on for tomorrow?" },
  { fromUser: false, text: "Yes, absolutely! Looking forward to it." },
  { fromUser: true, text: "Perfect! Also, did you get a chance to look at the report?" },
  { fromUser: false, text: "Not yet, I’ll review it tonight and send feedback." },
  { fromUser: true, text: "Cool, no rush. Let me know if you have questions." },
  { fromUser: false, text: "Thanks! Appreciate it." },
  { fromUser: true, text: "BTW, check out this meme 😂" },
  { fromUser: false, text: "Haha, that’s hilarious!" },
  { fromUser: false, text: "You always send the best ones." },
  { fromUser: true, text: "😎" },
];


export default function ChatUI() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <div className="flex h-[calc(100vh-3.3rem)] border border-gray-300 bg-white text-black transition-colors dark:border-gray-700 dark:bg-zinc-900 dark:text-white">
      <ContactList
        contacts={sampleContacts}
        selectedContact={selectedContact}
        onSelect={setSelectedContact}
      />
      <div className="flex flex-1 flex-col min-h-0"> {/* min-h-0 prevents unwanted scrolling */}
        <ChatHeader contact={selectedContact} />
        <ChatMessages selected={!!selectedContact} messages={sampleMessages} />
        {selectedContact && <ChatInput />}
      </div>
    </div>
  );
}