'use client';

import React, { useState, useEffect } from 'react';
import CustomerSelect from '@/components/widget-builder/poc/CustomerSelect';
import WidgetSelect from '@/components/widget-builder/WidgetSelect';
import { useCustomerStore } from '@/components/widget-builder/poc/useCustomerStore';

import newBubbleJson from '@/defaults/newbubble.json';
import newChatBarJson from '@/defaults/newchatbar.json';
import newChatWidgetJson from '@/defaults/newchatwidget.json';
import { BubbleWidget, ChatBarWidget, ChatWidgetOpen } from '@/components/widget-builder/widgetTypes';

export default function FlavorPageMulti() {
  const { selectedCustomer } = useCustomerStore();

  const newBubble: BubbleWidget[] = newBubbleJson as unknown as BubbleWidget[];
  const newChatBar: ChatBarWidget[] = newChatBarJson as unknown as ChatBarWidget[];
  const newChatWidget: ChatWidgetOpen[] = newChatWidgetJson as unknown as ChatWidgetOpen[];

  // Track which widget types are selected
  const [selectedTypes, setSelectedTypes] = useState<{
    bubble: boolean;
    chat: boolean;
    chatwidgetopen: boolean;
  }>({ bubble: true, chat: false, chatwidgetopen: false });

  const [selectedBubble, setSelectedBubble] = useState<BubbleWidget>(newBubble[0]);
  const [selectedChatBar, setSelectedChatBar] = useState<ChatBarWidget>(newChatBar[0]);
  const [selectedChatWidget, setSelectedChatWidget] = useState<ChatWidgetOpen>(newChatWidget[0]);

  // Auto-select first widget per type for customer
  useEffect(() => {
    if (!selectedCustomer) return;

    if (selectedTypes.bubble) {
      const bubbleForCust = newBubble.find(b => b.custId === String(selectedCustomer.id));
      if (bubbleForCust) setSelectedBubble(bubbleForCust);
    }
    if (selectedTypes.chat) {
      const chatForCust = newChatBar.find(c => c.custId === String(selectedCustomer.id));
      if (chatForCust) setSelectedChatBar(chatForCust);
    }
    if (selectedTypes.chatwidgetopen) {
      const widgetForCust = newChatWidget.find(w => w.custId === String(selectedCustomer.id));
      if (widgetForCust) setSelectedChatWidget(widgetForCust);
    }
  }, [selectedCustomer, selectedTypes]);

  const handleSave = () => {
    const savedWidgets: any = {};
    if (selectedTypes.bubble) savedWidgets.bubble = selectedBubble;
    if (selectedTypes.chat) savedWidgets.chat = selectedChatBar;
    if (selectedTypes.chatwidgetopen) savedWidgets.chatwidget = selectedChatWidget;

    console.log('Saved widgets for customer', selectedCustomer?.name, savedWidgets);
    alert(`Saved widgets for ${selectedCustomer?.name}`);
  };

  const toggleType = (type: keyof typeof selectedTypes) => {
    setSelectedTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="p-4 space-y-4">
      <CustomerSelect />

      {/* Widget Type Toggles */}
      {selectedCustomer && (
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selectedTypes.bubble}
              onChange={() => toggleType('bubble')}
            />
            Bubble
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selectedTypes.chat}
              onChange={() => toggleType('chat')}
            />
            Chat
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selectedTypes.chatwidgetopen}
              onChange={() => toggleType('chatwidgetopen')}
            />
            Chat Widget
          </label>
        </div>
      )}

      {/* Widget Select Dropdowns for selected types */}
      {selectedCustomer && (
        <>
          {selectedTypes.bubble && (
            <WidgetSelect
              type="bubble"
              selectedId={selectedBubble._id}
              onSelect={setSelectedBubble}
            />
          )}
          {selectedTypes.chat && (
            <WidgetSelect
              type="chat"
              selectedId={selectedChatBar._id}
              onSelect={setSelectedChatBar}
            />
          )}
          {selectedTypes.chatwidgetopen && (
            <WidgetSelect
              type="chatwidgetopen"
              selectedId={selectedChatWidget._id}
              onSelect={setSelectedChatWidget}
            />
          )}
        </>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={!selectedCustomer}
      >
        Save
      </button>
    </div>
  );
}
