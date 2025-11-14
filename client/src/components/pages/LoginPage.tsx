import { useState } from 'react';
import LoginHeader from '../organisms/LoginHeader';
import LoginForm from '../organisms/LoginForm';
import { useMutation } from "@apollo/client/react";
import { LoginDocument } from '../../schemaTypes/graphql';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mutate, {loading}] = useMutation(LoginDocument);
  const {login, fetchMe} = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await mutate({variables: {
      email,
      password
    }});

    const token = result.data?.login

    if (token) {
      login(token)

      await fetchMe()
    } else {
      console.error('Login failed: No token received');
    }
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

        {loading && (
          <div className="mt-4 text-center text-gray-600">
            Logging in...
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

