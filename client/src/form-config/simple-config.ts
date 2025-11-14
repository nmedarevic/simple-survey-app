export type SurveyValidator = {
  type: string;
  text: string;
  expression: string;
};

export const simpleConfig = {
  pages: [
    {
    elements: [{
      name: "first-name",
      title: "Enter your first name:",
      type: "text",
      validators: [{
        "type": "expression",
        "text": "Your name must be at least one character long",
        "expression": "validateStringLength({first-name}, 1)"
      }]
    },
    {
      name: "last-name",
      title: "Enter your last name:",
      type: "text",
      validators: [{
        "type": "expression",
        "text": "Your last name must be at least one character long",
        "expression": "validateStringLength({last-name}, 1)"
      }]
    },
    {
      "type": "paneldynamic",
      "name": "vacation-info",
      "title": "Enter information about your vacations",
      "panelCount": 1,
      "maxPanelCount": 10,
      "confirmDelete": true,
      "templateElements": [
        {
          "type": "dropdown",
          "name": "country",
          "title": "Select a country",
          "choicesByUrl": {
            "url": "https://surveyjs.io/api/CountriesExample",
            "valueName": "name"
          }
        },
        {
          "type": "text",
          "name": "start-date",
          "title": "Select a vacation start date",
          "defaultValueExpression": "today()",
          "inputType": "date",
          "visibleIf": "{panel.country} notempty"
        },
        {
          "type": "text",
          "name": "end-date",
          "startWithNewLine": false,
          "title": "Select a vacation end date",
          "defaultValueExpression": "today(10)",
          "validators": [
            {
              "type": "expression",
              "text": "End date should be greater than start date",
              "expression": "{panel.start-date} < {panel.end-date}"
            }
          ],
          "inputType": "date",
          "visibleIf": "{panel.country} notempty"
        },
        {
          "type": "html",
          "name": "days-spent",
          "readOnly": true,
          "html": "<b>Days spent in {panel.country}</b>: {panel.diffdays}",
          "titleLocation": "left",
          "visibleIf": "{panel.country} notempty and {panel.start-date} notempty and {panel.end-date} notempty and {panel.start-date} < {panel.end-date}"
        },
        {
          "type": "expression",
          "name": "diffdays",
          "expression": "iif({panel.start-date} < {panel.end-date}, diffDays({panel.start-date}, {panel.end-date}), 0)",
          "visible": false
        }
      ]
    }
    ]
  },
  {
    elements: [{
      name: "satisfaction",
      title: "Are you going to enjoy your vacation",
      type: "radiogroup",
      choices: [
        { value: false, text: "No" },
        { value: true, text: "Yes!" }
      ],
      isRequired: true
    }]
  }],
  pageNextText: "Forward",
  completeText: "Submit",
  showPrevButton: false,
  firstPageIsStartPage: true,
  startSurveyText: "Take the Survey",
  completedHtml: "Thank you for your feedback!",
  showPreviewBeforeComplete: "showAnsweredQuestions"
}