import { ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'label';
  className?: string;
  color?: 'default' | 'muted' | 'primary' | 'error';
}

const Text = ({ 
  children, 
  variant = 'body', 
  className = '',
  color = 'default'
}: TextProps) => {
  const colorStyles = {
    default: 'text-gray-900',
    muted: 'text-gray-600',
    primary: 'text-indigo-600',
    error: 'text-red-600',
  };

  const variantStyles = {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-semibold',
    h3: 'text-xl font-semibold',
    body: 'text-base',
    small: 'text-sm',
    label: 'text-sm font-medium',
  };

  const Component = variant.startsWith('h') ? variant : 'p';

  return (
    <Component className={`${variantStyles[variant]} ${colorStyles[color]} ${className}`}>
      {children}
    </Component>
  );
};

export default Text;

