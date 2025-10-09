'use client';

import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Switch } from "@/ui/switch";
import { Button } from "@/ui/button";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

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
            <div className="flex items-center justify-between w-full text-xs">
                <span className="text-gray-700 pb-0.5 dark:text-gray-300">{label}</span>
                <Switch checked={value ?? false} onCheckedChange={onChange} />
            </div>
        );
    }

    if (type === "textarea") {
        return (
            <div className="flex flex-col w-full text-xs">
                <span className="text-gray-700 pb-0.5 dark:text-gray-300">{label}</span>
                <Textarea value={value ?? ""} onChange={e => onChange(e.target.value)} rows={2} className="text-xs" />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full text-xs">
            <span className="text-gray-700 pb-0.5 dark:text-gray-300">{label}</span>
            <Input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} className="text-xs h-8" />
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
    setField: (data: Record<string, any>) => void, // <-- expects full object now
    fieldTypes?: Record<string, string>,
    customFields?: Record<string, React.ReactNode>
}) {
    const [local, setLocal] = useState(data);

    // Keep local in sync if `data` prop changes
    useEffect(() => {
        setLocal(data);
    }, [data]);

    const handleFieldChange = (key: string, value: any) => {
        setLocal(prev => ({ ...prev, [key]: value }));
    };

    const saveChanges = () => {
        setField(local); // bulk update
        toast.success(`${title} saved successfully!`);
    };

    const cancelChanges = () => setLocal(data);

    return (
        <div className="p-3 space-y-1 bg-gray-50 dark:bg-gray-900 max-w-md mx-auto rounded-sm shadow-lg">
            <h2 className="text-center font-medium text-base text-gray-900 dark:text-gray-100">{title}</h2>
            <div className="flex flex-col space-y-2">
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

                <div className="flex justify-center gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={cancelChanges}>Cancel</Button>
                    <Button size="sm" onClick={saveChanges}>Save</Button>
                </div>
            </div>
        </div>
    );
}
