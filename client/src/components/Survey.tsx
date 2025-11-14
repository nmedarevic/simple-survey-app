import { FunctionFactory, Model } from 'survey-core';
import 'survey-core/survey-core.css';
import { Survey } from 'survey-react-ui';
import { SharpLight } from "survey-core/themes";
import { useCallback } from 'react';

export type SurveyComponentProps = {
  config: any
}

function validateStringLength(params: any[], _?: any[] | undefined) {
  console.log('\n\n', params, '\n\n');
  if (!params || params && params.length === 0) {
    return false
  }
  
  const value = params[0]

  if (typeof value === "undefined") {
    return false
  }

  const length = params[1]

  return value.length >= length
}

export default function SurveyComponent({config}: SurveyComponentProps) {
  const survey = new Model(config);
  survey.applyTheme(SharpLight);

  const surveyComplete = useCallback((survey: Model) => {
    const userId = "1"
    survey.setValue("userId", userId);
    const results = JSON.stringify(survey.data);
    console.log('\n\n', results, '\n\n');
  }, []);
  FunctionFactory.Instance.register("validateStringLength", validateStringLength);
  survey.onComplete.add(surveyComplete);
  survey.validationAllowSwitchPages = true;

  return <Survey model={survey} />;;
}