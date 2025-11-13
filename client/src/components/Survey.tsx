import { Model } from 'survey-core';
import 'survey-core/survey-core.css';
import { Survey } from 'survey-react-ui';
import type { SurveyConfig } from '../form-config/simple-config';
import { SharpLight } from "survey-core/themes";


export type SurveyComponentProps = {
  config: SurveyConfig
}

export default function SurveyComponent({config}: SurveyComponentProps) {
  const survey = new Model(config);
  survey.applyTheme(SharpLight)

  return <Survey model={survey} />;;
}