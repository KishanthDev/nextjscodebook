'use client';

import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Switch } from "@/ui/switch";
import { Button } from "@/ui/button";
import React, { useState } from "react";
import { toast } from "sonner"; // <-- import Sonner

export function Field({ 
  label, 
  value, 
  type = "text", 
  onChange 
}: { 
  label: string; 
  value: any; 
  type?: string; 
  onChange: (newValue: any) => void;
}) {
  if (type === "boolean") {
    return (
      <div className="flex items-center justify-between w-full">
        <span className="text-gray-700 dark:text-gray-300 text-sm">{label}</span>
        <Switch checked={value} onCheckedChange={onChange}/>
      </div>
    );
  }
  if (type === "textarea") {
    return (
      <div className="flex flex-col space-y-1 w-full">
        <span className="text-gray-700 dark:text-gray-300 text-sm">{label}</span>
        <Textarea value={value} onChange={e => onChange(e.target.value)} rows={3} />
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-1 w-full">
      <span className="text-gray-700 dark:text-gray-300 text-sm">{label}</span>
      <Input type={type} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

export default function ProfileSection({
  title,
  data,
  fields,
  setField,
  fieldTypes = {},
  customFields = {}
}: {
  title: string,
  data: Record<string, any>,
  fields: string[],
  setField: (key: string, value: any) => void,
  fieldTypes?: Record<string, string>,
  customFields?: Record<string, React.ReactNode>
}) {
  const [local, setLocal] = useState(data);

  const handleFieldChange = (key: string, value: any) => {
    setLocal({ ...local, [key]: value });
  };

  const saveChanges = () => {
    Object.entries(local).forEach(([key, value]) => {
      setField(key, value); // updates Zustand
    });

    toast.success(`${title} saved successfully!`); // <-- show notification
  };

  const cancelChanges = () => setLocal(data);

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-900 max-w-md mx-auto">
      <h2 className="text-center font-semibold text-lg text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <div className="flex flex-col space-y-3">
        {fields.map(key =>
          customFields[key] ? customFields[key] : (
            <Field
              key={key}
              label={key
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/^./, str => str.toUpperCase())
                .replace(/([A-Z])/g, ' $1')
                .trim()
              }
              value={local[key]}
              type={fieldTypes[key] || 
                (typeof local[key] === "boolean"
                  ? "boolean"
                  : key === "email"
                  ? "email"
                  : key === "phone"
                  ? "tel"
                  : key === "summary"
                  ? "textarea"
                  : "text")}
              onChange={value => handleFieldChange(key, value)}
            />
          )
        )}

        <div className="flex justify-center gap-3 pt-3">
          <Button variant="outline" className="px-6" onClick={cancelChanges}>Cancel</Button>
          <Button className="px-6" onClick={saveChanges}>Save</Button>
        </div>
      </div>
    </div>
  );
}
