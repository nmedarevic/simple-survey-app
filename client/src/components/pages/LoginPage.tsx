import { useEffect, useState } from 'react';
import LoginHeader from '../organisms/LoginHeader';
import LoginForm from '../organisms/LoginForm';
import { useMutation } from "@apollo/client/react";
import { LoginDocument, Role } from '../../schemaTypes/graphql';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoadingFallback } from '../atoms/Loading';

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mutate, {loading}] = useMutation(LoginDocument);
  const {login, fetchMe, isAuthenticated, user} = useAuth()

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

  useEffect(() => {
    if (user?.role === Role.Responder) {
      navigate('/responder/survey', { replace: true });

      return
    }

    if (user?.role === Role.Reviewer) {
      navigate('/responder/survey', { replace: true });

      return
    }

  }, [isAuthenticated, user])

  return (
    <div className="min-h-screen theme-primary flex items-center justify-center px-4">
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
          <LoadingFallback />
        )}
      </div>
    </div>
  );
};

export default LoginPage;

