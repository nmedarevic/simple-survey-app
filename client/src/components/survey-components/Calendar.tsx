import React, { useState, useEffect } from 'react';
import { Question, Serializer, ElementFactory } from 'survey-core';
import { SurveyQuestionElementBase, ReactQuestionFactory } from 'survey-react-ui';
import { Calendar } from '@/components/molecules/Calendar';

// Calendar Question Model
export class CalendarQuestionModel extends Question {
  getType() {
    return 'calendar';
  }

  get selectedDate(): string | undefined {
    return this.getPropertyValue('selectedDate');
  }

  set selectedDate(val: string | undefined) {
    this.setPropertyValue('selectedDate', val);
    this.value = val;
  }
}

// Register properties for the calendar question
Serializer.addClass(
  'calendar',
  [
    { name: 'selectedDate', default: '' },
    { name: 'minDate', default: '' },
    { name: 'maxDate', default: '' },
  ],
  function () {
    return new CalendarQuestionModel('');
  },
  'question'
);

// Register the question type
ElementFactory.Instance.registerElement('calendar', (name) => {
  return new CalendarQuestionModel(name);
});

// Calendar Component using shadcn
interface CalendarProps {
  selectedDate?: string;
  onDateSelect: (date: string) => void;
}

const CalendarComponent: React.FC<CalendarProps> = ({
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

// React component wrapper for SurveyJS
export class SurveyQuestionCalendar extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }

  get question(): CalendarQuestionModel {
    return this.questionBase as CalendarQuestionModel;
  }

  handleDateSelect = (date: string) => {
    this.question.selectedDate = date;
  };

  renderElement() {
    return (
      <CalendarComponent
        selectedDate={this.question.selectedDate}
        onDateSelect={this.handleDateSelect}
      />
    );
  }
}

// Register the React component with SurveyJS
ReactQuestionFactory.Instance.registerQuestion('calendar', (props) => {
  return React.createElement(SurveyQuestionCalendar, props);
});

