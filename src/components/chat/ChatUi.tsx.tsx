'use client';
import { useEffect, useState, useRef } from "react";
import Contact from "@/types/Contact";
import ContactList from "./ContactList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ContactProfile from "./ContactProfile";
import { useUserStatus } from "@/stores/useUserStatus";
import { useSettingsStore } from "@/stores/settingsStore";
import { ChatWidgetSettings } from "@/types/Modifier";
import { useAIMessageHandler } from "@/stores/aiMessageHandler";

function formatTimeDisplay(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    // ✅ Format as HH:MM AM/PM
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    // ✅ Show as dd-mm
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}-${month}`;
  }
}


export default function ChatUI() {
  const { messages: storeMessages, sendMessage, suggestedReplies, connect, clientId, lastViewed, setLastViewed } = useAIMessageHandler();
  const { acceptChats } = useUserStatus();
  const { settings, fetchSettings } = useSettingsStore();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [messages, setMessages] = useState<{ fromUser: boolean; text: string; id: string; name?: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  const chatWidgetSettings = { ...defaultSettings, ...settings.chatWidget };
  const userStatus = acceptChats ? "online" : "offline";

  // Connect MQTT once
  useEffect(() => {
    if (!clientId) {
      connect("chat/users/+", `agent-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`);
    }
  }, [clientId, connect]);

  // Update contacts/messages when store changes
  useEffect(() => {
    const updated: Contact[] = [];

    Object.entries(storeMessages).forEach(([user, msgs]) => {
      if (!user || user === "undefined") return;

      const lastMsg = msgs[msgs.length - 1];
      const lastUserMsg = [...msgs].reverse().find((m) => m.sender !== clientId);

      // ✅ Use lastViewed from store
      const lastViewedTime = lastViewed[user] || 0;
      const unread = msgs.filter((m) => m.sender !== clientId && m.timestamp > lastViewedTime).length;

      updated.push({
        id: user,
        name: lastUserMsg?.name || user,
        status: "online",
        recentMsg: lastMsg?.text || "",
        time: lastMsg?.timestamp ? formatTimeDisplay(lastMsg.timestamp) : "",
        unread,
      });

      if (selectedContact?.id === user) {
        setMessages(
          msgs.map((m) => ({
            text: m.text,
            fromUser: m.sender === clientId,
            id: m.id,
            name: m.name || m.sender,
          }))
        );
      }
    });

    setContacts(updated);
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storeMessages, selectedContact, clientId, lastViewed]);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);

    // ✅ Update lastViewed in store and reset unread count
    setLastViewed(contact.id, Date.now());

    const msgs = storeMessages[contact.id] || [];
    setMessages(
      msgs.map((m) => ({
        text: m.text,
        fromUser: m.sender === clientId,
        id: m.id,
        name: m.name || m.sender,
      }))
    );
  };

  return (
    <div className="flex h-[calc(100vh-3.3rem)] border border-gray-300 bg-white dark:border-gray-700 dark:bg-zinc-900 dark:text-white">
      {/* Contact List */}
      <div className="w-[30%] border-r border-gray-300 dark:border-gray-700">
        <ContactList
          contacts={contacts}
          selectedContact={selectedContact}
          onSelect={handleSelectContact}
          userStatus={userStatus}
        />
      </div>

      {/* Chat */}
      <div className={`flex flex-col min-h-0 transition-all duration-300 ${profileExpanded ? "w-[40%]" : "w-[70%]"}`}>
        <ChatHeader contact={selectedContact} />
        <ChatMessages selected={!!selectedContact} messages={messages} settings={chatWidgetSettings} />
        <div ref={chatEndRef} />
        {selectedContact && (
          <ChatInput
            key={selectedContact.id}
            settings={chatWidgetSettings}
            onSend={(text) => {
              sendMessage(text, selectedContact.id);
              useAIMessageHandler.getState().setSuggestedReply('', selectedContact.id);
            }}
            suggestedReply={suggestedReplies[selectedContact.id] || ""}
          />
        )}
      </div>

      {/* Profile */}
      <div className={`transition-all duration-300 ${profileExpanded ? "w-[30%]" : "w-12"} border-l border-gray-300 dark:border-gray-700`}>
        <ContactProfile contact={selectedContact} expanded={profileExpanded} setExpanded={setProfileExpanded} />
      </div>
    </div>
  );
}