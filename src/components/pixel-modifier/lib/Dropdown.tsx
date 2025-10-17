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
    <div className="mb-4 w-64">
      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
        Select Chat Widget
      </label>

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
