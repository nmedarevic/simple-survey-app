import React from 'react';
import { Question, Serializer, ElementFactory } from 'survey-core';
import { SurveyQuestionElementBase, ReactQuestionFactory } from 'survey-react-ui';
import { CalendarComponent } from './Calendar';

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

