import React, { useState } from 'react';
import { TextInputProps, RangeInputProps, ColorInputProps, SelectInputProps, CheckboxInputProps, GradientStopEditorProps } from './inputstype';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Checkbox } from '@/registry/new-york-v4/ui/checkbox';
import { Input } from '@/ui/input';

export const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChange,
    placeholder,
    className = "w-full"
}) => {
    return (
        <div className={`flex flex-col ${className}`}>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Label>
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="mt-1"
            />
        </div>
    );
};

export const RangeInput: React.FC<RangeInputProps> = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    unit = 'px',
    className = "w-full"
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value.toString());

    const handleInputChange = (newValue: string) => {
        setEditValue(newValue);
    };

    const handleInputBlur = () => {
        const numValue = parseFloat(editValue);
        if (!isNaN(numValue)) {
            const clampedValue = Math.min(Math.max(numValue, min), max);
            onChange(clampedValue);
            setEditValue(clampedValue.toString());
        } else {
            setEditValue(value.toString());
        }
        setIsEditing(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleInputBlur();
        } else if (e.key === 'Escape') {
            setEditValue(value.toString());
            setIsEditing(false);
        }
    };

    const handleValueClick = () => {
        setIsEditing(true);
        setEditValue(value.toString());
    };

    // Update editValue when value prop changes and not editing
    React.useEffect(() => {
        if (!isEditing) {
            setEditValue(value.toString());
        }
    }, [value, isEditing]);

    return (
        <label className="block">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}:</span>
                <div className="flex items-center bg-gray-100 dark:bg-neutral-800 rounded overflow-hidden">
                    {isEditing ? (
                        <input
                            type="number"
                            value={editValue}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onBlur={handleInputBlur}
                            onKeyDown={handleInputKeyDown}
                            min={min}
                            max={max}
                            step={step}
                            className="w-16 px-2 py-1 text-xs text-center bg-white dark:bg-neutral-900 dark:text-gray-200 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                            autoFocus
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={handleValueClick}
                            className="px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                        >
                            {value}{unit}
                        </button>
                    )}
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={`${className} h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider`}
            />
        </label>
    );
};

export const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => (
    <label className="block">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}:</span>
        <div className="mt-1 flex items-center gap-2">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-12 h-8 border border-gray-300 dark:border-neutral-600 rounded cursor-pointer bg-white dark:bg-neutral-800"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{value}</span>
        </div>
    </label>
);

//
// 🟨 Select Input
//
export function SelectInput<T extends string>({
    label,
    value,
    onChange,
    options,
}: SelectInputProps<T>) {
    return (
        <div className="space-y-1">
            <Label className="text-gray-700 dark:text-gray-300">{label}</Label>
            <Select value={value} onValueChange={(val) => onChange(val as T)}>
                <SelectTrigger className="dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-200">
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="dark:bg-neutral-800 dark:border-neutral-600">
                    {options.map((opt) => (
                        <SelectItem 
                            key={opt.value} 
                            value={opt.value}
                            className="dark:text-gray-200 dark:focus:bg-neutral-700 dark:hover:bg-neutral-700"
                        >
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

//
// 🟪 Checkbox Input
//
export const CheckboxInput: React.FC<CheckboxInputProps> = ({ label, checked, onChange }) => (
    <div className="flex items-center space-x-2">
        <Checkbox 
            checked={checked} 
            onCheckedChange={(v) => onChange(!!v)}
            className="dark:border-neutral-600 dark:data-[state=checked]:bg-blue-600"
        />
        <Label className="text-gray-700 dark:text-gray-300 cursor-pointer">{label}</Label>
    </div>
);

export const GradientStopEditor: React.FC<GradientStopEditorProps> = ({ stops, onChange }) => {
    const addStop = () => {
        onChange([...stops, { color: '#ffffff', pos: 50 }]);
    };

    const removeStop = (index: number) => {
        if (stops.length > 1) {
            onChange(stops.filter((_, i) => i !== index));
        }
    };

    const updateStop = (index: number, field: 'color' | 'pos', value: string | number) => {
        const newStops = [...stops];
        newStops[index] = { ...newStops[index], [field]: value };
        onChange(newStops);
    };

    return (
        <div className="space-y-3">
            <div className="font-medium text-sm text-gray-700 dark:text-gray-300">Gradient Stops</div>
            {stops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-neutral-800 rounded border border-gray-200 dark:border-neutral-700">
                    <ColorInput
                        label=""
                        value={stop.color}
                        onChange={(color) => updateStop(idx, 'color', color)}
                    />
                    <RangeInput
                        label=""
                        value={stop.pos}
                        onChange={(pos) => updateStop(idx, 'pos', pos)}
                        min={0}
                        max={100}
                        unit="%"
                        className="flex-1"
                    />
                    {stops.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeStop(idx)}
                            className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={addStop}
                className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
                Add Stop
            </button>
        </div>
    );
};
