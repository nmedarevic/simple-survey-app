import { Role } from "../graphql/gqlTypes";

// Users table model
export type UserModel = {
  id: number;
  email: string;
  password: string;
  role: Role;
  created_at: string;
}

// Surveys table model
export type SurveyModel = {
  id: number;
  data: string;
  created_by: number | null;
  created_at: string;
}

// Survey responses table model
export type SurveyResponseModel = {
  id: number;
  survey_id: number;
  user_id: number | null;
  responses: string;
  submitted_at: string;
}

