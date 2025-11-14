import { Role } from "../../graphql/gqlTypes";

export type UserModel = {
  id: number;
  email: string;
  password: string;
  role: Role;
  created_at: string;
}