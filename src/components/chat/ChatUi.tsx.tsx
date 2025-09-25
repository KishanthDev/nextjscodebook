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

export default function ChatUI() {
  const { messages: storeMessages, sendMessage, suggestedReplies } = useAIMessageHandler();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [messages, setMessages] = useState<{ fromUser: boolean; text: string; id: string; name?: string }[]>([]);
  const { acceptChats } = useUserStatus();
  const { settings, fetchSettings } = useSettingsStore();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Track processed messages per contact
  const processedLensRef = useRef<Record<string, number>>({});
  // Track unread counts per contact
  const unreadCountsRef = useRef<Record<string, number>>({});

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

  const [contacts, setContacts] = useState<Contact[]>([]);
  const userStatus = acceptChats ? "online" : "offline";

  // Initialize MQTT connection for agent
  useEffect(() => {
    if (!useAIMessageHandler.getState().client) {
      useAIMessageHandler.getState().connect(
        'chat/users/+',
        `agent-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
      );
    }
    return () => {
      // Keep connection alive
    };
  }, []);

  // Handle updates from storeMessages to contacts and messages
  useEffect(() => {
    setContacts(prevContacts => {
      const updatedContacts = [...prevContacts];
      const clientId = useAIMessageHandler.getState().clientId;

      Object.entries(storeMessages).forEach(([user, userMsgs]) => {
        if (!user || user === "undefined") return;

        const prevLen = processedLensRef.current[user] || 0;
        const newLen = userMsgs.length;
        const newMessages = userMsgs.slice(prevLen);

        // Update unread counts only for non-selected contacts
        if (selectedContact?.id !== user) {
          unreadCountsRef.current[user] = (unreadCountsRef.current[user] || 0) +
            newMessages.filter(m => m.sender !== clientId).length;
        } else {
          unreadCountsRef.current[user] = 0; // reset for selected contact
        }

        const unreadCount = unreadCountsRef.current[user];

        const lastMsg = userMsgs[newLen - 1];
        const lastUserMsg = userMsgs.slice().reverse().find(m => m.sender !== clientId);

        const contactIdx = updatedContacts.findIndex(c => c.id === user);

        if (contactIdx === -1) {
          updatedContacts.push({
            id: user,
            name: lastUserMsg?.name || user,
            status: "online",
            recentMsg: lastMsg?.text || "",
            time: "now",
            unread: unreadCount,
          });
        } else {
          const currentContact = updatedContacts[contactIdx];
          updatedContacts[contactIdx] = {
            ...currentContact,
            name: lastUserMsg?.name || currentContact.name || user,
            unread: unreadCount,
            recentMsg: lastMsg?.text || "",
            time: "now",
            status: "online",
          };
        }

        processedLensRef.current[user] = newLen;

        // Update messages if selected contact
        if (selectedContact?.id === user) {
          setMessages(userMsgs.map(m => ({
            text: m.text,
            fromUser: m.sender === clientId,
            id: m.id,
            name: m.name || m.sender,
          })));
        }
      });

      return updatedContacts;
    });

    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storeMessages, selectedContact]);

  const handleSendMessage = (text: string) => {
    if (selectedContact) {
      sendMessage(text, selectedContact.id);
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);

    // Reset unread count
    unreadCountsRef.current[contact.id] = 0;
    setContacts(prev =>
      prev.map(c => c.id === contact.id ? { ...c, unread: 0 } : c)
    );

    // Load messages
    const contactMsgs = storeMessages[contact.id] || [];
    const clientId = useAIMessageHandler.getState().clientId;
    setMessages(contactMsgs.map(m => ({
      text: m.text,
      fromUser: m.sender === clientId,
      id: m.id,
      name: m.name || m.sender,
    })));

    processedLensRef.current[contact.id] = contactMsgs.length;
  };

  return (
    <div className="flex h-[calc(100vh-3.3rem)] border border-gray-300 bg-white text-black transition-colors dark:border-gray-700 dark:bg-zinc-900 dark:text-white">
      <div className="w-[30%] min-w-[30%] max-w-[30%] border-r border-gray-300 dark:border-gray-700">
        <ContactList
          contacts={contacts}
          selectedContact={selectedContact}
          onSelect={handleSelectContact}
          userStatus={userStatus}
        />
      </div>

      <div className={`flex flex-col min-h-0 transition-all duration-300 ${profileExpanded ? "w-[40%]" : "w-[70%]"}`}>
        <ChatHeader contact={selectedContact} />
        <ChatMessages
          selected={!!selectedContact}
          messages={messages}
          settings={chatWidgetSettings}
        />
        <div ref={chatEndRef} />
        {selectedContact && (
          <ChatInput
            key={selectedContact.id}
            settings={chatWidgetSettings}
            onSend={(text) => {
              sendMessage(text, selectedContact.id);
              useAIMessageHandler.getState().setSuggestedReply('', selectedContact.id);
            }}
            suggestedReply={suggestedReplies[selectedContact.id] || ''}
          />
        )}
      </div>

      <div className={`transition-all duration-300 ${profileExpanded ? "w-[30%]" : "w-12"} border-l border-gray-300 dark:border-gray-700`}>
        <ContactProfile
          contact={selectedContact}
          expanded={profileExpanded}
          setExpanded={setProfileExpanded}
        />
      </div>
    </div>
  );
}
