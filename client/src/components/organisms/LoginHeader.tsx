interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

const LoginHeader = ({ 
  title = 'Welcome Back', 
  subtitle = 'Please sign in to your account' 
}: LoginHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};

export default LoginHeader;

