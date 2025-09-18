"use client";
import { useState, useEffect } from "react";
import mqtt from "mqtt";
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

export default function ChatUI() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [messages, setMessages] = useState<{ fromUser: boolean; text: string }[]>([]);
  const { acceptChats } = useUserStatus();
  const { settings, fetchSettings } = useSettingsStore();

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
  }));

  const userStatus = acceptChats ? "online" : "offline";

  // ✅ Consumer hook
  useEffect(() => {
    const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

    client.on("connect", () => {
      console.log("✅ Consumer connected to HiveMQ");
      client.subscribe("nextjs/poc/test");
    });

    client.on("message", (_, payload) => {
      setMessages((prev) => [...prev, { fromUser: false, text: payload.toString() }]);
    });

    return () => {
      client.end();
    };
  }, []);

  let suggestedReply = "";


  const handleSendMessage = (text: string) => {
    setMessages((prev) => [...prev, { fromUser: true, text }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { fromUser: false, text: 'Got it! I\'ll reply soon.' },
      ]);
    }, 1000);
  };

  /*   useEffect(() => {
      const timer = setTimeout(() => {
        handleIncomingMessage("hello where is my location");
      }, 2000);
  
      return () => clearTimeout(timer);
    }, []);
  
    const handleIncomingMessage = async (text: string) => {
      setMessages((prev) => [...prev, { fromUser: false, text }]); 
      try {
        const res = await fetch('/api/ai-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });
        const data = await res.json();
        const aiSuggestion = data.reply || '';
  
        setSuggestedReply(aiSuggestion);
      } catch (err) {
        console.error('AI suggestion failed:', err);
        setSuggestedReply('');
      }
    }; */



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
            contacts={sampleContacts}
            selectedContact={selectedContact}
            onSelect={setSelectedContact}
            userStatus={userStatus}
          />
        )}
      </div>

      {/* Chat Area */}
      <div className={`flex flex-col min-h-0 transition-all duration-300 ${profileExpanded ? "w-[40%]" : "w-[70%]"}`}>
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
      <div className={`transition-all duration-300 ${profileExpanded ? "w-[30%]" : "w-12"} border-l border-gray-300 dark:border-gray-700`}>
        <ContactProfile contact={selectedContact} expanded={profileExpanded} setExpanded={setProfileExpanded} />
      </div>
    </div>
  );
}
