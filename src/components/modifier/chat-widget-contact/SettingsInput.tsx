import { ChangeEvent } from 'react';

type Props = {
  label: string;
  name: string;
  placeholder: string;
  maxLength?: number;
  isColor?: boolean;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
};

export default function SettingsInput({ label, name, placeholder, maxLength, isColor, value, onChange, disabled }: Props) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-primary mb-2">{label}:</label>
      <div className="flex items-center border rounded-md overflow-hidden">
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full px-2 py-2 text-sm focus:outline-none"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
        />
        {isColor && (
          <input
            type="color"
            name={name}
            className="w-12 h-12 cursor-pointer border-l"
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}