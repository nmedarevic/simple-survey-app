import { useAuth } from '../contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import { Role } from '../schemaTypes/graphql';
import SurveyPage from './pages/SurveyPage';


const ResponderRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (isAuthenticated && user?.role === Role.Responder) {
    return <SurveyPage />
  }

  return <></>;
};

export default ResponderRoute;

