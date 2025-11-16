import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';

// Dropdown Component using shadcn
interface DropdownProps {
  selectedValue?: string;
  choices: Array<{ value: string; text: string }>;
  placeholder?: string;
  onValueSelect: (value: string) => void;
}

export const DropdownComponent: React.FC<DropdownProps> = (props) => {
  const {
    selectedValue,
    choices,
    placeholder = 'Select an option...',
    onValueSelect,
  } = props

  const [selected, setSelected] = useState<string | undefined>(selectedValue);

  useEffect(() => {
    setSelected(selectedValue);
  }, [selectedValue]);

  const handleSelect = (value: string) => {
    setSelected(value);
    onValueSelect(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <Select value={selected} onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {choices.map((choice) => (
            <SelectItem key={choice.value} value={choice.value}>
              {choice.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected && (
        <div className="text-sm text-muted-foreground">
          Selected: <strong>{choices.find((c) => c.value === selected)?.text || selected}</strong>
        </div>
      )}
    </div>
  );
};
