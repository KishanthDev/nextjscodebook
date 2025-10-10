import React, { useState } from 'react';
import { TextInputProps, RangeInputProps, ColorInputProps, SelectInputProps, CheckboxInputProps, GradientStopEditorProps } from './inputstype';

export const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, placeholder, className = "w-full" }) => (
    <label className="block">
        <span className="text-sm font-medium text-gray-700">{label}:</span>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        />
    </label>
);

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
                <span className="text-sm font-medium text-gray-700">{label}:</span>
                <div className="flex items-center bg-gray-100 rounded overflow-hidden">
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
                            className="w-16 px-2 py-1 text-xs text-center bg-white border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={handleValueClick}
                            className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className={`${className} h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider`}
            />
        </label>
    );
};

export const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => (
    <label className="block">
        <span className="text-sm font-medium text-gray-700">{label}:</span>
        <div className="mt-1 flex items-center gap-2">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <span className="text-xs text-gray-500 font-mono">{value}</span>
        </div>
    </label>
);

export function SelectInput<T extends string>({
    label,
    value,
    onChange,
    options,
    className = "w-full"
}: SelectInputProps<T>) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-gray-700">{label}:</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
                className={`mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({ label, checked, onChange }) => (
    <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
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
            <div className="font-medium text-sm text-gray-700">Gradient Stops</div>
            {stops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
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
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200"
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={addStop}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 border border-blue-300 rounded hover:bg-blue-200"
            >
                Add Stop
            </button>
        </div>
    );
};