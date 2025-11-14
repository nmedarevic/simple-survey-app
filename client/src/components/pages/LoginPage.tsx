import { useState } from 'react';
import LoginHeader from '../organisms/LoginHeader';
import LoginForm from '../organisms/LoginForm';
import { graphql } from '../../schemaTypes/gql';
import { useMutation } from "@apollo/client/react";
import { gql } from '@apollo/client';
import { LoginDocument } from '../../schemaTypes/graphql';

// const LoginQuery = graphql(`
//   mutation Login($email: String!, $password: String!) {
//     login(email: $email, password: $password)
//   }
// `);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mutate, result2] = useMutation(LoginDocument);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await mutate({variables: {
      email,
      password
    }});

    const token = result.data?.login

    console.log('\n\n', token, result, result2,'\n\n');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <LoginHeader />
        <LoginForm
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default LoginPage;

