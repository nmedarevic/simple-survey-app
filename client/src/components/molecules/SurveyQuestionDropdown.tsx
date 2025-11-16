import React from 'react';
import { Question, Serializer, ElementFactory } from 'survey-core';
import { SurveyQuestionElementBase, ReactQuestionFactory } from 'survey-react-ui';
import { DropdownComponent } from './Dropdown';

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
    const rawChoices = this.getPropertyValue('choices') || [];
    // Convert SurveyJS ItemValue format to our format
    return rawChoices.map((choice: any) => ({
      value: choice.value || choice,
      text: choice.text || choice.value || choice
    }));
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
    { name: 'placeholder', default: '' },
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


// React component wrapper for SurveyJS
export class SurveyQuestionDropdown extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }

  get question(): DropdownQuestionModel {
    return this.questionBase as DropdownQuestionModel;
  }

  handleValueSelect = (value: string) => {
    this.question.selectedValue = value;
  };

  renderElement() {
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
