import React, { useState, useEffect } from 'react';
import { Question, Serializer, ElementFactory } from 'survey-core';
import { SurveyQuestionElementBase, ReactQuestionFactory } from 'survey-react-ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';

export class DropdownQuestionModel extends Question {
  getType() {
    return 'dropdown-custom';
  }

  get selectedValue(): string | undefined {
    return this.getPropertyValue('selectedValue');
  }

  set selectedValue(val: string | undefined) {
    this.setPropertyValue('selectedValue', val);
    this.value = val;
  }

  get choices(): Array<{ value: string; text: string }> {
    return this.getPropertyValue('choices') || [];
  }

  set choices(val: Array<{ value: string; text: string }>) {
    this.setPropertyValue('choices', val);
  }

  get placeholder(): string {
    return this.getPropertyValue('placeholder') || 'Select an option...';
  }

  set placeholder(val: string) {
    this.setPropertyValue('placeholder', val);
  }
}

// Register properties for the dropdown question
Serializer.addClass(
  'dropdown-custom',
  [
    { name: 'selectedValue', default: '' },
    { name: 'choices:itemvalue[]', default: [] },
    { name: 'placeholder', default: 'Select an option...' },
  ],
  function () {
    return new DropdownQuestionModel('');
  },
  'question'
);

// Register the question type
ElementFactory.Instance.registerElement('dropdown-custom', (name) => {
  return new DropdownQuestionModel(name);
});

// Dropdown Component using shadcn
interface DropdownProps {
  selectedValue?: string;
  choices: Array<{ value: string; text: string }>;
  placeholder?: string;
  onValueSelect: (value: string) => void;
}

const DropdownComponent: React.FC<DropdownProps> = (props) => {
  const {
    selectedValue,
    choices,
    placeholder = 'Select an option...',
    onValueSelect,
  } = props

  console.log('\n\n', props, '\n\n');
  const [selected, setSelected] = useState<string | undefined>(selectedValue);

  useEffect(() => {
    setSelected(selectedValue);
  }, [selectedValue]);

  const handleSelect = (value: string) => {
    setSelected(value);
    onValueSelect(value);
  };
console.log('\n\n', choices, '\n\n');
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

// React component wrapper for SurveyJS
export class SurveyQuestionDropdown extends SurveyQuestionElementBase {
  constructor(props: any) {
    console.log('\n\n', props, '\n\n');
    super(props);
  }

  get question(): DropdownQuestionModel {
    return this.questionBase as DropdownQuestionModel;
  }

  handleValueSelect = (value: string) => {
    this.question.selectedValue = value;
  };

  renderElement() {
    console.log('\n\n', this.question.choices, '\n\n');
    return (
      <DropdownComponent
        selectedValue={this.question.selectedValue}
        choices={this.question.choices}
        placeholder={this.question.placeholder}
        onValueSelect={this.handleValueSelect}
      />
    );
  }
}

// Register the React component with SurveyJS
ReactQuestionFactory.Instance.registerQuestion('dropdown-custom', (props) => {
  return React.createElement(SurveyQuestionDropdown, props);
});
