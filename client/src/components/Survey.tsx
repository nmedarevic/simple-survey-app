import { FunctionFactory, Model } from 'survey-core';
import 'survey-core/survey-core.css';
import { Survey } from 'survey-react-ui';
import { SharpLight } from "survey-core/themes";
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { GetSurveyDocument, SubmitSurveyDocument } from '../schemaTypes/graphql';
import { useAuth } from '../contexts/AuthContext';

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

export default function SurveyComponent() {
  const {user} = useAuth()
  const [config, setConfig] = useState<any>(null)
  const [schemaId, setSchemaId] = useState<string>("")
  const { refetch } = useQuery(GetSurveyDocument, {skip: true});
  const [mutate] = useMutation(SubmitSurveyDocument)
  
  useEffect(() => {
    const fetchConfig = async () => {
      const result = await refetch()

      if (result.data?.survey) {
        setConfig(JSON.parse(result.data.survey.schema))
        setSchemaId(result.data.survey.id)
      }
    }

    fetchConfig()
  }, [])

  const surveyComplete = useCallback((survey: Model) => {
    const userId = user?.id
    survey.setValue("userId", userId);
    const results = JSON.stringify(survey.data);
    
    mutate({variables: {
      data: results,
      survey_id: schemaId
    }})
  }, [user]);


  if (!config) {
    return <div>Loading</div>
  }

  const survey = new Model(config);
  survey.applyTheme(SharpLight);

  

  FunctionFactory.Instance.register("validateStringLength", validateStringLength);
  survey.onComplete.add(surveyComplete);
  survey.validationAllowSwitchPages = true;

  return <Survey model={survey} />;;
}