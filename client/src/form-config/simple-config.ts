export type SurveyElement = {
  name: string;
  title: string;
  type: string;
};

export type SurveyConfig = {
  elements: SurveyElement[];
};

export const simpleConfig: SurveyConfig = {
  elements: [{
    name: "FirstName",
    title: "Enter your first name:",
    type: "text"
  }, {
    name: "LastName",
    title: "Enter your last name:",
    type: "text"
  }]
}