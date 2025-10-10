'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { TextInput, ColorInput, RangeInput, SelectInput } from './inputs';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/ui/button';
import { toast } from 'sonner';
import { LucideIconMap } from '@/lib/lucide-icons';


type ChatbarSettings = {
    text: string;
    bgColor: string;
    textColor: string;
    iconType: 'lucide' | 'image';
    iconColor: string;
    lucideIcon: keyof typeof LucideIcons;
    iconImageUrl: string;
    bubbleBgColor: string;
    dotsColor: string;
    width: number;
    height: number;
    borderRadius: number;
    shadow: boolean;
};



const defaultSettings: ChatbarSettings = {
    text: 'Chat with us',
    bgColor: '#007bff',
    textColor: '#ffffff',
    iconType: 'lucide',
    lucideIcon: 'MessageCircle',
    iconImageUrl: '',
    iconColor: '#ffffff',
    bubbleBgColor: '#007bff',
    dotsColor: '#ffffff',
    width: 255,
    height: 40,
    borderRadius: 12,
    shadow: true,
};

export default function ChatBarEditor() {
    const { resolvedTheme } = useTheme();
    const [isDark, setIsDark] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [settings, setSettings] = useState<ChatbarSettings>(defaultSettings);

    useEffect(() => {
        setIsDark(resolvedTheme === 'dark');
    }, [resolvedTheme]);

    const update = useCallback(<K extends keyof ChatbarSettings>(key: K, value: ChatbarSettings[K]) => {
        setSettings(s => ({ ...s, [key]: value }));
    }, []);

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chatbar-settings.json';
        a.click();
        URL.revokeObjectURL(url);
    };

const IconComponent = LucideIconMap[settings.lucideIcon];


    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 rounded-lg h-[calc(100vh-114px)]">

            {/* Controls */}
            <div className="lg:w-96 space-y-6 bg-white p-6 rounded-lg shadow-sm overflow-y-auto">
                <h2 className="text-lg font-semibold">Chat Bar Settings</h2>

                <TextInput
                    label="Text"
                    value={settings.text}
                    onChange={v => update('text', v)}
                    placeholder="Chat with us"
                />
                <ColorInput
                    label="Background"
                    value={settings.bgColor}
                    onChange={v => update('bgColor', v)}
                />
                <ColorInput
                    label="Text Color"
                    value={settings.textColor}
                    onChange={v => update('textColor', v)}
                />
                <SelectInput
                    label="Icon Type"
                    value={settings.iconType}
                    onChange={v => update('iconType', v as 'lucide' | 'image')}
                    options={[
                        { value: 'lucide', label: 'Lucide Icon' },
                        { value: 'image', label: 'Image URL' },
                    ]}
                />
                {settings.iconType === 'lucide' ? (
                    <SelectInput
                        label="Lucide Icon"
                        value={settings.lucideIcon}
                        onChange={v => update('lucideIcon', v as keyof typeof LucideIcons)}
                        options={Object.keys(LucideIcons).map(name => ({
                            value: name,
                            label: name,
                        }))}
                    />
                ) : (
                    <TextInput
                        label="Icon Image URL"
                        value={settings.iconImageUrl}
                        onChange={v => update('iconImageUrl', v)}
                        placeholder="https://..."
                    />
                )}

                <ColorInput
                    label="Bubble Background"
                    value={settings.bubbleBgColor}
                    onChange={v => update('bubbleBgColor', v)}
                />
                <ColorInput
                    label="Dots Color"
                    value={settings.dotsColor}
                    onChange={v => update('dotsColor', v)}
                />
                <RangeInput
                    label="Width"
                    value={settings.width}
                    onChange={v => update('width', v)}
                    min={150} max={400} step={5}
                />
                <RangeInput
                    label="Height"
                    value={settings.height}
                    onChange={v => update('height', v)}
                    min={32} max={64} step={1}
                />
                <RangeInput
                    label="Border Radius"
                    value={settings.borderRadius}
                    onChange={v => update('borderRadius', v)}
                    min={0} max={20} step={1}
                />
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={settings.shadow}
                        onChange={e => update('shadow', e.target.checked)}
                        id="shadowToggle"
                        className="h-4 w-4"
                    />
                    <label htmlFor="shadowToggle" className="text-sm">Shadow</label>
                </div>
            </div>

            {/* Preview */}
            <div className="flex-1 relative bg-gray-50 rounded p-6 flex justify-center items-center">
                {/* Save & Download */}
                <div className="absolute top-4 right-4 flex space-x-2 z-10">
                     <Button size="sm" 
                              onClick={async () => {
                                try {
                                  const settingsJson = JSON.stringify(settings, null, 2);
                                  await navigator.clipboard.writeText(settingsJson);
                                  toast.success('ChatBar settings copied to clipboard!');
                                } catch (err) {
                                  toast.error(`Failed to copy: ${String(err)}`);
                                  alert('Failed to copy settings. Check console.');
                                }
                              }}
                            >
                              Copy Settings
                            </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>Download</Button>
                </div>

                <div
                    className="flex justify-between items-center transition-all duration-200 cursor-pointer"
                    style={{
                        width: `${settings.width}px`,
                        height: `${settings.height}px`,
                        backgroundColor: settings.bgColor,
                        color: settings.textColor,
                        borderRadius: `${settings.borderRadius}px`,
                        boxShadow: settings.shadow
                            ? isDark
                                ? '0 2px 8px rgba(0,0,0,0.6)'
                                : '0 2px 8px rgba(0,0,0,0.2)'
                            : 'none',
                        padding: '0 12px',
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <span className="font-medium">{settings.text}</span>
                    {settings.iconType === 'lucide' && IconComponent ? (
                        <IconComponent
                            size={20}
                            color={settings.iconColor}
                            className={hovered ? 'opacity-100' : 'opacity-80'}
                        />
                    ) : (
                        <img
                            src={settings.iconImageUrl}
                            alt="icon"
                            width={20}
                            height={20}
                            className="rounded"
                        />
                    )}

                </div>
            </div>
        </div>
    );
}
