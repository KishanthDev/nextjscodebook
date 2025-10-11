'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { TextInput, ColorInput, RangeInput, SelectInput, CheckboxInput, GradientStopEditor } from './inputs';
import { Button } from '@/ui/button';
import { toast } from 'sonner';
import { LucideIconMap } from '@/lib/lucide-icons';
import { LucideIconPicker } from './LucideIconPicker';

type ChatbarSettings = {
    text: string;
    bgColor: string;
    textColor: string;
    gradientEnabled: boolean;
    gradientStops: { color: string; pos: number }[];
    gradientType: 'linear' | 'radial' | 'conic';
    gradientAngle: number;

    iconType: 'lucide' | 'image';
    iconColor: string;
    lucideIcon: string;
    iconImageUrl: string;
    iconFit: 'contain' | 'cover';
    iconOpacity: number;
    iconBlend: string;

    width: number;
    height: number;
    borderRadius: number;
    shadow: boolean;
};

const defaultSettings: ChatbarSettings = {
    text: 'Chat with us',
    bgColor: '#007bff',
    textColor: '#ffffff',
    gradientEnabled: false,
    gradientStops: [
        { color: '#007bff', pos: 0 },
        { color: '#a855f7', pos: 100 },
    ],
    gradientType: 'linear',
    gradientAngle: 90,

    iconType: 'lucide',
    iconColor: '#ffffff',
    lucideIcon: 'MessageCircle',
    iconImageUrl: '',
    iconFit: 'contain',
    iconOpacity: 1,
    iconBlend: 'normal',

    width: 255,
    height: 40,
    borderRadius: 12,
    shadow: true,
};


export default function ChatBarEditor() {
    const { resolvedTheme } = useTheme();
    const [isDark, setIsDark] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [settings, setSettings] = useState(defaultSettings);

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

    // Gradient background logic
    const backgroundStyle = useMemo(() => {
        if (!settings.gradientEnabled) return settings.bgColor;
        const stops = settings.gradientStops.map(s => `${s.color} ${s.pos}%`).join(', ');
        switch (settings.gradientType) {
            case 'linear':
                return `linear-gradient(${settings.gradientAngle}deg, ${stops})`;
            case 'radial':
                return `radial-gradient(circle, ${stops})`;
            case 'conic':
                return `conic-gradient(from ${settings.gradientAngle}deg, ${stops})`;
            default:
                return settings.bgColor;
        }
    }, [
        settings.gradientEnabled,
        settings.gradientType,
        settings.gradientAngle,
        settings.gradientStops,
        settings.bgColor,
    ]);

    const IconComponent = settings.iconType === 'lucide' ? LucideIconMap[settings.lucideIcon] : null;

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 rounded-lg h-[calc(100vh-114px)]">
            {/* Controls */}
            <div className="lg:w-96 space-y-6 bg-white p-6 rounded-lg shadow-sm overflow-y-auto">
                <h2 className="text-lg font-semibold">Chat Bar Settings</h2>
                <TextInput label="Text" value={settings.text} onChange={v => update('text', v)} placeholder="Chat with us" />
                <ColorInput label="Background" value={settings.bgColor} onChange={v => update('bgColor', v)} />
                <ColorInput label="Text Color" value={settings.textColor} onChange={v => update('textColor', v)} />
                <CheckboxInput label="Enable Gradient?" checked={settings.gradientEnabled} onChange={v => update('gradientEnabled', v)} />
                {settings.gradientEnabled && (
                    <>
                        <SelectInput
                            label="Gradient Type"
                            value={settings.gradientType}
                            onChange={v => update('gradientType', v as any)}
                            options={[
                                { value: 'linear', label: 'Linear' },
                                { value: 'radial', label: 'Radial' },
                                { value: 'conic', label: 'Conic' },
                            ]}
                        />
                        <RangeInput
                            label="Angle"
                            value={settings.gradientAngle}
                            onChange={v => update('gradientAngle', v)}
                            min={0}
                            max={360}
                            step={1}
                            unit="°"
                        />
                        <GradientStopEditor stops={settings.gradientStops} onChange={v => update('gradientStops', v)} />
                    </>
                )}

                <SelectInput
                    label="Icon Type"
                    value={settings.iconType}
                    onChange={v => update('iconType', v as any)}
                    options={[
                        { value: 'lucide', label: 'Lucide Icon' },
                        { value: 'image', label: 'Image URL' }
                    ]}
                />
                {settings.iconType === 'lucide' ? (
                    <>
                        <LucideIconPicker value={settings.lucideIcon} onChange={v => update('lucideIcon', v)} />
                        <ColorInput label="Icon Color" value={settings.iconColor} onChange={v => update('iconColor', v)} />
                    </>
                ) : (
                    <>
                        <TextInput
                            label="Icon Image URL"
                            value={settings.iconImageUrl}
                            onChange={v => update('iconImageUrl', v)}
                            placeholder="https://..."
                        />
                        <SelectInput
                            label="Image Fit"
                            value={settings.iconFit}
                            onChange={v => update('iconFit', v as any)}
                            options={[
                                { value: 'contain', label: 'Contain' },
                                { value: 'cover', label: 'Cover' },
                            ]}
                        />
                        <RangeInput
                            label="Image Opacity"
                            value={settings.iconOpacity}
                            onChange={v => update('iconOpacity', v)}
                            min={0}
                            max={1}
                            step={0.05}
                        />
                        <SelectInput
                            label="Blend Mode"
                            value={settings.iconBlend}
                            onChange={v => update('iconBlend', v)}
                            options={[
                                { value: 'normal', label: 'Normal' },
                                { value: 'multiply', label: 'Multiply' },
                                { value: 'screen', label: 'Screen' },
                                { value: 'overlay', label: 'Overlay' },
                                { value: 'darken', label: 'Darken' },
                                { value: 'lighten', label: 'Lighten' },
                                { value: 'color-dodge', label: 'Color Dodge' },
                                { value: 'color-burn', label: 'Color Burn' },
                                { value: 'hard-light', label: 'Hard Light' },
                                { value: 'soft-light', label: 'Soft Light' },
                                { value: 'difference', label: 'Difference' },
                                { value: 'exclusion', label: 'Exclusion' }
                            ]}
                        />
                    </>
                )}

                <RangeInput label="Width" value={settings.width} onChange={v => update('width', v)} min={150} max={400} step={5} />
                <RangeInput label="Height" value={settings.height} onChange={v => update('height', v)} min={32} max={64} step={1} />
                <RangeInput label="Border Radius" value={settings.borderRadius} onChange={v => update('borderRadius', v)} min={0} max={20} step={1} />
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
                        }}>
                        Copy Settings
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>Download</Button>
                </div>

                <div
                    className="flex justify-between items-center transition-all duration-200 cursor-pointer"
                    style={{
                        width: `${settings.width}px`,
                        height: `${settings.height}px`,
                        background: backgroundStyle,
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
                        settings.iconImageUrl ? (
                            <img
                                src={settings.iconImageUrl}
                                alt="icon"
                                width={20}
                                height={20}
                                style={{
                                    objectFit: settings.iconFit,
                                    opacity: settings.iconOpacity,
                                    mixBlendMode: settings.iconBlend as any,
                                }}
                                className="rounded"
                            />
                        ) : null
                    )}
                </div>
            </div>
        </div>
    );
}
