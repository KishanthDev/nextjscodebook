"use client";
import { useState, useEffect, useRef } from "react";
import Contact from "@/types/Contact";
import ContactData from "../../../data/Contact.json";
import ContactList from "./ContactList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ContactProfile from "./ContactProfile";
import { useUserStatus } from "@/stores/useUserStatus";
import { useSettingsStore } from "@/stores/settingsStore";
import { ChatWidgetSettings } from "@/types/Modifier";
import ContactListSkeleton from "./ContactListSkeleton";
import { useAIMessageHandler } from "@/stores/aiMessageHandler";

export default function ChatUI() {
  const [clientId] = useState(() => `user-1`);
  const { messages: mqttMessages, sendMessage, suggestedReply } = useAIMessageHandler();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [messages, setMessages] = useState<{ fromUser: boolean; text: string; id: string }[]>([]);
  const { acceptChats } = useUserStatus();
  const { settings, fetchSettings } = useSettingsStore();

  const processedLenRef = useRef(0);

  const defaultSettings: ChatWidgetSettings = {
    chatTitle: "LiveChat",
    logoUrl: "https://via.placeholder.com/32",
    botMsgBgColor: "#f3f4f6",
    userMsgBgColor: "#fef08a",
    inputPlaceholder: "Type a message...",
    sendBtnBgColor: "#000000",
    sendBtnIconColor: "#ffffff",
    footerText: "Powered by LiveChat",
    footerBgColor: "#ffffff",
    footerTextColor: "#374151",
    messages: [],
  };

  useEffect(() => {
    fetchSettings("chatWidget", defaultSettings);
  }, [fetchSettings]);

  const chatWidgetSettings: ChatWidgetSettings = {
    ...defaultSettings,
    ...settings.chatWidget,
  };

  const sampleContacts: Contact[] = ContactData.map((contact) => ({
    ...contact,
    status: contact.status as "online" | "offline",
    unread: 0,
    recentMsg: contact.recentMsg || "",
  }));
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);

  const userStatus = acceptChats ? "online" : "offline";

  // Initialize MQTT connection
  useEffect(() => {
    // Ensure connection only if not already connected
    if (!useAIMessageHandler.getState().client) {
      useAIMessageHandler.getState().connect("nextjs/poc/s", clientId);
    }
    return () => {
      // Keep connection alive to ensure AI works across routes
      // Optionally disconnect on app logout: useAIMessageHandler.getState().disconnect();
    };
  }, [clientId]);

  // Handle new MQTT messages for UI
  useEffect(() => {
    const newLen = mqttMessages.length;
    if (newLen <= processedLenRef.current) return;

    const start = processedLenRef.current;
    const newOnes = mqttMessages.slice(start);
    processedLenRef.current = newLen;

    setMessages((prev) => [
      ...prev,
      ...newOnes.map((m) => ({
        text: m.text,
        fromUser: m.sender === clientId,
        id: m.id,
      })),
    ]);

    // Update contacts (POC: assume all messages apply to all contacts)
    setContacts((prevContacts) =>
      prevContacts.map((c) => {
        const contactMessages = newOnes.filter((m) => m.sender !== clientId);
        if (contactMessages.length === 0) return c;

        const lastMsg = contactMessages[contactMessages.length - 1];
        if (!lastMsg) return c;

        // For production: filter messages by contact ID (e.g., m.sender === c.id)
        if (c.id === selectedContact?.id) {
          return { ...c, unread: 0, recentMsg: lastMsg.text, time: "now" };
        } else {
          return {
            ...c,
            unread: (c.unread || 0) + contactMessages.length,
            recentMsg: lastMsg.text,
            time: "now",
          };
        }
      })
    );
  }, [mqttMessages, clientId, selectedContact]);

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c))
    );
    // For POC: show all messages (global topic)
    // For production: filter by contact ID or topic (e.g., mqttMessages.filter(m => m.sender === contact.id))
    setMessages(
      mqttMessages.map((m) => ({
        text: m.text,
        fromUser: m.sender === clientId,
        id: m.id,
      }))
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingContacts(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-[calc(100vh-3.3rem)] border border-gray-300 bg-white text-black transition-colors dark:border-gray-700 dark:bg-zinc-900 dark:text-white">
      {/* Left Sidebar */}
      <div className="w-[30%] min-w-[30%] max-w-[30%] border-r border-gray-300 dark:border-gray-700">
        {isLoadingContacts ? (
          <ContactListSkeleton />
        ) : (
          <ContactList
            contacts={contacts}
            selectedContact={selectedContact}
            onSelect={handleSelectContact}
            userStatus={userStatus}
          />
        )}
      </div>

      {/* Chat Area */}
      <div
        className={`flex flex-col min-h-0 transition-all duration-300 ${
          profileExpanded ? "w-[40%]" : "w-[70%]"
        }`}
      >
        <ChatHeader contact={selectedContact} />
        <ChatMessages
          selected={!!selectedContact}
          messages={messages}
          settings={chatWidgetSettings}
        />
        {selectedContact && (
          <ChatInput
            settings={chatWidgetSettings}
            onSend={handleSendMessage}
            suggestedReply={suggestedReply}
          />
        )}
      </div>

      {/* Right Sidebar */}
      <div
        className={`transition-all duration-300 ${
          profileExpanded ? "w-[30%]" : "w-12"
        } border-l border-gray-300 dark:border-gray-700`}
      >
        <ContactProfile
          contact={selectedContact}
          expanded={profileExpanded}
          setExpanded={setProfileExpanded}
        />
      </div>
    </div>
  );
}