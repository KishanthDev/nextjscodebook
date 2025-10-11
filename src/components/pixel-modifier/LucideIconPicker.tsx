'use client';

import React, { useState, useEffect } from 'react';
import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/ui/command";
import { LucideProps } from "lucide-react";

type LucideModule = Record<string, React.FC<LucideProps>>;

interface LucideIconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const COMMON_ICONS = [
  "Search",
  "User",
  "Settings",
  "Heart",
  "Star",
  "Home",
  "Bell",
  "Camera",
  "Check",
  "AlertCircle",
];

export const LucideIconPicker: React.FC<LucideIconPickerProps> = ({ value, onChange }) => {
  const [icons, setIcons] = useState<LucideModule | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

useEffect(() => {
  import('lucide-react')
    .then(mod => {
      // Filter only exports that are React components
      const namedIcons: LucideModule = {};
      for (const [key, value] of Object.entries(mod)) {
        if (
          typeof value === 'function' &&
          // function with .render or name might indicate a component
          ('render' in value || /^([A-Z]|[a-z])/.test(key))
        ) {
          namedIcons[key] = value as unknown as React.FC<LucideProps>;
        }
      }
      setIcons(namedIcons);
    })
    .catch(err => console.error('Failed to load lucide icons', err));
}, []);


  const SelectedIcon = icons?.[value as keyof LucideModule];

  // ✅ Filter icons using top input
  const filteredIcons = COMMON_ICONS.filter(name =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-medium">Lucide Icon</label>

      {/* Top search bar (acts as dropdown trigger) */}
      <div className="relative">
        <input
          type="text"
          value={search || value}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Select or search icon..."
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
        />
        {SelectedIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <SelectedIcon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {open && icons && (
        <div className="absolute z-50 mt-1 w-full border rounded-md bg-popover shadow-md">
          <Command>
            <CommandList>
              {filteredIcons.length === 0 ? (
                <CommandEmpty>No icons found.</CommandEmpty>
              ) : (
                <CommandGroup heading="Common Icons">
                  {filteredIcons.map(name => {
                    const Icon = icons[name as keyof LucideModule];
                    return (
                      <CommandItem
                        key={name}
                        onSelect={() => {
                          onChange(name);
                          setSearch('');
                          setOpen(false);
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
