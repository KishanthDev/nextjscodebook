'use client';

import React from 'react';
import { useConfigStore, ChatWidgetConfig } from '@/stores/useConfigStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';

export default function WidgetDropdown() {
  const { widgets, currentWidgetId, setCurrentWidget } = useConfigStore();

  if (!widgets || widgets.length === 0) return <div>No widgets available</div>;

  const handleChange = (value: string) => {
    setCurrentWidget(Number(value));
  };

  return (
    <div className="w-64">
      <Select value={currentWidgetId?.toString() ?? widgets[0].id.toString()} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a widget" />
        </SelectTrigger>
        <SelectContent>
          {widgets.map((widget: ChatWidgetConfig) => (
            <SelectItem key={widget.id} value={widget.id.toString()}>
              {`${widget.id} - Chat Widget`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
