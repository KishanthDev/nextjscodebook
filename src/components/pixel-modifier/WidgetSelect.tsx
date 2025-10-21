'use client';

import * as React from "react";
import { useMemo, useEffect } from "react";
import { useCustomerStore } from "./poc/useCustomerStore";

import newBubble from "@/defaults/newbubble.json";
import newChatBar from "@/defaults/newchatbar.json";
import newChatWidget from "@/defaults/newchatwidget.json";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

interface WidgetSelectProps {
  type: "bubble" | "chat" | "chatwidgetopen";
  selectedId: string;
  onSelect: (item: any) => void;
}

export default function WidgetSelect({ type, selectedId, onSelect }: WidgetSelectProps) {
  const { selectedCustomer } = useCustomerStore();

  // 1️⃣ Pick dataset based on active tab
  const dataSource = useMemo(() => {
    switch (type) {
      case "chat":
        return newChatBar;
      case "chatwidgetopen":
        return newChatWidget;
      default:
        return newBubble;
    }
  }, [type]);

  // 2️⃣ Filter items by selected customer ID
  const filteredItems = useMemo(() => {
    if (!selectedCustomer) return [];
    return dataSource.filter((b) => b.custId === String(selectedCustomer.id));
  }, [selectedCustomer, dataSource]);

  // 3️⃣ Automatically select the first item whenever customer or tab changes
  useEffect(() => {
    if (filteredItems.length > 0) {
      onSelect(filteredItems[0]);
    }
  }, [filteredItems, onSelect]);

  // 4️⃣ Handle manual selection change
  const handleChange = (value: string) => {
    const found = filteredItems.find((b) => b._id === value);
    if (found) onSelect(found);
  };

  // 5️⃣ Define label and placeholder dynamically
  const label =
    type === "chat"
      ? "Select Chat Bar:"
      : type === "chatwidgetopen"
      ? "Select Chat Widget:"
      : "Select Bubble:";

  // 6️⃣ Show fallback messages if no customer or data
  if (!selectedCustomer)
    return (
      <div className="text-sm text-gray-500 italic px-2">
        Select a customer to view {type} options.
      </div>
    );

  if (filteredItems.length === 0)
    return (
      <div className="text-sm text-gray-500 italic px-2">
        No {type} found for {selectedCustomer.name}.
      </div>
    );

  // 7️⃣ Get proper name field per type
  const getDisplayName = (item: any) => {
    switch (type) {
      case "chat":
        return item.chatBarName || `Chat Bar ${item._id}`;
      case "chatwidgetopen":
        return item.chatWidgetName || `Chat Widget ${item._id}`;
      default:
        return item.bubbleName || `Bubble ${item._id}`;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <label className="font-medium text-sm text-gray-600">{label}</label>
      <Select value={selectedId} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={`Choose ${type}`} />
        </SelectTrigger>
        <SelectContent>
          {filteredItems.map((item) => (
            <SelectItem key={item._id} value={item._id}>
              {getDisplayName(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
