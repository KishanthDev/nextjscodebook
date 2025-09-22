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
import useMqtt from "@/hooks/useMqtt";
import { useAIConfig } from "@/stores/aiConfig"; // ✅ import AI config

export default function ChatUI() {
  const [clientId] = useState(() => `user-1`);
  const { messages: mqttMessages, sendMessage } = useMqtt("nextjs/poc/s", clientId);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [messages, setMessages] = useState<{ fromUser: boolean; text: string; id: string }[]>([]);
  const [suggestedReply, setSuggestedReply] = useState(""); // ✅ state instead of const
  const { acceptChats } = useUserStatus();
  const { settings, fetchSettings } = useSettingsStore();
  const { openaiGenerate } = useAIConfig(); // ✅ access store

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

  // 🔹 Function to ask AI for a suggested reply
  const handleIncomingMessage = async (text: string) => {
    try {
      const res = await fetch("/api/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const aiSuggestion = data.reply || "";
      setSuggestedReply(aiSuggestion);
    } catch (err) {
      console.error("AI suggestion failed:", err);
      setSuggestedReply("");
    }
  };

  // 🔹 Handle new MQTT messages
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

    // Update contacts
    setContacts((prevContacts) =>
      prevContacts.map((c) => {
        const contactMessages = newOnes.filter((m) => m.sender !== clientId);
        if (contactMessages.length === 0) return c;

        const lastMsg = contactMessages[contactMessages.length - 1];
        if (!lastMsg) return c;

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

    // 🔹 If OpenAI generate is enabled, run AI on the **last incoming message**
    const lastIncoming = newOnes.find((m) => m.sender !== clientId);
    if (lastIncoming && openaiGenerate) {
      handleIncomingMessage(lastIncoming.text);
    }
  }, [mqttMessages, clientId, selectedContact, openaiGenerate]);

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c))
    );
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
            suggestedReply={suggestedReply} // ✅ passes AI reply
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
