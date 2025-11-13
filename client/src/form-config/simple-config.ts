export type SurveyValidator = {
  type: string;
  text: string;
  expression: string;
};

export type ChoicesByUrl = {
  url: string;
  valueName: string;
};

export type SurveyElement = {
  name: string;
  title?: string;
  type: string;
  expression?: string;
  validators?: SurveyValidator[];
  panelCount?: number;
  maxPanelCount?: number;
  confirmDelete?: boolean;
  templateElements?: SurveyElement[];
  choicesByUrl?: ChoicesByUrl;
  inputType?: string;
  defaultValueExpression?: string;
  startWithNewLine?: boolean;
  visibleIf?: string;
  visible?: boolean;
  readOnly?: boolean;
  html?: string;
  titleLocation?: string;
};

export type SurveyConfig = {
  elements: SurveyElement[];
};

export const simpleConfig: SurveyConfig = {
  elements: [{
    name: "FirstName",
    title: "Enter your first name:",
    type: "text",
    validators: [{
      "type": "expression",
      "text": "Your answer must contain the word \"survey\"",
      "expression": "validateStringLength({firstName}, 5)"
    }]
  }, {
    name: "LastName",
    title: "Enter your last name:",
    type: "text"
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
}