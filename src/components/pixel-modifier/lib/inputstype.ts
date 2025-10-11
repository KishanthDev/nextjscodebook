export interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
export interface RangeInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  className?: string;
}
export interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}
export interface CheckboxInputProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
export interface GradientStopEditorProps {
  stops: { color: string; pos: number }[];
  onChange: (stops: { color: string; pos: number }[]) => void;
}
export interface SelectInputProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}