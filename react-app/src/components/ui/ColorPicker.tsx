import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { cn } from '../../lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputValue(newColor);
    onChange(newColor);
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // Only update if it's a valid hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs text-text-secondary font-medium">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={handleColorChange}
            className="w-8 h-8 rounded-md border-2 border-border cursor-pointer overflow-hidden p-0"
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleTextChange}
          className="flex-1 h-8 rounded-md border border-border bg-bg-tertiary px-2 text-xs text-text-primary font-mono uppercase focus:border-accent focus:outline-none"
          maxLength={7}
        />
      </div>
    </div>
  );
}
