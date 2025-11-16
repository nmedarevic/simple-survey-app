import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/atoms/Calendar';

// Calendar Component using shadcn
interface CalendarProps {
  selectedDate?: string;
  onDateSelect: (date: string) => void;
}

export const CalendarComponent: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const [selected, setSelected] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );

  useEffect(() => {
    if (selectedDate) {
      setSelected(new Date(selectedDate));
    }
  }, [selectedDate]);

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    if (date) {
      onDateSelect( date.toISOString());
    }
  };

  return (
    <div className="flex flex-row gap-4">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        className="w-1/2 rounded-md border shadow-sm"
        captionLayout="dropdown"
      />
      {selected && (
        <div className="text-sm text-center">
          Selected: <strong>{selected.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}</strong>
        </div>
      )}
    </div>
  );
};