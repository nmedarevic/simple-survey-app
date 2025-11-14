import type { FormEvent } from 'react';
import InputField from '../molecules/InputField';
import Button from '../atoms/Button';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: FormEvent) => void;
}

const LoginForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <InputField
        label="Email Address"
        id="email"
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
        placeholder="Enter your email"
      />

      <InputField
        label="Password"
        id="password"
        type="password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        required
        placeholder="Enter your password"
      />

      <Button type="submit" fullWidth>
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;

